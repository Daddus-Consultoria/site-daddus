/**
 * Diagnostico da Biblioteca.
 *
 *   yarn biblioteca:status
 *   DATABASE_URL='postgres://...' yarn biblioteca:status   # conferir producao
 *
 * Responde, em ordem, as perguntas que aparecem quando a area volta vazia:
 * a variavel existe? o banco responde? as tabelas existem? ha documento
 * dentro? quando foi a ultima coleta de cada fonte?
 */
import { getPool } from "../lib/db/pool";

const ok = (message: string) => console.log(`  ok    ${message}`);
const fail = (message: string) => console.log(`  falta ${message}`);

const hostOf = (url: string): string => {
  try {
    return new URL(url).host;
  } catch {
    return "(string de conexao invalida)";
  }
};

const run = async () => {
  console.log("\nBiblioteca Daddus — diagnostico\n");

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    fail("DATABASE_URL nao esta definida neste ambiente.");
    console.log(
      "\n  Configure a variavel na Vercel (Production e Preview) e como secret\n" +
        "  do repositorio, e rode este comando com ela apontando para o mesmo banco.\n"
    );
    process.exit(1);
  }

  ok(`DATABASE_URL aponta para ${hostOf(connectionString)}`);

  const pool = getPool();

  if (connectionString.includes(".railway.internal")) {
    fail("esta e a URL interna do Railway, que so funciona dentro do Railway.");
    console.log(
      "\n  O site roda na Vercel e a coleta roda no GitHub — os dois estao fora.\n" +
        "  No Railway, abra o Postgres → aba Variables e use a DATABASE_PUBLIC_URL\n" +
        "  (o endereco termina em .proxy.rlwy.net com uma porta).\n"
    );
    process.exit(1);
  }

  try {
    await pool.query("SELECT 1");
    ok("o banco respondeu");
  } catch (error) {
    const message = String(error);

    fail(`o banco nao respondeu: ${message}`);

    // Os dois enganos que mais aparecem trocando de provedor: TLS exigido de um
    // lado, indisponivel do outro. A mensagem crua do driver nao diz o que fazer.
    if (/does not support SSL/i.test(message)) {
      console.log(
        "\n  Este banco nao aceita conexao TLS. Acrescente ?sslmode=disable ao final\n" +
          "  da DATABASE_URL (ou &sslmode=disable, se ela ja tiver ? na string).\n"
      );
    } else if (/SSL|self.signed|certificate/i.test(message)) {
      console.log(
        "\n  Parece exigencia de TLS. Acrescente ?sslmode=require ao final da\n" +
          "  DATABASE_URL e tente de novo.\n"
      );
    }

    process.exit(1);
  }

  const { rows: tables } = await pool.query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name LIKE 'library_%'`
  );

  if (!tables.length) {
    fail("as tabelas da Biblioteca nao existem neste banco.");
    console.log(
      "\n  As migrations foram aplicadas em outro lugar — normalmente no Postgres\n" +
        "  local do ambiente de desenvolvimento. Rode, com a DATABASE_URL deste banco:\n\n" +
        "    yarn db:migrate\n" +
        "    yarn harvest ipea --full\n"
    );
    await pool.end();
    process.exit(1);
  }

  ok(`${tables.length} tabelas da Biblioteca presentes`);

  const { rows: sources } = await pool.query<{
    name: string;
    slug: string;
    active: boolean;
    frequency: string;
    documentos: string;
    ultima: Date | null;
  }>(
    `SELECT s.name, s.slug, s.active, s.frequency, s.last_harvest_at AS ultima,
            count(d.id)::text AS documentos
       FROM library_sources s
       LEFT JOIN library_documents d ON d.source_id = s.id
      GROUP BY s.id ORDER BY s.name`
  );

  const total = sources.reduce((sum, source) => sum + Number(source.documentos), 0);

  if (!total) {
    fail("as tabelas existem, mas nao ha nenhum documento indexado.");
    console.log("\n  Rode a coleta com a DATABASE_URL deste banco:\n\n    yarn harvest ipea --full\n");
  } else {
    ok(`${total.toLocaleString("pt-BR")} documentos indexados`);
  }

  console.log("\n  Fontes\n");
  console.log(
    ["  fonte".padEnd(12), "documentos".padStart(11), "  periodicidade", "  ultima coleta"].join("")
  );

  sources.forEach((source) => {
    console.log(
      [
        `  ${source.slug}${source.active ? "" : " (inativa)"}`.padEnd(12),
        Number(source.documentos).toLocaleString("pt-BR").padStart(11),
        `  ${source.frequency}`.padEnd(15),
        `  ${source.ultima ? source.ultima.toISOString().slice(0, 16).replace("T", " ") : "nunca"}`,
      ].join("")
    );
  });

  const { rows: harvests } = await pool.query<{
    slug: string;
    status: string;
    started_at: Date;
    error_message: string | null;
  }>(
    `SELECT s.slug, h.status, h.started_at, h.error_message
       FROM library_harvests h JOIN library_sources s ON s.id = h.source_id
      WHERE h.status = 'falhou' ORDER BY h.started_at DESC LIMIT 3`
  );

  if (harvests.length) {
    console.log("\n  Coletas que falharam\n");
    harvests.forEach((harvest) =>
      console.log(
        `  ${harvest.slug} em ${harvest.started_at.toISOString().slice(0, 16)}: ${String(
          harvest.error_message
        ).slice(0, 140)}`
      )
    );
  }

  console.log("");
  await pool.end();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
