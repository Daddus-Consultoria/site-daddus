import { Pool, type QueryResultRow } from "pg";

/**
 * Conexao com o banco da Biblioteca Daddus.
 *
 * Diferente do resto do site — que consome o Strapi por HTTP —, a Biblioteca
 * guarda dezenas de milhares de registros de fontes externas e precisa de
 * busca por relevancia, facetas e deduplicacao. Isso vive em Postgres.
 *
 * Este modulo so pode ser importado do servidor (route handlers, server
 * components e scripts de coleta): DATABASE_URL nao tem prefixo NEXT_PUBLIC e
 * ficaria indefinida no cliente.
 */

const globalForPool = globalThis as unknown as { daddusLibraryPool?: Pool };

const createPool = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL nao configurada — a Biblioteca precisa do Postgres. Ver docs/BIBLIOTECA.md."
    );
  }

  return new Pool({
    connectionString,
    // Bancos gerenciados (Neon, Supabase) exigem TLS; o Postgres local do
    // ambiente de desenvolvimento nao tem certificado.
    ssl: /localhost|127\.0\.0\.1/.test(connectionString)
      ? undefined
      : { rejectUnauthorized: false },
    max: 8,
    idleTimeoutMillis: 30_000,
  });
};

/**
 * Singleton de modulo: o hot reload do Next reavalia o modulo a cada edicao e,
 * sem isso, cada recarga abriria um pool novo ate o banco recusar conexoes.
 */
export const getPool = (): Pool => {
  if (!globalForPool.daddusLibraryPool) {
    globalForPool.daddusLibraryPool = createPool();
  }

  return globalForPool.daddusLibraryPool;
};

export const query = async <T extends QueryResultRow>(
  text: string,
  params: ReadonlyArray<unknown> = []
): Promise<T[]> => {
  const result = await getPool().query<T>(text, params as unknown[]);

  return result.rows;
};
