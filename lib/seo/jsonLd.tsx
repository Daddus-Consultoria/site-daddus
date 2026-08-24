import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "./constants";

/**
 * Dados estruturados.
 *
 * Servem para dizer ao buscador o que a pagina e — uma ficha de metadados, um
 * estudo, uma trilha de navegacao — em vez de deixar que ele deduza do HTML.
 * Na Biblioteca isso e o que separa "resultado de busca de terceiro" de
 * "registro citavel", que e o publico que a area quer alcancar.
 *
 * Regra: so descreve o que a pagina realmente mostra. Campo sem dado sai como
 * `undefined` e o JSON.stringify o remove — nunca preenchido por suposicao.
 */
export const JsonLd: React.FC<{ data: Record<string, unknown> }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

const ORGANIZATION_ID = `${SITE_URL}/#organizacao`;

/** A Daddus. Referenciada por id nos demais blocos, para nao se repetir. */
export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Daddus",
  alternateName: "Daddus Consultoria",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  logo: absoluteUrl("/images/logos/daddus.svg"),
  email: "suporte@daddusconsultoria.com",
  areaServed: { "@type": "Country", name: "Brasil" },
});

/**
 * O site e a busca interna. O `SearchAction` aponta para a Biblioteca porque e
 * a busca que cobre um acervo — o buscador pode oferece-la direto no resultado.
 */
export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#site`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "pt-BR",
  publisher: { "@id": ORGANIZATION_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/biblioteca?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Trilha de navegacao. Faz o resultado de busca exibir o caminho
 * (Biblioteca > Teses > documento) em vez da URL crua.
 */
export const breadcrumbJsonLd = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

interface ArticleInput {
  title: string;
  description?: string;
  path: string;
  imageUrl?: string;
  publishedAt?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

/**
 * Conteudo proprio da Daddus: estudo, guia, perfil municipal, post. O que a
 * Biblioteca publica nao entra aqui — la o registro e metadado de terceiro, e
 * usa `CreativeWork` apontando para a origem.
 */
export const articleJsonLd = ({
  title,
  description,
  path,
  imageUrl,
  publishedAt,
  authors,
  section,
  tags,
}: ArticleInput) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description: description || undefined,
  url: absoluteUrl(path),
  mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
  image: imageUrl || undefined,
  datePublished: publishedAt || undefined,
  author: authors?.length
    ? authors.map((name) => ({ "@type": "Person", name }))
    : { "@id": ORGANIZATION_ID },
  publisher: { "@id": ORGANIZATION_ID },
  articleSection: section || undefined,
  keywords: tags?.length ? tags.join(", ") : undefined,
  inLanguage: "pt-BR",
});

interface CollectionInput {
  name: string;
  description: string;
  path: string;
  /** Tamanho do recorte, quando conhecido. Sem chute. */
  itemCount?: number;
}

/** Recorte da Biblioteca ou listagem do acervo: uma colecao, nao um artigo. */
export const collectionPageJsonLd = ({
  name,
  description,
  path,
  itemCount,
}: CollectionInput) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url: absoluteUrl(path),
  isPartOf: { "@id": `${SITE_URL}/#site` },
  publisher: { "@id": ORGANIZATION_ID },
  inLanguage: "pt-BR",
  mainEntity:
    itemCount === undefined
      ? undefined
      : { "@type": "ItemList", numberOfItems: itemCount },
});
