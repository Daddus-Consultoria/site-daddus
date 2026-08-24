import { transformCategory } from "@/lib/constants/constants";
import { PostsUseCases } from "@/lib/useCases/postsUseCases";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";

import type { SitemapEntry } from "./sitemap";

/**
 * Conteudo do CMS no sitemap.
 *
 * Estudos, guias, perfis municipais e posts nunca foram anunciados: o sitemap
 * listava so as paginas de listagem. Como as proprias listagens sao montadas no
 * cliente, o buscador nao tinha por onde chegar ate uma publicacao — nem pelo
 * sitemap, nem pelo link.
 */

const PAGE_SIZE = 100;

/**
 * Teto de seguranca da varredura. Se o acervo passar disto, o excesso fica de
 * fora e o log avisa — em vez de o sitemap encolher em silencio.
 */
const MAX_PAGES = 30;

const warnIfTruncated = (label: string, collected: number, total: number) => {
  if (collected < total) {
    console.warn(
      `Sitemap ${label}: ${collected} de ${total} itens. Aumente MAX_PAGES em lib/seo/sitemapSources.ts.`
    );
  }
};

/** Publicacoes proprias, com o segmento de rota de cada tipo. */
export const publishEntries = async (): Promise<SitemapEntry[]> => {
  const useCases = new PublishUseCases();
  const entries: SitemapEntry[] = [];
  let total = 0;

  try {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const { items, totalItems } = await useCases.searchPublish({
        page,
        limit: PAGE_SIZE,
        order: "desc",
      });

      total = totalItems;

      items.forEach((publish) => {
        const segment = transformCategory[publish.category];

        // Publicacao sem slug ou com categoria fora do enum nao tem endereco:
        // anuncia-la geraria um 404 no relatorio de cobertura.
        if (!publish.slug || !segment) return;

        entries.push({
          path: `/conteudos/publicacoes/${segment}/${publish.slug}`,
          lastModified: publish.publishDate,
          priority: 0.7,
          changeFrequency: "monthly",
        });
      });

      if (!items.length || entries.length >= totalItems) break;
    }

    warnIfTruncated("publicações", entries.length, total);
  } catch (error) {
    // Um sitemap sem as publicacoes ainda e valido para o resto do site; um
    // sitemap que devolve erro derruba a leitura inteira.
    console.error("Sitemap sem as publicações:", error);
  }

  return entries;
};

/** Posts do blog. O endereco usa a categoria crua do CMS, como os links. */
export const postEntries = async (): Promise<SitemapEntry[]> => {
  const useCases = new PostsUseCases();
  const entries: SitemapEntry[] = [];
  let total = 0;

  try {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const { posts, totalItems } = await useCases.getPosts({
        limit: PAGE_SIZE,
        currentIndex: page,
        order: "desc",
      });

      total = totalItems;

      posts.forEach((post) => {
        if (!post.slug || !post.category) return;

        entries.push({
          path: `/blog/${post.category}/${post.slug}`,
          lastModified: post.publishedDate,
          priority: 0.6,
          changeFrequency: "monthly",
        });
      });

      if (!posts.length || entries.length >= totalItems) break;
    }

    warnIfTruncated("posts", entries.length, total);
  } catch (error) {
    console.error("Sitemap sem os posts:", error);
  }

  return entries;
};
