import { urlsetXml, xmlResponse } from "@/lib/seo/sitemap";
import { postEntries } from "@/lib/seo/sitemapSources";

/** Posts do blog. */
export const revalidate = 3600;

export async function GET() {
  return xmlResponse(urlsetXml(await postEntries()));
}
