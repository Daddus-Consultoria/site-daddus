import { SITEMAP_CHUNK_SIZE, urlsetXml, xmlResponse } from "@/lib/seo/sitemap";
import { libraryDocumentEntries } from "@/lib/seo/sitemapBiblioteca";

/**
 * Uma fatia das fichas da Biblioteca. O segmento chega como "1.xml", "2.xml" —
 * o `.xml` esta no endereco porque e o que os validadores de sitemap esperam.
 */
export const revalidate = 3600;

export async function GET(_request: Request, { params }: { params: { pagina: string } }) {
  const page = Number.parseInt(params.pagina, 10);

  // Fatia zero, negativa ou "abc.xml" nao existe: devolve vazio em vez de uma
  // consulta com OFFSET negativo.
  if (!Number.isFinite(page) || page < 1) {
    return xmlResponse(urlsetXml([]));
  }

  const entries = await libraryDocumentEntries(
    (page - 1) * SITEMAP_CHUNK_SIZE,
    SITEMAP_CHUNK_SIZE
  );

  return xmlResponse(urlsetXml(entries));
}
