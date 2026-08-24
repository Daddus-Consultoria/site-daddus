import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostLayout } from "@/components/post";
import { CategoryMap, type Post, type PostCategory } from "@/lib/interfaces/post";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { isoDate, metaDescription, pageMetadata } from "@/lib/seo/metadata";
import { ogImageResponse } from "@/lib/seo/ogImage";
import { PostsUseCases } from "@/lib/useCases/postsUseCases";

/**
 * Pagina de um post do blog.
 *
 * Mesma correcao das publicacoes: a rota era client component e o buscador
 * recebia o esqueleto de carregamento no lugar do texto. Agora o post e
 * buscado no servidor, com titulo, resumo e data proprios.
 */

/** Uma hora: o post e publicado no CMS, nao editado a cada acesso. */
export const POST_REVALIDATE = 3600;

/**
 * O corpo do post vem no formato de blocos do Strapi. Para a descricao de
 * busca precisamos so do texto corrido dos primeiros paragrafos — sem isso a
 * descricao viria vazia e o buscador inventaria o trecho.
 */
const blocksToText = (blocks: unknown): string => {
  if (!Array.isArray(blocks)) return "";

  const collect = (node: any): string => {
    if (typeof node?.text === "string") return node.text;
    if (Array.isArray(node?.children)) return node.children.map(collect).join("");

    return "";
  };

  return blocks.map(collect).join(" ").replace(/\s+/g, " ").trim();
};

/**
 * O service devolve `{}` quando o post nao existe, em vez de `null`. Sem esta
 * checagem a rota renderizaria uma pagina vazia com status 200 — que o buscador
 * indexaria como conteudo real.
 *
 * Ressalva: `getSinglePost` tambem devolve `{}` quando a chamada ao CMS falha,
 * entao aqui nao da para separar "post inexistente" de "CMS fora do ar", e as
 * duas situacoes viram 404. Para separar, o service precisaria deixar o erro
 * subir — como ja fazem os das publicacoes.
 */
const fetchPost = async (category: string, slug: string): Promise<Post | null> => {
  try {
    const post = await new PostsUseCases().getSinglePost({ category, slug });

    return post?.title ? post : null;
  } catch (error) {
    console.error(`Post ${category}/${slug} indisponível:`, error);

    return null;
  }
};

const categoryLabel = (category: string): string =>
  CategoryMap[category as PostCategory] ?? "Blog";

export async function postMetadata(category: string, slug: string): Promise<Metadata> {
  const post = await fetchPost(category, slug);
  const path = `/blog/${category}/${slug}`;

  if (!post) {
    return pageMetadata({
      title: "Post não encontrado",
      description: "O post buscado não está publicado no blog da Daddus.",
      path,
      index: false,
    });
  }

  return pageMetadata({
    title: post.title,
    description: metaDescription(
      post.authorComment || blocksToText(post.firstContent),
      `Publicado no blog da Daddus em ${categoryLabel(category)}.`
    ),
    path,
    type: "article",
    publishedTime: isoDate(post.publishedDate),
    authors: post.author?.name ? [post.author.name] : undefined,
  });
}

export async function renderPostPage(category: string, slug: string) {
  // O post decide se a pagina existe; as ultimas noticias sao guarnicao e uma
  // falha nelas nao pode derrubar a leitura.
  const [post, lastPosts] = await Promise.all([
    fetchPost(category, slug),
    new PostsUseCases().getPosts({ limit: 4, order: "desc" }).catch(() => null),
  ]);

  if (!post) notFound();

  const path = `/blog/${category}/${slug}`;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.authorComment || blocksToText(post.firstContent).slice(0, 300),
          path,
          imageUrl: typeof post.image?.src === "string" ? post.image.src : undefined,
          publishedAt: isoDate(post.publishedDate),
          authors: post.author?.name ? [post.author.name] : undefined,
          section: categoryLabel(category),
          tags: post.tags,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Blog", path: "/blog" },
          { name: categoryLabel(category), path: `/blog/${category}` },
          { name: post.title, path },
        ])}
      />

      <PostLayout loading={false} post={post} lastPosts={lastPosts?.posts} />
    </>
  );
}

export async function postOgImage(category: string, slug: string) {
  const post = await fetchPost(category, slug);

  if (!post) {
    return ogImageResponse({ eyebrow: "Blog Daddus", title: "Post não encontrado" });
  }

  return ogImageResponse({
    eyebrow: `Blog · ${categoryLabel(category)}`,
    title: post.title,
    footer: post.author?.name,
  });
}
