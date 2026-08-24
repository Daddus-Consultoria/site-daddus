import { SITE_URL, absoluteUrl } from "./constants";

/**
 * Serializacao de sitemap.
 *
 * O site escreve o XML em vez de usar `app/sitemap.ts` do Next porque precisa
 * de duas coisas que a convencao nao entrega junto: um indice
 * (`<sitemapindex>`, que o Next nunca gera) e fatias sob demanda para a
 * Biblioteca, cujo acervo passa de dezenas de milhares de fichas e cresce a
 * cada coleta. Com um arquivo unico e teto fixo, tudo o que passasse do teto
 * simplesmente nunca seria anunciado.
 */

/** Teto do protocolo e 50 mil; 10 mil mantem cada resposta leve. */
export const SITEMAP_CHUNK_SIZE = 10_000;

export interface SitemapEntry {
  path: string;
  lastModified?: Date | string | null;
  /** Prioridade relativa dentro do proprio site. Omitida quando indiferente. */
  priority?: number;
  changeFrequency?: "daily" | "weekly" | "monthly" | "yearly";
}

/** `&`, `<` e `"` em slug ou parametro quebram o XML se nao forem escapados. */
const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const toIso = (value: Date | string | null | undefined): string | null => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const urlsetXml = (entries: SitemapEntry[]): string => {
  const urls = entries
    .map((entry) => {
      const lastModified = toIso(entry.lastModified);

      return [
        "  <url>",
        `    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>`,
        lastModified ? `    <lastmod>${lastModified}</lastmod>` : null,
        entry.changeFrequency ? `    <changefreq>${entry.changeFrequency}</changefreq>` : null,
        entry.priority !== undefined ? `    <priority>${entry.priority.toFixed(1)}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

export const sitemapIndexXml = (paths: string[]): string => {
  const items = paths
    .map((path) => `  <sitemap>\n    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>\n  </sitemap>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
};

/** Cabecalhos comuns: XML e cache curto na borda, longo no revalidate da rota. */
export const xmlResponse = (body: string): Response =>
  new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
