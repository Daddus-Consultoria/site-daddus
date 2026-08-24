import {
  SITEMAP_CHUNK_SIZE,
  sitemapIndexXml,
  xmlResponse,
} from "@/lib/seo/sitemap";
import { libraryDocumentCount } from "@/lib/seo/sitemapBiblioteca";

/**
 * Indice de sitemaps — o endereco que se registra no Search Console.
 *
 * Aponta para um sitemap por area, e para tantas fatias de fichas da Biblioteca
 * quantas o acervo exigir. O numero de fatias sai da contagem do banco, entao
 * uma coleta que dobre o acervo nao exige mexer aqui.
 */
export const revalidate = 3600;

export async function GET() {
  const total = await libraryDocumentCount();
  const chunks = Math.max(1, Math.ceil(total / SITEMAP_CHUNK_SIZE));

  return xmlResponse(
    sitemapIndexXml([
      "/sitemap-site.xml",
      "/sitemap-publicacoes.xml",
      "/sitemap-blog.xml",
      "/sitemap-biblioteca.xml",
      ...Array.from(
        { length: chunks },
        (_, index) => `/sitemap-biblioteca-documentos/${index + 1}.xml`
      ),
    ])
  );
}
