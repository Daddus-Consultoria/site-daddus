import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Publish } from "@/components/publish";
import {
  PublishCategories,
  publishCategoryLabels,
  transformCategory,
} from "@/lib/constants/constants";
import type { PublishModel } from "@/lib/interfaces/publish";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { isoDate, metaDescription, pageMetadata } from "@/lib/seo/metadata";
import { ogImageResponse } from "@/lib/seo/ogImage";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";

/**
 * Pagina de uma publicacao da Daddus — estudo, guia ou perfil municipal.
 *
 * As tres rotas eram client components: o slug saia do `usePathname` e a
 * publicacao chegava por fetch no navegador. O HTML servido ao buscador era o
 * indicador de carregamento, sem titulo, sem resumo e sem texto — justamente o
 * material que se quer encontravel. Aqui a busca acontece no servidor, entao a
 * pagina ja sai montada e com metadados proprios.
 *
 * As tres rotas continuam existindo separadas (a URL faz parte da arquitetura
 * de informacao do acervo); o que muda e que passam a compartilhar este modulo
 * em vez de repetir o mesmo componente tres vezes.
 */

/** Uma hora: o acervo muda no ritmo da publicacao no CMS, nao a cada acesso. */
export const PUBLISH_REVALIDATE = 3600;

/**
 * A cadeia de dados do repositorio expoe um metodo por tipo. O despacho fica
 * aqui para que as rotas nao precisem saber disso.
 *
 * Devolve `null` so quando o CMS respondeu que nao ha publicacao com aquele
 * slug. Uma falha de rede sobe como erro de proposito: transformada em `null`,
 * ela viraria um 404 — e um 404 diz ao buscador que a publicacao deixou de
 * existir, o que, com a pagina cacheada, sobreviveria a queda que o causou. Um
 * erro de servidor e lido como temporario e o robo volta depois.
 */
const fetchPublish = async (
  category: PublishCategories,
  slug: string
): Promise<PublishModel | null> => {
  const useCases = new PublishUseCases();

  switch (category) {
    case PublishCategories.STUDIES:
      return useCases.getStudyBySlug({ slug });
    case PublishCategories.GUIDES:
      return useCases.getGuideBySlug({ slug });
    case PublishCategories.MUNICIPAL_PROFILE:
      return useCases.getMunicipalProfileBySlug({ slug });
    default:
      return null;
  }
};

const publishPath = (category: PublishCategories, slug: string): string =>
  `/conteudos/publicacoes/${transformCategory[category]}/${slug}`;

export async function publishMetadata(
  category: PublishCategories,
  slug: string
): Promise<Metadata> {
  const publish = await fetchPublish(category, slug);
  const label = publishCategoryLabels[category];

  if (!publish) {
    return pageMetadata({
      title: `${label} não encontrado`,
      description: `A publicação buscada não está no acervo da Daddus.`,
      path: publishPath(category, slug),
      index: false,
    });
  }

  return pageMetadata({
    title: publish.title,
    description: metaDescription(
      publish.shortDescription || publish.longDescription,
      `${label} publicado pela Daddus.`
    ),
    path: publishPath(category, slug),
    type: "article",
    publishedTime: isoDate(publish.publishDate),
    authors: publish.authors.map((author) => author.name),
  });
}

/**
 * Monta a pagina. E funcao, e nao componente usado como `<PublishPage />`,
 * porque o corpo e assincrono: a rota a invoca direto e devolve o resultado.
 */
export async function renderPublishPage(category: PublishCategories, slug: string) {
  const publish = await fetchPublish(category, slug);

  if (!publish) notFound();

  const label = publishCategoryLabels[category];
  const path = publishPath(category, slug);

  return (
    <div>
      <JsonLd
        data={articleJsonLd({
          title: publish.title,
          description: publish.shortDescription,
          path,
          imageUrl: publish.imageUrl,
          publishedAt: isoDate(publish.publishDate),
          authors: publish.authors.map((author) => author.name),
          section: label,
          tags: publish.tags,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Publicações", path: "/conteudos/publicacoes" },
          {
            name: `${label}s`,
            path: `/conteudos/publicacoes/${transformCategory[category]}`,
          },
          { name: publish.title, path },
        ])}
      />

      <Publish publishData={publish} category={category} />
    </div>
  );
}

/** Cartao de compartilhamento com o titulo real da publicacao. */
export async function publishOgImage(category: PublishCategories, slug: string) {
  // O cartao e ilustracao: uma falha aqui nao pode derrubar o compartilhamento.
  const publish = await fetchPublish(category, slug).catch(() => null);
  const label = publishCategoryLabels[category];

  if (!publish) {
    return ogImageResponse({ eyebrow: "Daddus", title: `${label} não encontrado` });
  }

  const authors = publish.authors.map((author) => author.name).join("; ");

  return ogImageResponse({
    eyebrow: label,
    title: publish.title,
    footer: authors || publish.shortDescription,
  });
}
