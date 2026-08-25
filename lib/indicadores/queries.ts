/**
 * Consultas da area de Indicadores.
 *
 * So pode ser importado do servidor: puxa `lib/db/pool`, que depende de
 * DATABASE_URL. Ver docs/INDICADORES.md.
 */
import { query } from "../db/pool";
import type {
  IndicatorCategory,
  IndicatorFrequency,
  IndicatorUnit,
} from "./types";

export interface IndicatorSummary {
  slug: string;
  name: string;
  acronym: string | null;
  description: string;
  producer: string;
  producerDetail: string | null;
  methodologyUrl: string | null;
  sourceName: string;
  category: IndicatorCategory;
  unit: IndicatorUnit;
  decimals: number | null;
  frequency: IndicatorFrequency;
  /** Ultimo valor publicado, ou null enquanto a serie nao foi coletada. */
  latestValue: number | null;
  latestDate: string | null;
  /** Valor do periodo anterior, para mostrar a direcao sem inventar analise. */
  previousValue: number | null;
  /** Pontos recentes, do mais antigo ao mais novo, para o grafico de linha. */
  recent: { date: string; value: number }[];
  collectedAt: string | null;
}

interface SummaryRow {
  slug: string;
  name: string;
  acronym: string | null;
  description: string;
  producer: string;
  producer_detail: string | null;
  methodology_url: string | null;
  source_name: string;
  category: IndicatorCategory;
  unit: IndicatorUnit;
  decimals: number | null;
  frequency: IndicatorFrequency;
  latest_value: string | null;
  latest_date: string | null;
  previous_value: string | null;
  recent: { date: string; value: string }[] | null;
  collected_at: string | null;
}

/** Quantos pontos alimentam o grafico de cada card. */
const PONTOS_RECENTES = 24;

/**
 * Todos os indicadores ativos com o ultimo valor e a serie recente.
 *
 * Uma consulta so, com LATERAL: uma por indicador significaria 16 idas ao banco
 * a cada carregamento da pagina. O LATERAL corre o indice
 * (indicator_id, reference_date DESC), entao cada recorte le so o topo da serie
 * em vez de varrer os 10 mil pontos do dolar.
 */
export const getIndicatorsOverview = async (): Promise<IndicatorSummary[]> => {
  const rows = await query<SummaryRow>(
    `SELECT
       i.slug, i.name, i.acronym, i.description,
       i.producer, i.producer_detail, i.methodology_url,
       s.name AS source_name,
       i.category, i.unit, i.decimals, i.frequency,
       to_char(i.last_collect_at, 'YYYY-MM-DD') AS collected_at,
       to_char(ultimo.reference_date, 'YYYY-MM-DD') AS latest_date,
       ultimo.value::text AS latest_value,
       anterior.value::text AS previous_value,
       serie.pontos AS recent
     FROM indicators i
     JOIN indicator_sources s ON s.id = i.source_id
     LEFT JOIN LATERAL (
       SELECT v.reference_date, v.value
         FROM indicator_values v
        WHERE v.indicator_id = i.id
        ORDER BY v.reference_date DESC
        LIMIT 1
     ) ultimo ON TRUE
     LEFT JOIN LATERAL (
       SELECT v.value
         FROM indicator_values v
        WHERE v.indicator_id = i.id
        ORDER BY v.reference_date DESC
        OFFSET 1 LIMIT 1
     ) anterior ON TRUE
     LEFT JOIN LATERAL (
       SELECT json_agg(
                json_build_object('date', to_char(p.reference_date, 'YYYY-MM-DD'), 'value', p.value::text)
                ORDER BY p.reference_date
              ) AS pontos
         FROM (
           SELECT v.reference_date, v.value
             FROM indicator_values v
            WHERE v.indicator_id = i.id
            ORDER BY v.reference_date DESC
            LIMIT $1
         ) p
     ) serie ON TRUE
     WHERE i.active AND s.active
     ORDER BY i.category, i.display_order`,
    [PONTOS_RECENTES]
  );

  // NUMERIC volta do pg como string, de proposito (o driver nao arrisca perder
  // precisao em float). A conversao acontece aqui, num lugar so, para que a
  // interface receba numero e nao precise saber disso.
  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    acronym: row.acronym,
    description: row.description,
    producer: row.producer,
    producerDetail: row.producer_detail,
    methodologyUrl: row.methodology_url,
    sourceName: row.source_name,
    category: row.category,
    unit: row.unit,
    decimals: row.decimals,
    frequency: row.frequency,
    latestValue: row.latest_value === null ? null : Number(row.latest_value),
    latestDate: row.latest_date,
    previousValue:
      row.previous_value === null ? null : Number(row.previous_value),
    recent: (row.recent ?? []).map((ponto) => ({
      date: ponto.date,
      value: Number(ponto.value),
    })),
    collectedAt: row.collected_at,
  }));
};

/** Data da coleta mais recente, para declarar a atualizacao da pagina. */
export const getLastCollectionDate = async (): Promise<string | null> => {
  const rows = await query<{ ultima: string | null }>(
    `SELECT to_char(MAX(last_collect_at), 'YYYY-MM-DD') AS ultima FROM indicators WHERE active`
  );

  return rows[0]?.ultima ?? null;
};

/* -------------------------------------------------------------------------
 * Pagina de um indicador
 * ---------------------------------------------------------------------- */

/**
 * Pontos que alimentam o grafico da serie historica.
 *
 * O dolar tem ~10 mil pontos desde 1984 e a Selic ~10 mil desde 1986. Mandar
 * tudo para o navegador desenharia 10 mil comandos de path num SVG de 900px —
 * mais de um ponto por pixel, indistinguivel de 360, e centenas de KB por
 * visita. A reducao acontece no banco, que ja tem a serie ordenada.
 */
const PONTOS_GRAFICO = 360;

/** Periodos listados na tabela. O resto sai pelo CSV, que leva a serie toda. */
const PERIODOS_TABELA = 60;

export interface IndicatorPointRow {
  date: string;
  /** Fim do periodo, quando a origem o informa (TR e poupanca). */
  end: string | null;
  value: number;
}

export interface IndicatorDetail {
  slug: string;
  name: string;
  acronym: string | null;
  description: string;
  producer: string;
  producerDetail: string | null;
  methodologyUrl: string | null;
  sourceName: string;
  externalId: string;
  category: IndicatorCategory;
  unit: IndicatorUnit;
  decimals: number | null;
  frequency: IndicatorFrequency;
  collectedAt: string | null;
  /** Extensao da serie guardada, para a pagina declarar o que cobre. */
  firstDate: string | null;
  /**
   * A partir de quando os valores sao comparaveis entre si — o grafico comeca
   * aqui. NULL na maioria das series; ver a migration 009.
   */
  comparableFrom: string | null;
  lastDate: string | null;
  pointCount: number;
  latestValue: number | null;
  latestDate: string | null;
  previousValue: number | null;
  previousDate: string | null;
  /**
   * Maior e menor valor da serie, com a data. Sao leituras, nao calculo: o
   * numero exibido e um que a origem publicou. Variacao acumulada ficaria de
   * fora de proposito — somar indice de preco exige a metodologia do produtor,
   * e a Daddus nao apura indicador (docs/INDICADORES.md).
   */
  maxValue: number | null;
  maxDate: string | null;
  minValue: number | null;
  minDate: string | null;
}

interface DetailRow {
  slug: string;
  name: string;
  acronym: string | null;
  description: string;
  producer: string;
  producer_detail: string | null;
  methodology_url: string | null;
  source_name: string;
  external_id: string;
  category: IndicatorCategory;
  unit: IndicatorUnit;
  decimals: number | null;
  frequency: IndicatorFrequency;
  collected_at: string | null;
  comparable_from: string | null;
  first_date: string | null;
  last_date: string | null;
  point_count: string;
  latest_value: string | null;
  latest_date: string | null;
  previous_value: string | null;
  previous_date: string | null;
  max_value: string | null;
  max_date: string | null;
  min_value: string | null;
  min_date: string | null;
}

const numeroOuNulo = (valor: string | null): number | null =>
  valor === null ? null : Number(valor);

/** Slugs ativos — alimenta `generateStaticParams` e o sitemap. */
export const getIndicatorSlugs = async (): Promise<string[]> => {
  const rows = await query<{ slug: string }>(
    `SELECT i.slug
       FROM indicators i
       JOIN indicator_sources s ON s.id = i.source_id
      WHERE i.active AND s.active
      ORDER BY i.category, i.display_order`
  );

  return rows.map((row) => row.slug);
};

/**
 * Metadados e marcos da serie. Devolve null quando o slug nao existe ou o
 * indicador foi desativado, para a rota responder 404 em vez de uma tela vazia.
 */
export const getIndicatorDetail = async (
  slug: string
): Promise<IndicatorDetail | null> => {
  const rows = await query<DetailRow>(
    `SELECT
       i.slug, i.name, i.acronym, i.description,
       i.producer, i.producer_detail, i.methodology_url, i.external_id,
       s.name AS source_name,
       i.category, i.unit, i.decimals, i.frequency,
       to_char(i.last_collect_at, 'YYYY-MM-DD') AS collected_at,
       to_char(i.comparable_from, 'YYYY-MM-DD')  AS comparable_from,
       to_char(extensao.primeira, 'YYYY-MM-DD') AS first_date,
       to_char(extensao.ultima, 'YYYY-MM-DD')   AS last_date,
       extensao.total::text                      AS point_count,
       to_char(marcos.data_maior, 'YYYY-MM-DD') AS max_date,
       marcos.maior::text                       AS max_value,
       to_char(marcos.data_menor, 'YYYY-MM-DD') AS min_date,
       marcos.menor::text                       AS min_value,
       to_char(ultimo.reference_date, 'YYYY-MM-DD')   AS latest_date,
       ultimo.value::text                              AS latest_value,
       to_char(anterior.reference_date, 'YYYY-MM-DD') AS previous_date,
       anterior.value::text                            AS previous_value
     FROM indicators i
     JOIN indicator_sources s ON s.id = i.source_id
     LEFT JOIN LATERAL (
       -- Extensao do que esta guardado: e o que a ficha declara e o que o CSV
       -- entrega, entao cobre a serie inteira, inclusive o trecho anterior a
       -- janela comparavel.
       SELECT MIN(v.reference_date) AS primeira,
              MAX(v.reference_date) AS ultima,
              COUNT(*)              AS total
         FROM indicator_values v
        WHERE v.indicator_id = i.id
     ) extensao ON TRUE
     LEFT JOIN LATERAL (
       -- Extremos, ao contrario, respeitam a janela: o maior valor do dolar na
       -- serie inteira e 71.153, que era cruzeiro, e publicar isso como "maior
       -- valor" em reais seria o erro que a migration 009 descreve.
       SELECT MAX(v.value) AS maior,
              MIN(v.value) AS menor,
              (ARRAY_AGG(v.reference_date ORDER BY v.value DESC, v.reference_date))[1] AS data_maior,
              (ARRAY_AGG(v.reference_date ORDER BY v.value ASC,  v.reference_date))[1] AS data_menor
         FROM indicator_values v
        WHERE v.indicator_id = i.id
          AND (i.comparable_from IS NULL OR v.reference_date >= i.comparable_from)
     ) marcos ON TRUE
     LEFT JOIN LATERAL (
       SELECT v.reference_date, v.value
         FROM indicator_values v
        WHERE v.indicator_id = i.id
        ORDER BY v.reference_date DESC
        LIMIT 1
     ) ultimo ON TRUE
     LEFT JOIN LATERAL (
       SELECT v.reference_date, v.value
         FROM indicator_values v
        WHERE v.indicator_id = i.id
        ORDER BY v.reference_date DESC
        OFFSET 1 LIMIT 1
     ) anterior ON TRUE
     WHERE i.slug = $1 AND i.active AND s.active`,
    [slug]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    slug: row.slug,
    name: row.name,
    acronym: row.acronym,
    description: row.description,
    producer: row.producer,
    producerDetail: row.producer_detail,
    methodologyUrl: row.methodology_url,
    sourceName: row.source_name,
    externalId: row.external_id,
    category: row.category,
    unit: row.unit,
    decimals: row.decimals,
    frequency: row.frequency,
    collectedAt: row.collected_at,
    comparableFrom: row.comparable_from,
    firstDate: row.first_date,
    lastDate: row.last_date,
    pointCount: Number(row.point_count ?? 0),
    latestValue: numeroOuNulo(row.latest_value),
    latestDate: row.latest_date,
    previousValue: numeroOuNulo(row.previous_value),
    previousDate: row.previous_date,
    maxValue: numeroOuNulo(row.max_value),
    maxDate: row.max_date,
    minValue: numeroOuNulo(row.min_value),
    minDate: row.min_date,
  };
};

/**
 * Serie reduzida para o grafico, cobrindo o periodo inteiro.
 *
 * A reducao pega um a cada N pontos e preserva o primeiro e o ultimo, para o
 * eixo comecar e terminar nas datas reais da serie. Nao e media movel: media
 * inventaria valor que a origem nao publicou, e o eixo passaria a mostrar um
 * numero que nao existe em lugar nenhum.
 */
export const getIndicatorChartSeries = async (
  slug: string
): Promise<IndicatorPointRow[]> => {
  const rows = await query<{ date: string; end: string | null; value: string }>(
    `SELECT date, "end", value FROM (
       SELECT to_char(v.reference_date, 'YYYY-MM-DD') AS date,
              to_char(v.reference_end,  'YYYY-MM-DD') AS "end",
              v.value::text                            AS value,
              v.reference_date                         AS ordem,
              ROW_NUMBER() OVER (ORDER BY v.reference_date) AS rn,
              COUNT(*)     OVER ()                          AS total
         FROM indicator_values v
         JOIN indicators i ON i.id = v.indicator_id
        WHERE i.slug = $1 AND i.active
          -- Fora da janela os valores estao em outra unidade (ver migration
          -- 009). A serie inteira continua no CSV.
          AND (i.comparable_from IS NULL OR v.reference_date >= i.comparable_from)
     ) t
     WHERE total <= $2
        OR rn = 1
        OR rn = total
        OR rn % ((total / $2)::int + 1) = 0
     ORDER BY ordem`,
    [slug, PONTOS_GRAFICO]
  );

  return rows.map((row) => ({
    date: row.date,
    end: row.end,
    value: Number(row.value),
  }));
};

/** Periodos recentes para a tabela, do mais novo para o mais antigo. */
export const getIndicatorTableRows = async (
  slug: string
): Promise<IndicatorPointRow[]> => {
  const rows = await query<{ date: string; end: string | null; value: string }>(
    `SELECT to_char(v.reference_date, 'YYYY-MM-DD') AS date,
            to_char(v.reference_end,  'YYYY-MM-DD') AS "end",
            v.value::text                            AS value
       FROM indicator_values v
       JOIN indicators i ON i.id = v.indicator_id
      WHERE i.slug = $1 AND i.active
      ORDER BY v.reference_date DESC
      LIMIT $2`,
    [slug, PERIODOS_TABELA]
  );

  return rows.map((row) => ({
    date: row.date,
    end: row.end,
    value: Number(row.value),
  }));
};

/**
 * Serie inteira, sem reducao — so o download de CSV usa isto. Fica separado
 * das consultas da tela para deixar explicito que e o unico caminho que carrega
 * 10 mil linhas de uma vez.
 */
export const getIndicatorFullSeries = async (
  slug: string
): Promise<IndicatorPointRow[]> => {
  const rows = await query<{ date: string; end: string | null; value: string }>(
    `SELECT to_char(v.reference_date, 'YYYY-MM-DD') AS date,
            to_char(v.reference_end,  'YYYY-MM-DD') AS "end",
            v.value::text                            AS value
       FROM indicator_values v
       JOIN indicators i ON i.id = v.indicator_id
      WHERE i.slug = $1 AND i.active
      ORDER BY v.reference_date`,
    [slug]
  );

  return rows.map((row) => ({
    date: row.date,
    end: row.end,
    value: Number(row.value),
  }));
};

/** Contagem de periodos por indicador, para o card linkar com contexto. */
export const getIndicatorTotals = async (): Promise<number> => {
  const rows = await query<{ total: string }>(
    `SELECT COUNT(*)::text AS total FROM indicator_values`
  );

  return Number(rows[0]?.total ?? 0);
};
