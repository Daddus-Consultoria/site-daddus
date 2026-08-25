/**
 * Coleta das series de indicadores.
 *
 *   yarn indicadores:coletar                    # todos os indicadores ativos
 *   yarn indicadores:coletar ipca               # so um, pelo slug
 *   yarn indicadores:coletar --frequency=diaria # os dessa periodicidade
 *   yarn indicadores:coletar --full             # ignora o ponto de parada
 *
 * Espelha `scripts/harvest.ts`, da Biblioteca: mesma ideia de fonte com
 * periodicidade, log de execucao e coleta incremental. Ver docs/INDICADORES.md.
 */
import type { PoolClient } from "pg";

import { getPool } from "../lib/db/pool";
import { fetchSgsSeries } from "../lib/indicadores/sgs";
import { fetchIpeadataMetadata, fetchIpeadataSeries } from "../lib/indicadores/ipeadata";
import type { IndicatorPoint } from "../lib/indicadores/types";

interface IndicatorRow {
  id: number;
  slug: string;
  name: string;
  external_id: string;
  frequency: string;
  protocol: string;
}

const parseArgs = () => {
  const args = process.argv.slice(2);
  const flags = new Map<string, string>();
  const positional: string[] = [];

  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value = "true"] = arg.slice(2).split("=");
      flags.set(key, value);
    } else {
      positional.push(arg);
    }
  });

  return {
    slug: positional[0] ?? null,
    full: flags.get("full") === "true",
    frequency: flags.get("frequency") ?? null,
  };
};

const loadIndicators = async (
  client: PoolClient,
  slug: string | null,
  frequency: string | null
): Promise<IndicatorRow[]> => {
  if (slug) {
    const { rows } = await client.query<IndicatorRow>(
      `SELECT i.id, i.slug, i.name, i.external_id, i.frequency, s.protocol
         FROM indicators i JOIN indicator_sources s ON s.id = i.source_id
        WHERE i.slug = $1`,
      [slug]
    );

    if (!rows.length) throw new Error(`Indicador "${slug}" nao cadastrado.`);

    return rows;
  }

  const { rows } = await client.query<IndicatorRow>(
    `SELECT i.id, i.slug, i.name, i.external_id, i.frequency, s.protocol
       FROM indicators i JOIN indicator_sources s ON s.id = i.source_id
      WHERE i.active AND s.active AND ($1::text IS NULL OR i.frequency = $1)
      ORDER BY i.category, i.display_order`,
    [frequency]
  );

  return rows;
};

/**
 * Ponto de parada: a ultima data ja gravada. Recomecamos nela, e nao no dia
 * seguinte, porque o upsert sobrescreve — e assim uma revisao do ultimo valor
 * publicado (rotina em indice de preco) entra sem precisar de --full.
 */
const lastReferenceDate = async (
  client: PoolClient,
  indicatorId: number
): Promise<string | null> => {
  const { rows } = await client.query<{ ultima: string | null }>(
    "SELECT to_char(MAX(reference_date), 'YYYY-MM-DD') AS ultima FROM indicator_values WHERE indicator_id = $1",
    [indicatorId]
  );

  return rows[0]?.ultima ?? null;
};

const fetchPoints = async (
  indicator: IndicatorRow,
  from: string | null
): Promise<IndicatorPoint[]> => {
  if (indicator.protocol === "bcb-sgs") {
    return fetchSgsSeries({ code: indicator.external_id, from });
  }

  if (indicator.protocol === "ipeadata") {
    return fetchIpeadataSeries(indicator.external_id);
  }

  throw new Error(
    `Protocolo "${indicator.protocol}" ainda nao implementado (${indicator.slug}).`
  );
};

/**
 * Grava a serie de uma vez so. Um INSERT por ponto faria milhares de idas ao
 * banco na primeira coleta do dolar, que tem serie diaria desde os anos 1980.
 *
 * `xmax = 0` distingue linha inserida de linha atualizada: o Postgres zera esse
 * campo em tupla nova, e nao ha outra forma de saber isso a partir do upsert.
 */
const upsertPoints = async (
  client: PoolClient,
  indicatorId: number,
  points: IndicatorPoint[]
): Promise<{ novos: number; atualizados: number; repetidos: number }> => {
  if (!points.length) return { novos: 0, atualizados: 0, repetidos: 0 };

  // Deduplicacao por data antes de gravar. O SGS expande a janela consultada
  // para o mes inteiro em series mensais: uma janela iniciada em 04/01/2007
  // devolve o ponto de 01/01/2007, que a janela anterior ja trouxe. Sem isto o
  // upsert recebe a mesma chave duas vezes no mesmo comando e o Postgres
  // recusa o lote inteiro ("ON CONFLICT DO UPDATE command cannot affect row a
  // second time"). Fica a ultima ocorrencia, que e a leitura mais recente.
  const unicos = new Map<string, IndicatorPoint>();
  points.forEach((point) => unicos.set(point.referenceDate, point));
  const serie = Array.from(unicos.values());

  const { rows } = await client.query<{ inserted: boolean }>(
    `INSERT INTO indicator_values (indicator_id, reference_date, reference_end, value, collected_at)
     SELECT $1, d.dt, d.fim, d.val, NOW()
       FROM unnest($2::date[], $3::date[], $4::numeric[]) AS d(dt, fim, val)
     ON CONFLICT (indicator_id, reference_date) DO UPDATE
        SET value = EXCLUDED.value,
            reference_end = EXCLUDED.reference_end,
            collected_at = NOW()
     RETURNING (xmax = 0) AS inserted`,
    [
      indicatorId,
      serie.map((p) => p.referenceDate),
      serie.map((p) => p.referenceEnd ?? null),
      serie.map((p) => p.value),
    ]
  );

  const novos = rows.filter((row) => row.inserted).length;

  return {
    novos,
    atualizados: rows.length - novos,
    repetidos: points.length - serie.length,
  };
};

const run = async () => {
  const { slug, full, frequency } = parseArgs();
  const pool = getPool();
  const client = await pool.connect();

  try {
    const indicators = await loadIndicators(client, slug, frequency);

    if (!indicators.length) {
      console.log("Nenhum indicador a coletar.");
      return;
    }

    let falhas = 0;

    for (const indicator of indicators) {
      const { rows } = await client.query<{ id: string }>(
        "INSERT INTO indicator_collections (indicator_id) VALUES ($1) RETURNING id",
        [indicator.id]
      );
      const collectionId = rows[0].id;

      try {
        const from = full ? null : await lastReferenceDate(client, indicator.id);
        const points = await fetchPoints(indicator, from);

        // O Ipeadata declara produtor e URL da fonte; guardamos a cada coleta
        // para que uma correcao na origem chegue ao site sem deploy.
        //
        // `producer` (o nome curto da tela) nao e tocado de proposito: a origem
        // devolve "FGV/Conj. Econ. - IGP", que e exato mas nao cabe num card. O
        // texto da origem vai para `producer_detail`, e a URL so preenche o que
        // a semente deixou vazio — o link de metodologia escrito a mao e mais
        // especifico que a home da instituicao.
        if (indicator.protocol === "ipeadata") {
          const meta = await fetchIpeadataMetadata(indicator.external_id);

          if (meta?.producer) {
            await client.query(
              `UPDATE indicators
                  SET producer_detail = $2,
                      methodology_url = COALESCE(methodology_url, $3)
                WHERE id = $1`,
              [indicator.id, meta.producer, meta.methodologyUrl]
            );
          }
        }

        const { novos, atualizados, repetidos } = await upsertPoints(
          client,
          indicator.id,
          points
        );

        await client.query(
          "UPDATE indicators SET last_collect_at = NOW() WHERE id = $1",
          [indicator.id]
        );
        await client.query(
          `UPDATE indicator_collections
              SET status = 'concluida', finished_at = NOW(),
                  values_seen = $2, values_new = $3, values_upd = $4
            WHERE id = $1`,
          [collectionId, points.length, novos, atualizados]
        );

        console.log(
          `${indicator.slug.padEnd(22)} ${String(points.length).padStart(6)} lidos · ${String(novos).padStart(5)} novos · ${String(atualizados).padStart(5)} atualizados · ${String(repetidos).padStart(4)} repetidos`
        );
      } catch (error) {
        // Uma serie fora do ar nao pode levar as outras junto: a coleta segue e
        // o processo so falha no fim, para que o Actions acuse o problema.
        falhas += 1;
        await client.query(
          `UPDATE indicator_collections
              SET status = 'falhou', finished_at = NOW(), error_message = $2
            WHERE id = $1`,
          [collectionId, String(error)]
        );
        console.error(`${indicator.slug.padEnd(22)} FALHOU — ${error}`);
      }
    }

    if (falhas) {
      throw new Error(`${falhas} de ${indicators.length} indicadores falharam.`);
    }
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
