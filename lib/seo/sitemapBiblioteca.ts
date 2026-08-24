import { documentTypeRoutes } from "@/lib/biblioteca/constants";
import type { LibraryDocumentType } from "@/lib/biblioteca/types";
import { query } from "@/lib/db/pool";

import type { SitemapEntry } from "./sitemap";

/**
 * A Biblioteca no sitemap.
 *
 * As fichas sao indexaveis porque o que publicamos e o registro de metadados,
 * com link para a origem — ver docs/BIBLIOTECA.md, secao "Direitos".
 *
 * Se o banco estiver fora, cada funcao devolve vazio: o sitemap perde a
 * Biblioteca mas continua valido para o resto do site.
 */

export const libraryDocumentCount = async (): Promise<number> => {
  try {
    const [row] = await query<{ total: string }>(
      "SELECT COUNT(*)::text AS total FROM library_documents"
    );

    return Number(row?.total ?? 0);
  } catch (error) {
    console.error("Sitemap sem a Biblioteca:", error);

    return 0;
  }
};

/** Entrada da area e os recortes com endereco proprio: temas e tipos. */
export const libraryRecorteEntries = async (): Promise<SitemapEntry[]> => {
  try {
    const [topics, types] = await Promise.all([
      query<{ slug: string }>(
        "SELECT slug FROM library_topics WHERE active ORDER BY position"
      ),
      query<{ document_type: LibraryDocumentType }>(
        "SELECT DISTINCT document_type FROM library_documents"
      ),
    ]);

    return [
      { path: "/biblioteca", priority: 0.9, changeFrequency: "daily" as const },
      ...topics.map((topic) => ({
        path: `/biblioteca/${topic.slug}`,
        priority: 0.7,
        changeFrequency: "weekly" as const,
      })),
      ...types
        .map((type) => documentTypeRoutes[type.document_type])
        // Tipo do banco fora da tabela de rotas nao tem pagina — omitir e
        // melhor do que anunciar `/biblioteca/undefined`.
        .filter(Boolean)
        .map((route) => ({
          path: `/biblioteca/${route}`,
          priority: 0.7,
          changeFrequency: "weekly" as const,
        })),
    ];
  } catch (error) {
    console.error("Sitemap sem os recortes da Biblioteca:", error);

    return [];
  }
};

/**
 * Uma fatia das fichas. Ordena por id, e nao por `updated_at`: a ordem precisa
 * ser estavel entre uma fatia e a seguinte, senao uma coleta no meio da leitura
 * faria documentos pularem de fatia — alguns contados duas vezes, outros nenhuma.
 */
export const libraryDocumentEntries = async (
  offset: number,
  limit: number
): Promise<SitemapEntry[]> => {
  try {
    const documents = await query<{ slug: string; updated_at: Date }>(
      `SELECT slug, updated_at FROM library_documents
        ORDER BY id
        LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return documents.map((document) => ({
      path: `/biblioteca/documento/${document.slug}`,
      lastModified: document.updated_at,
      priority: 0.5,
      changeFrequency: "yearly" as const,
    }));
  } catch (error) {
    console.error("Sitemap sem as fichas da Biblioteca:", error);

    return [];
  }
};
