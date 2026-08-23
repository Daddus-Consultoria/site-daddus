/**
 * Reaplica as regras de tema ao acervo ja indexado.
 *
 *   yarn biblioteca:reclassificar --simular   # so mede, nao grava
 *   yarn biblioteca:reclassificar             # grava
 *   yarn biblioteca:reclassificar --fonte=ipea
 *
 * Ate aqui, mudar uma regra em `library_topic_rules` so valia para o que fosse
 * coletado dali em diante, e reclassificar o acervo exigia recoletar a fonte
 * inteira — horas de rede para reaplicar um regex sobre texto que ja esta no
 * banco. As regras existem para a equipe ajustar sem deploy; ajustar sem
 * recoletar e a outra metade disso.
 *
 * `--simular` roda a classificacao e mostra o efeito sem gravar nada, que e o
 * jeito de conferir uma regra nova antes de deixa-la mexer no acervo.
 */
import { getPool } from "../lib/db/pool";
import { buildHaystack, classify, loadTopicRules } from "../lib/biblioteca/classify";

const LOTE = 500;

interface DocRow {
  id: string;
  title: string;
  subtitle: string | null;
  keywords: string[];
  abstract: string | null;
  temas_atuais: number[];
}

const run = async () => {
  const args = process.argv.slice(2);
  const simular = args.includes("--simular");
  const fonte = args.find((a) => a.startsWith("--fonte="))?.split("=")[1] ?? null;

  const pool = getPool();
  const client = await pool.connect();

  try {
    const rules = await loadTopicRules(client);
    console.log(`\n${rules.length} regras carregadas${fonte ? ` — fonte ${fonte}` : ""}.`);
    console.log(simular ? "modo simulacao: nada sera gravado.\n" : "");

    let processados = 0;
    let alterados = 0;
    let ligacoesAntes = 0;
    let ligacoesDepois = 0;
    let semTemaAntes = 0;
    let semTemaDepois = 0;
    let ultimoId = "0";

    // Contagem por tema, para julgar regra a regra: um total que melhora pode
    // esconder um tema que passou a capturar o que nao e dele.
    const porTemaAntes = new Map<number, number>();
    const porTemaDepois = new Map<number, number>();
    const conta = (mapa: Map<number, number>, ids: number[]) =>
      ids.forEach((id) => mapa.set(id, (mapa.get(id) ?? 0) + 1));

    for (;;) {
      const { rows } = await client.query<DocRow>(
        `SELECT d.id::text, d.title, d.subtitle, d.keywords, d.abstract,
                COALESCE(array_agg(dt.topic_id) FILTER (WHERE dt.topic_id IS NOT NULL), '{}') AS temas_atuais
           FROM library_documents d
           LEFT JOIN library_document_topics dt ON dt.document_id = d.id
           JOIN library_sources s ON s.id = d.source_id
          WHERE d.id > $1::bigint AND ($2::text IS NULL OR s.slug = $2)
          GROUP BY d.id
          ORDER BY d.id
          LIMIT ${LOTE}`,
        [ultimoId, fonte]
      );

      if (!rows.length) break;

      for (const row of rows) {
        const antes = [...row.temas_atuais].sort((a, b) => a - b);
        const depois = classify(rules, buildHaystack(row)).sort((a, b) => a - b);

        processados += 1;
        ligacoesAntes += antes.length;
        ligacoesDepois += depois.length;
        if (!antes.length) semTemaAntes += 1;
        if (!depois.length) semTemaDepois += 1;
        conta(porTemaAntes, antes);
        conta(porTemaDepois, depois);

        if (antes.join(",") === depois.join(",")) continue;

        alterados += 1;

        if (!simular) {
          await client.query("DELETE FROM library_document_topics WHERE document_id = $1", [row.id]);

          if (depois.length) {
            await client.query(
              `INSERT INTO library_document_topics (document_id, topic_id)
               SELECT $1::bigint, unnest($2::int[]) ON CONFLICT DO NOTHING`,
              [row.id, depois]
            );
          }
        }
      }

      ultimoId = rows[rows.length - 1].id;
      process.stdout.write(`\r  ${processados} documentos processados`);
    }

    const pct = (n: number) =>
      processados ? `${(((processados - n) / processados) * 100).toFixed(1)}%` : "—";

    console.log(`\n
  documentos            ${processados.toLocaleString("pt-BR")}
  com mudanca de tema   ${alterados.toLocaleString("pt-BR")}
  ligacoes documento-tema  ${ligacoesAntes.toLocaleString("pt-BR")} -> ${ligacoesDepois.toLocaleString("pt-BR")}
  com pelo menos um tema   ${pct(semTemaAntes)} -> ${pct(semTemaDepois)}
`);

    const { rows: temas } = await client.query<{ id: number; name: string }>(
      "SELECT id, name FROM library_topics WHERE active ORDER BY position"
    );

    const mudou = temas
      .map((tema) => ({
        nome: tema.name,
        antes: porTemaAntes.get(tema.id) ?? 0,
        depois: porTemaDepois.get(tema.id) ?? 0,
      }))
      .filter((linha) => linha.antes !== linha.depois)
      .sort((a, b) => Math.abs(b.depois - b.antes) - Math.abs(a.depois - a.antes));

    if (mudou.length) {
      console.log("  Por tema\n");
      mudou.forEach((linha) => {
        const delta = linha.depois - linha.antes;
        console.log(
          `  ${linha.nome.padEnd(26)} ${String(linha.antes).padStart(6)} -> ${String(
            linha.depois
          ).padStart(6)}   ${delta > 0 ? "+" : ""}${delta}`
        );
      });
      console.log("");
    }

    if (simular) console.log("  (simulacao — nada foi gravado)\n");
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
