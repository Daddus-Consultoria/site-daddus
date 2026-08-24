import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_TITLE, SITE_URL } from "./constants";

/**
 * Metadados de uma pagina.
 *
 * Reune num lugar so o que toda rota indexavel precisa declarar: titulo,
 * descricao, canonica, diretiva de indexacao e os campos de compartilhamento.
 * Espalhado por arquivo, isso vinha divergindo — algumas rotas sem descricao,
 * outras sem canonica, o titulo ora com a marca ora sem.
 *
 * A imagem de compartilhamento nao entra aqui de proposito: quem a fornece e o
 * arquivo `opengraph-image.tsx` do segmento, e declarar `openGraph.images`
 * neste objeto sobrescreveria essa geracao.
 */
interface PageMetadataInput {
  /** Sem o sufixo da marca: e acrescentado aqui, salvo com `fullTitle`. */
  title: string;
  description: string;
  /** Caminho canonico, iniciando por "/". */
  path: string;
  /** "article" para conteudo datado; "website" para tela de navegacao. */
  type?: "website" | "article";
  /** Titulo ja completo, quando a pagina precisa do proprio sufixo. */
  fullTitle?: boolean;
  /** `false` mantem a pagina fora do indice (sessao, painel, busca interna). */
  index?: boolean;
  publishedTime?: string;
  authors?: string[];
}

export const pageMetadata = ({
  title,
  description,
  path,
  type = "website",
  fullTitle = false,
  index = true,
  publishedTime,
  authors,
}: PageMetadataInput): Metadata => {
  const headline = fullTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    // Titulo sempre absoluto, e nao um texto que espera o template do layout
    // raiz. O template so vale enquanto nenhum layout do caminho tiver
    // declarado um titulo proprio: `/conteudos/publicacoes` declara o dele e,
    // a partir dali, `Estudos` chegava ao navegador sem a marca. Montar a
    // frase inteira aqui torna o resultado independente do aninhamento.
    title: { absolute: headline },
    description,
    alternates: { canonical: path },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type,
      locale: SITE_LOCALE,
      siteName: SITE_NAME,
      url: path,
      title: headline,
      description,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && authors?.length ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: headline,
      description,
    },
  };
};

/**
 * Metadados da home. Fica separado porque so aqui o titulo e a marca inteira,
 * sem sufixo, e porque e a unica pagina cuja canonica e a raiz do dominio.
 */
export const homeMetadata = (): Metadata => ({
  ...pageMetadata({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: "/",
    fullTitle: true,
  }),
  metadataBase: new URL(SITE_URL),
});

/**
 * Descricao para o resultado de busca: uma frase limpa, no tamanho que o
 * buscador exibe. Texto vazio cai no fallback em vez de gerar `description=""`,
 * que faz o buscador inventar o trecho a partir do corpo da pagina.
 */
export const metaDescription = (
  text: string | null | undefined,
  fallback: string,
  limit = 160
): string => {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();

  if (!clean) return fallback;
  if (clean.length <= limit) return clean;

  const cut = clean.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};

/** Data do Strapi ou do Postgres -> ISO, ou nada quando a data nao e valida. */
export const isoDate = (value: string | Date | null | undefined): string | undefined => {
  if (!value) return undefined;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};
