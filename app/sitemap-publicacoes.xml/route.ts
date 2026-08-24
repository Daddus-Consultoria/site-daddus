import { urlsetXml, xmlResponse } from "@/lib/seo/sitemap";
import { publishEntries } from "@/lib/seo/sitemapSources";

/** Estudos, guias e perfis municipais publicados no CMS. */
export const revalidate = 3600;

export async function GET() {
  return xmlResponse(urlsetXml(await publishEntries()));
}
