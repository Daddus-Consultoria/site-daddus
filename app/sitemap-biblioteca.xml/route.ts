import { urlsetXml, xmlResponse } from "@/lib/seo/sitemap";
import { libraryRecorteEntries } from "@/lib/seo/sitemapBiblioteca";

/** Entrada da Biblioteca e os recortes por tema e por tipo. */
export const revalidate = 3600;

export async function GET() {
  return xmlResponse(urlsetXml(await libraryRecorteEntries()));
}
