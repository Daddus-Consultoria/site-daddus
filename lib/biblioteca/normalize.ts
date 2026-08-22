import { createHash } from "node:crypto";

import type { OaiRecord } from "./oai";
import type {
  LibraryAccess,
  LibraryDocumentType,
  LibraryLanguage,
} from "./types";

/**
 * Normalizacao: cada repositorio preenche Dublin Core do seu jeito, e a
 * Biblioteca precisa de um registro previsivel. Tudo o que e decisao de
 * interpretacao mora aqui, para que adicionar uma fonte nova seja mexer em um
 * arquivo so.
 */

export interface NormalizedDocument {
  title: string;
  subtitle: string | null;
  authors: string[];
  institution: string | null;
  publisher: string | null;
  year: number | null;
  documentType: LibraryDocumentType;
  abstract: string | null;
  keywords: string[];
  language: LibraryLanguage;
  sourceUrl: string;
  doi: string | null;
  identifier: string;
  license: string | null;
  openAccess: boolean;
  access: LibraryAccess;
  country: string | null;
  state: string | null;
  municipality: string | null;
  coverage: string | null;
  dedupeKey: string;
  slug: string;
}

/**
 * Vocabulario de tipo dos repositorios (DSpace/DRIVER/COAR) para a lista fixa
 * da Biblioteca. O que nao estiver aqui cai em "outro" — melhor um documento
 * sem tipo do que um documento com o tipo errado.
 */
const TYPE_MAP: Record<string, LibraryDocumentType> = {
  book: "livro",
  livro: "livro",
  "book part": "livro",
  "book chapter": "livro",
  "parte de livro": "livro",
  ebook: "e-book",
  "e-book": "e-book",
  thesis: "tese",
  "doctoral thesis": "tese",
  tese: "tese",
  "master thesis": "dissertacao",
  "masters thesis": "dissertacao",
  dissertacao: "dissertacao",
  "dissertação": "dissertacao",
  article: "artigo",
  "journal article": "artigo",
  artigo: "artigo",
  "conference paper": "artigo",
  preprint: "artigo",
  report: "relatorio",
  relatorio: "relatorio",
  "relatório": "relatorio",
  "technical report": "relatorio",
  "technical note": "nota-tecnica",
  "nota tecnica": "nota-tecnica",
  "nota técnica": "nota-tecnica",
  "working paper": "estudo",
  "texto para discussao": "estudo",
  "texto para discussão": "estudo",
  study: "estudo",
  estudo: "estudo",
  guide: "guia",
  guia: "guia",
  manual: "manual",
  "other monograph": "monografia",
  monografia: "monografia",
  "learning object": "manual",
  dataset: "dados",
  "conjunto de dados": "dados",
  software: "dados",
  "institutional document": "documento-institucional",
  "documento institucional": "documento-institucional",
};

const LANGUAGE_MAP: Record<string, LibraryLanguage> = {
  por: "pt",
  pt: "pt",
  pt_br: "pt",
  "pt-br": "pt",
  portugues: "pt",
  eng: "en",
  en: "en",
  en_us: "en",
  spa: "es",
  es: "es",
  esp: "es",
};

const UFS = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

/** Marcas de historico do DSpace que aparecem como descricao e nao sao resumo. */
const PROVENANCE_MARKERS = [
  "submitted by",
  "made available in dspace",
  "approved for entry",
  "bitstream",
];

export const deaccent = (value: string): string =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const slugify = (value: string, maxLength = 80): string =>
  deaccent(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");

const first = (values: string[] | undefined): string | null =>
  values?.[0]?.trim() || null;

const uniqueBy = (values: string[]): string[] => {
  const seen = new Map<string, string>();

  values
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((value) => {
      const key = deaccent(value).toLowerCase();

      if (!seen.has(key)) seen.set(key, value);
    });

  return Array.from(seen.values());
};

/**
 * Titulo e subtitulo chegam num campo so, separados por dois-pontos — e a
 * convencao catalografica. Separar deixa o card legivel e a busca mais precisa.
 */
const splitTitle = (raw: string): { title: string; subtitle: string | null } => {
  const match = raw.match(/^(.{8,}?)\s*:\s+(.+)$/s);

  if (!match) return { title: raw, subtitle: null };

  return { title: match[1].trim(), subtitle: match[2].trim() };
};

/**
 * Um registro traz a data de publicacao e as datas de submissao no repositorio.
 * A de publicacao raramente vem como timestamp completo, entao ela e preferida;
 * so quando nao ha outra e que o timestamp vira o ano.
 */
const pickYear = (dates: string[]): number | null => {
  const years = (candidates: string[]) =>
    candidates
      .map((value) => Number(value.match(/\b(1[5-9]\d{2}|20\d{2})\b/)?.[1]))
      .filter((year) => Number.isFinite(year) && year >= 1500 && year <= new Date().getFullYear() + 1);

  const editorial = years(dates.filter((value) => !/T\d{2}:\d{2}/.test(value)));

  if (editorial.length) return Math.min(...editorial);

  const submission = years(dates);

  return submission.length ? Math.min(...submission) : null;
};

const pickAbstract = (descriptions: string[]): string | null => {
  const candidates = descriptions
    .map((value) => value.trim())
    .filter((value) => value.length > 60)
    .filter((value) => {
      const lower = deaccent(value).toLowerCase();

      return !PROVENANCE_MARKERS.some((marker) => lower.includes(marker));
    });

  if (!candidates.length) return null;

  // O resumo e a descricao mais longa: as demais costumam ser nota de rodape,
  // paginacao ou creditos.
  return candidates.sort((a, b) => b.length - a.length)[0];
};

const pickDoi = (identifiers: string[]): string | null => {
  for (const value of identifiers) {
    const match = value.match(/\b(10\.\d{4,9}\/[^\s"<>]+)/);

    if (match) return match[1].replace(/[.,;]$/, "");
  }

  return null;
};

const pickSourceUrl = (identifiers: string[], fallback: string): string => {
  const urls = identifiers.filter((value) => /^https?:\/\//i.test(value));

  return (
    urls.find((value) => /\/handle\/|\/item\/|doi\.org/i.test(value)) ??
    urls[0] ??
    fallback
  );
};

const pickAccess = (
  rights: string[]
): { access: LibraryAccess; openAccess: boolean; license: string | null } => {
  const normalized = rights.map((value) => deaccent(value).toLowerCase());
  const has = (term: string) => normalized.some((value) => value.includes(term));

  const license =
    rights.find((value) => /licen|creative commons|cc[- ]by|permitida a reprod/i.test(deaccent(value))) ??
    null;

  if (has("acesso aberto") || has("open access") || has("openaccess")) {
    return { access: "acesso-aberto", openAccess: true, license };
  }

  if (has("acesso restrito") || has("restricted")) {
    return { access: "acesso-restrito", openAccess: false, license };
  }

  if (has("embargo")) {
    return { access: "acesso-restrito", openAccess: false, license };
  }

  return { access: "nao-informado", openAccess: false, license };
};

const pickCoverage = (coverages: string[]) => {
  const country =
    coverages.find((value) => /^(brasil|brazil)$/i.test(deaccent(value).trim())) ?? null;
  const state =
    coverages.find((value) =>
      UFS.some((uf) => deaccent(uf).toLowerCase() === deaccent(value).trim().toLowerCase())
    ) ?? null;

  return {
    country: country ? "Brasil" : null,
    state,
    // Municipio exigiria bater com a lista do IBGE; sem isso, um "Sao Paulo"
    // solto viraria municipio ou estado ao acaso. Fica para a Fase 2.
    municipality: null as string | null,
    coverage: coverages.length ? coverages.join("; ") : null,
  };
};

/**
 * Chave de consolidacao, em ordem de confianca: DOI, depois a URL do
 * repositorio, e so entao titulo+autor+ano. E o que permite o mesmo estudo
 * chegar por BDTD, OASISBR e repositorio da universidade e virar um registro
 * so, com as tres origens registradas.
 */
const buildDedupeKey = (
  doi: string | null,
  sourceUrl: string,
  title: string,
  year: number | null,
  authors: string[]
): string => {
  if (doi) return `doi:${doi.toLowerCase()}`;

  const handle = sourceUrl.match(/\/handle\/([\w./-]+)/i)?.[1];

  if (handle) return `handle:${handle.toLowerCase()}`;

  return `obra:${slugify(title, 120)}|${year ?? "s-d"}|${slugify(authors[0] ?? "", 40)}`;
};

export const normalizeOaiRecord = (
  record: OaiRecord,
  source: { slug: string; institution: string | null; siteUrl: string | null }
): NormalizedDocument | null => {
  const fields = record.fields;
  const rawTitle = first(fields.title);

  // Sem titulo nao ha o que exibir nem como deduplicar.
  if (!rawTitle) return null;

  const { title, subtitle } = splitTitle(rawTitle);
  const authors = uniqueBy(fields.creator ?? []);
  const identifiers = fields.identifier ?? [];
  const doi = pickDoi(identifiers);
  const sourceUrl = pickSourceUrl(identifiers, source.siteUrl ?? "");
  const year = pickYear(fields.date ?? []);
  const { access, openAccess, license } = pickAccess(fields.rights ?? []);
  const { country, state, municipality, coverage } = pickCoverage(fields.coverage ?? []);

  const rawType = deaccent(first(fields.type) ?? "").toLowerCase();
  const rawLanguage = deaccent(first(fields.language) ?? "").toLowerCase();

  const dedupeKey = buildDedupeKey(doi, sourceUrl, title, year, authors);

  return {
    title,
    subtitle,
    authors,
    institution: first(fields.publisher) ?? source.institution,
    publisher: first(fields.publisher),
    year,
    documentType: TYPE_MAP[rawType] ?? "outro",
    abstract: pickAbstract(fields.description ?? []),
    keywords: uniqueBy(fields.subject ?? []).slice(0, 40),
    language: LANGUAGE_MAP[rawLanguage] ?? (rawLanguage ? "outro" : "pt"),
    sourceUrl,
    doi,
    identifier: record.identifier,
    license,
    openAccess,
    access,
    country,
    state,
    municipality,
    coverage,
    dedupeKey,
    // O sufixo vem da chave de consolidacao: dois documentos de mesmo titulo
    // (versao preliminar e final, por exemplo) precisam de URLs distintas.
    slug: `${slugify(title, 80)}-${createHash("sha1").update(dedupeKey).digest("hex").slice(0, 6)}`,
  };
};
