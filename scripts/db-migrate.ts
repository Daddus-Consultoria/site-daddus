/**
 * Aplica as migrations de db/migrations em ordem alfabetica, uma vez cada.
 *
 *   yarn db:migrate
 *
 * Nao ha rollback: cada arquivo deve ser escrito de forma idempotente
 * (CREATE ... IF NOT EXISTS, ON CONFLICT DO NOTHING).
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { getPool } from "../lib/db/pool";

const MIGRATIONS_DIR = join(process.cwd(), "db", "migrations");

const run = async () => {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name       TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const applied = new Set(
    (await pool.query<{ name: string }>("SELECT name FROM _migrations")).rows.map(
      (row) => row.name
    )
  );

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  let count = 0;

  for (const file of files) {
    if (applied.has(file)) continue;

    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    const client = await pool.connect();

    try {
      // Uma transacao por arquivo: uma migration pela metade e pior do que
      // nenhuma, porque a proxima execucao acha que ja foi aplicada.
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO _migrations (name) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`aplicada: ${file}`);
      count += 1;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`falhou: ${file}`);
      throw error;
    } finally {
      client.release();
    }
  }

  console.log(count ? `${count} migration(s) aplicada(s).` : "nada a aplicar.");
  await pool.end();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
