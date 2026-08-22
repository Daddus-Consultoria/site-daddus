/**
 * Modelo da Biblioteca Daddus.
 *
 * A Biblioteca indexa metadados de documentos publicados por fontes externas
 * (Ipea, universidades, bases academicas) e leva o usuario ao documento na
 * origem. Ela nao guarda o arquivo — ver docs/BIBLIOTECA.md, secao "Direitos".
 */

export type LibraryDocumentType =
  | "livro"
  | "e-book"
  | "tese"
  | "dissertacao"
  | "artigo"
  | "relatorio"
  | "nota-tecnica"
  | "estudo"
  | "guia"
  | "manual"
  | "monografia"
  | "documento-institucional"
  | "dados"
  | "outro";

export type LibraryLanguage = "pt" | "en" | "es" | "outro";

export type LibraryAccess =
  | "acesso-aberto"
  | "leitura-gratuita"
  | "emprestimo-digital"
  | "acesso-restrito"
  | "nao-informado";

export type LibraryOrder =
  | "relevancia"
  | "recentes"
  | "antigos"
  | "titulo"
  | "autor";

export interface LibraryTopic {
  slug: string;
  name: string;
  /** Sistema do ecossistema sugerido para este tema, quando houver. */
  systemSlug: string | null;
}

export interface LibrarySource {
  slug: string;
  name: string;
  institution: string | null;
  siteUrl: string | null;
}

export interface LibraryDocument {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  institution: string | null;
  publisher: string | null;
  year: number | null;
  documentType: LibraryDocumentType;
  abstract: string | null;
  keywords: string[];
  topics: LibraryTopic[];
  language: LibraryLanguage;
  source: LibrarySource;
  sourceUrl: string;
  doi: string | null;
  identifier: string | null;
  license: string | null;
  openAccess: boolean;
  access: LibraryAccess;
  country: string | null;
  state: string | null;
  municipality: string | null;
  coverage: string | null;
  curated: boolean;
  curatorNote: string | null;
  curatorReason: string | null;
  updatedAt: string | null;
  /** Outras fontes onde o mesmo documento foi encontrado. */
  otherSources: LibrarySource[];
}

/**
 * Filtros combinaveis. Todos se aplicam ao mesmo tempo, e cada um so entra na
 * consulta quando o usuario escolheu algo — filtro vazio significa "tudo".
 */
export interface LibraryFilters {
  search?: string;
  types?: LibraryDocumentType[];
  topics?: string[];
  sources?: string[];
  languages?: LibraryLanguage[];
  access?: LibraryAccess[];
  keywords?: string[];
  yearFrom?: number;
  yearTo?: number;
  curatedOnly?: boolean;
  country?: string;
}

export interface LibraryQuery extends LibraryFilters {
  page: number;
  limit: number;
  order: LibraryOrder;
}

/** Contagem por opcao de filtro, para nao oferecer recorte sem resultado. */
export interface LibraryFacet {
  value: string;
  label: string;
  count: number;
}

export interface LibraryFacets {
  types: LibraryFacet[];
  topics: LibraryFacet[];
  sources: LibraryFacet[];
  languages: LibraryFacet[];
  access: LibraryFacet[];
  years: LibraryFacet[];
}

export interface LibrarySearchResult {
  items: LibraryDocument[];
  totalItems: number;
  facets: LibraryFacets;
  /**
   * Verdadeiro quando a busca exata nao achou nada e o resultado veio da
   * aproximacao por similaridade — a interface avisa o usuario.
   */
  approximate: boolean;
}
