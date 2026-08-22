import {
  DEFAULT_ORDER,
  DEFAULT_PAGE_SIZE,
  LIBRARY_QUERY_PARAMS,
  accessOptions,
  documentTypes,
  languages,
  orderOptions,
} from "./constants";
import type {
  LibraryAccess,
  LibraryDocumentType,
  LibraryLanguage,
  LibraryOrder,
  LibraryQuery,
} from "./types";

/**
 * Traducao entre a URL e a consulta da Biblioteca — usada pelo componente de
 * busca, pelo route handler e pelas paginas de recorte. Fica em um lugar so
 * para que o link que o usuario compartilha signifique sempre a mesma coisa.
 */

/** Multivalorado: ?tipo=tese&tipo=artigo, e tambem ?tipo=tese,artigo. */
const readList = (params: URLSearchParams, key: string): string[] => {
  const values = params
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set(values));
};

const keepKnown = <T extends string>(values: string[], allowed: readonly T[]): T[] =>
  values.filter((value): value is T => (allowed as readonly string[]).includes(value));

const readNumber = (params: URLSearchParams, key: string): number | undefined => {
  const value = Number(params.get(key));

  return Number.isFinite(value) && value > 0 ? value : undefined;
};

export const parseLibraryQuery = (
  params: URLSearchParams,
  overrides: Partial<LibraryQuery> = {}
): LibraryQuery => {
  const order = params.get(LIBRARY_QUERY_PARAMS.order) as LibraryOrder | null;
  const yearFrom = readNumber(params, LIBRARY_QUERY_PARAMS.yearFrom);
  const yearTo = readNumber(params, LIBRARY_QUERY_PARAMS.yearTo);

  return {
    search: params.get(LIBRARY_QUERY_PARAMS.search)?.trim() || undefined,
    types: keepKnown<LibraryDocumentType>(
      readList(params, LIBRARY_QUERY_PARAMS.type),
      documentTypes
    ),
    topics: readList(params, LIBRARY_QUERY_PARAMS.topic),
    sources: readList(params, LIBRARY_QUERY_PARAMS.source),
    languages: keepKnown<LibraryLanguage>(
      readList(params, LIBRARY_QUERY_PARAMS.language),
      languages
    ),
    access: keepKnown<LibraryAccess>(
      readList(params, LIBRARY_QUERY_PARAMS.access),
      accessOptions
    ),
    keywords: readList(params, LIBRARY_QUERY_PARAMS.keyword),
    // Intervalo invertido ("de 2020 ate 2010") devolveria lista vazia sem
    // explicacao; trocar as pontas e o que o usuario quis dizer.
    yearFrom: yearFrom && yearTo ? Math.min(yearFrom, yearTo) : yearFrom,
    yearTo: yearFrom && yearTo ? Math.max(yearFrom, yearTo) : yearTo,
    curatedOnly: params.get(LIBRARY_QUERY_PARAMS.curated) === "daddus",
    order: order && orderOptions.includes(order) ? order : DEFAULT_ORDER,
    page: readNumber(params, LIBRARY_QUERY_PARAMS.page) ?? 1,
    limit: DEFAULT_PAGE_SIZE,
    ...overrides,
  };
};

/** Quantos filtros estao ativos — o botao "Filtrar" do celular mostra isso. */
export const countActiveFilters = (query: LibraryQuery): number =>
  (query.types?.length ?? 0) +
  (query.topics?.length ?? 0) +
  (query.sources?.length ?? 0) +
  (query.languages?.length ?? 0) +
  (query.access?.length ?? 0) +
  (query.keywords?.length ?? 0) +
  (query.yearFrom || query.yearTo ? 1 : 0) +
  (query.curatedOnly ? 1 : 0);

export const buildLibrarySearchParams = (query: LibraryQuery): URLSearchParams => {
  const params = new URLSearchParams();
  const setList = (key: string, values?: string[]) =>
    values?.forEach((value) => params.append(key, value));

  if (query.search) params.set(LIBRARY_QUERY_PARAMS.search, query.search);
  setList(LIBRARY_QUERY_PARAMS.type, query.types);
  setList(LIBRARY_QUERY_PARAMS.topic, query.topics);
  setList(LIBRARY_QUERY_PARAMS.source, query.sources);
  setList(LIBRARY_QUERY_PARAMS.language, query.languages);
  setList(LIBRARY_QUERY_PARAMS.access, query.access);
  setList(LIBRARY_QUERY_PARAMS.keyword, query.keywords);
  if (query.yearFrom) params.set(LIBRARY_QUERY_PARAMS.yearFrom, String(query.yearFrom));
  if (query.yearTo) params.set(LIBRARY_QUERY_PARAMS.yearTo, String(query.yearTo));
  if (query.curatedOnly) params.set(LIBRARY_QUERY_PARAMS.curated, "daddus");
  if (query.order && query.order !== DEFAULT_ORDER) {
    params.set(LIBRARY_QUERY_PARAMS.order, query.order);
  }
  if (query.page > 1) params.set(LIBRARY_QUERY_PARAMS.page, String(query.page));

  return params;
};
