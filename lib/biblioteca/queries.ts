import { query } from "@/lib/db/pool";
import {
  accessLabels,
  documentTypeLabels,
  languageLabels,
  MAX_PAGE_SIZE,
} from "./constants";
import type {
  LibraryDocument,
  LibraryFacet,
  LibraryFacets,
  LibraryFilters,
  LibraryQuery,
  LibrarySearchResult,
  LibrarySource,
  LibraryTopic,
} from "./types";

/**
 * Consultas da Biblioteca. Todo filtro entra por parametro ligado ($1, $2...):
 * nada de interpolar texto de busca em SQL.
 */

interface DocumentRow {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  institution: string | null;
  publisher: string | null;
  year: number | null;
  document_type: string;
  abstract: string | null;
  keywords: string[];
  language: string;
  source_slug: string;
  source_name: string;
  source_institution: string | null;
  source_site_url: string | null;
  source_url: string;
  doi: string | null;
  identifier: string | null;
  license: string | null;
  open_access: boolean;
  access_type: string;
  country: string | null;
  state: string | null;
  municipality: string | null;
  coverage: string | null;
  curated: boolean;
  curator_note: string | null;
  curator_reason: string | null;
  updated_at: string | null;
  topics: LibraryTopic[] | null;
  other_sources: LibrarySource[] | null;
}

const mapDocument = (row: DocumentRow): LibraryDocument => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  subtitle: row.subtitle,
  authors: row.authors ?? [],
  institution: row.institution,
  publisher: row.publisher,
  year: row.year,
  documentType: row.document_type as LibraryDocument["documentType"],
  abstract: row.abstract,
  keywords: row.keywords ?? [],
  topics: row.topics ?? [],
  language: row.language as LibraryDocument["language"],
  source: {
    slug: row.source_slug,
    name: row.source_name,
    institution: row.source_institution,
    siteUrl: row.source_site_url,
  },
  sourceUrl: row.source_url,
  doi: row.doi,
  identifier: row.identifier,
  license: row.license,
  openAccess: row.open_access,
  access: row.access_type as LibraryDocument["access"],
  country: row.country,
  state: row.state,
  municipality: row.municipality,
  coverage: row.coverage,
  curated: row.curated,
  curatorNote: row.curator_note,
  curatorReason: row.curator_reason,
  updatedAt: row.updated_at,
  otherSources: row.other_sources ?? [],
});

/** Colunas + relacoes que a UI precisa, em uma consulta so. */
const DOCUMENT_SELECT = `
  d.id, d.slug, d.title, d.subtitle, d.authors, d.institution, d.publisher,
  d.year, d.document_type, d.abstract, d.keywords, d.language, d.source_url,
  d.doi, d.identifier, d.license, d.open_access, d.access_type, d.country,
  d.state, d.municipality, d.coverage, d.curated, d.curator_note,
  d.curator_reason, d.updated_at,
  s.slug AS source_slug, s.name AS source_name,
  s.institution AS source_institution, s.site_url AS source_site_url,
  COALESCE((
    SELECT json_agg(json_build_object('slug', t.slug, 'name', t.name, 'systemSlug', t.system_slug)
             ORDER BY t.position)
      FROM library_document_topics dt
      JOIN library_topics t ON t.id = dt.topic_id AND t.active
     WHERE dt.document_id = d.id
  ), '[]'::json) AS topics,
  COALESCE((
    SELECT json_agg(DISTINCT jsonb_build_object('slug', os.slug, 'name', os.name,
                                                'institution', os.institution, 'siteUrl', os.site_url))
      FROM library_document_origins o
      JOIN library_sources os ON os.id = o.source_id
     WHERE o.document_id = d.id AND os.id <> d.source_id
  ), '[]'::json) AS other_sources
`;

interface WhereClause {
  sql: string;
  params: unknown[];
  /** Indice do parametro que carrega a tsquery, quando ha busca textual. */
  searchParam: number | null;
}

const buildWhere = (filters: LibraryFilters, approximate = false): WhereClause => {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let searchParam: number | null = null;

  const push = (value: unknown): string => {
    params.push(value);

    return `$${params.length}`;
  };

  const search = filters.search?.trim();

  if (search) {
    const placeholder = push(search);
    searchParam = params.length;

    conditions.push(
      approximate
        ? // Aproximacao por similaridade: o usuario errou a grafia ou usou uma
          // variacao que o dicionario nao reduz ao mesmo radical.
          `(d.title % ${placeholder} OR unaccent(lower(d.title)) LIKE '%' || unaccent(lower(${placeholder})) || '%')`
        : `d.search_vector @@ websearch_to_tsquery('portuguese_unaccent', ${placeholder})`
    );
  }

  if (filters.types?.length) conditions.push(`d.document_type = ANY(${push(filters.types)})`);
  if (filters.languages?.length) conditions.push(`d.language = ANY(${push(filters.languages)})`);
  if (filters.access?.length) conditions.push(`d.access_type = ANY(${push(filters.access)})`);
  if (filters.yearFrom) conditions.push(`d.year >= ${push(filters.yearFrom)}`);
  if (filters.yearTo) conditions.push(`d.year <= ${push(filters.yearTo)}`);
  if (filters.curatedOnly) conditions.push(`d.curated`);
  if (filters.country) conditions.push(`d.country = ${push(filters.country)}`);

  if (filters.sources?.length) {
    // Uma fonte casa tanto como origem canonica quanto como origem secundaria:
    // filtrar por "Ipea" deve trazer o documento que chegou por outra fonte mas
    // tambem existe no Ipea.
    conditions.push(`EXISTS (
      SELECT 1 FROM library_document_origins o
        JOIN library_sources os ON os.id = o.source_id
       WHERE o.document_id = d.id AND os.slug = ANY(${push(filters.sources)})
    )`);
  }

  if (filters.topics?.length) {
    // Varios temas somam resultados (OU), como em qualquer catalogo: exigir
    // todos ao mesmo tempo esvaziaria a lista.
    conditions.push(`EXISTS (
      SELECT 1 FROM library_document_topics dt
        JOIN library_topics t ON t.id = dt.topic_id
       WHERE dt.document_id = d.id AND t.slug = ANY(${push(filters.topics)})
    )`);
  }

  if (filters.keywords?.length) {
    conditions.push(`EXISTS (
      SELECT 1 FROM unnest(d.keywords) AS k
       WHERE unaccent(lower(k)) = ANY(SELECT unaccent(lower(x)) FROM unnest(${push(filters.keywords)}::text[]) AS x)
    )`);
  }

  return {
    sql: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
    searchParam,
  };
};

const buildOrderBy = (order: LibraryQuery["order"], searchParam: number | null): string => {
  switch (order) {
    case "recentes":
      return "ORDER BY d.year DESC NULLS LAST, d.id DESC";
    case "antigos":
      return "ORDER BY d.year ASC NULLS LAST, d.id ASC";
    case "titulo":
      return "ORDER BY unaccent(lower(d.title)) ASC";
    case "autor":
      return "ORDER BY unaccent(lower(COALESCE(d.authors[1], 'zzz'))) ASC, d.year DESC NULLS LAST";
    default:
      // Sem termo de busca nao ha relevancia textual: o criterio vira a
      // curadoria e depois a data, que e o recorte mais util de um acervo.
      return searchParam
        ? `ORDER BY ts_rank_cd(d.search_vector, websearch_to_tsquery('portuguese_unaccent', $${searchParam})) DESC,
                   d.curated DESC, d.year DESC NULLS LAST, d.id DESC`
        : "ORDER BY d.curated DESC, d.year DESC NULLS LAST, d.id DESC";
  }
};

/**
 * A contagem viaja como texto porque bigint em JSON perde precisao no driver;
 * a ordenacao, por isso, tem de ser feita no SQL sobre count(*), nunca sobre a
 * coluna ja convertida — em texto "8" vem depois de "65".
 */
const toFacet = (
  rows: { value: string; count: string }[],
  labelOf: (value: string) => string
): LibraryFacet[] =>
  rows
    .filter((row) => row.value !== null)
    .map((row) => ({
      value: row.value,
      label: labelOf(row.value),
      count: Number(row.count),
    }));

/**
 * Facetas: quantos documentos cada opcao traria dentro do recorte atual. E o
 * que garante a regra do acervo — nenhum filtro oferece caminho sem resultado.
 */
const fetchFacets = async (where: WhereClause): Promise<LibraryFacets> => {
  const base = `FROM library_documents d ${where.sql}`;

  const [types, topics, sources, languages, access, years] = await Promise.all([
    query<{ value: string; count: string }>(
      `SELECT d.document_type AS value, count(*)::text ${base} GROUP BY 1 ORDER BY count(*) DESC`,
      where.params
    ),
    query<{ value: string; label: string; count: string }>(
      `SELECT t.slug AS value, t.name AS label, count(*)::text
         FROM library_documents d
         JOIN library_document_topics dt ON dt.document_id = d.id
         JOIN library_topics t ON t.id = dt.topic_id AND t.active
         ${where.sql ? where.sql.replace(/^WHERE/, "WHERE") : ""}
        GROUP BY 1, 2 ORDER BY count(*) DESC`,
      where.params
    ),
    query<{ value: string; label: string; count: string }>(
      `SELECT s.slug AS value, s.name AS label, count(*)::text
         FROM library_documents d
         JOIN library_sources s ON s.id = d.source_id
         ${where.sql}
        GROUP BY 1, 2 ORDER BY count(*) DESC`,
      where.params
    ),
    query<{ value: string; count: string }>(
      `SELECT d.language AS value, count(*)::text ${base} GROUP BY 1 ORDER BY count(*) DESC`,
      where.params
    ),
    query<{ value: string; count: string }>(
      `SELECT d.access_type AS value, count(*)::text ${base} GROUP BY 1 ORDER BY count(*) DESC`,
      where.params
    ),
    query<{ value: string; count: string }>(
      `SELECT d.year::text AS value, count(*)::text
         FROM library_documents d
         ${where.sql ? `${where.sql} AND d.year IS NOT NULL` : "WHERE d.year IS NOT NULL"}
        GROUP BY 1 ORDER BY 1 DESC`,
      where.params
    ),
  ]);

  return {
    types: toFacet(types, (value) => documentTypeLabels[value as keyof typeof documentTypeLabels] ?? value),
    topics: topics.map((row) => ({ value: row.value, label: row.label, count: Number(row.count) })),
    sources: sources.map((row) => ({ value: row.value, label: row.label, count: Number(row.count) })),
    languages: toFacet(languages, (value) => languageLabels[value as keyof typeof languageLabels] ?? value),
    access: toFacet(access, (value) => accessLabels[value as keyof typeof accessLabels] ?? value),
    years: toFacet(years, (value) => value),
  };
};

export const searchLibrary = async (
  libraryQuery: LibraryQuery
): Promise<LibrarySearchResult> => {
  const { page, limit, order, ...filters } = libraryQuery;
  const pageSize = Math.min(Math.max(limit, 1), MAX_PAGE_SIZE);
  const offset = (Math.max(page, 1) - 1) * pageSize;

  const runSearch = async (approximate: boolean) => {
    const where = buildWhere(filters, approximate);
    const params = [...where.params, pageSize, offset];

    const [rows, countRows] = await Promise.all([
      query<DocumentRow>(
        `SELECT ${DOCUMENT_SELECT}
           FROM library_documents d
           JOIN library_sources s ON s.id = d.source_id
           ${where.sql}
           ${buildOrderBy(order, approximate ? null : where.searchParam)}
          LIMIT $${where.params.length + 1} OFFSET $${where.params.length + 2}`,
        params
      ),
      query<{ total: string }>(
        `SELECT count(*)::text AS total FROM library_documents d ${where.sql}`,
        where.params
      ),
    ]);

    return { rows, total: Number(countRows[0]?.total ?? 0), where };
  };

  let result = await runSearch(false);
  let approximate = false;

  // Busca exata vazia com termo digitado: tenta a aproximacao antes de dizer
  // "nenhum resultado". Um erro de digitacao nao deveria zerar o acervo.
  if (!result.total && filters.search?.trim()) {
    const fallback = await runSearch(true);

    if (fallback.total) {
      result = fallback;
      approximate = true;
    }
  }

  return {
    items: result.rows.map(mapDocument),
    totalItems: result.total,
    facets: await fetchFacets(result.where),
    approximate,
  };
};

export const getDocumentBySlug = async (slug: string): Promise<LibraryDocument | null> => {
  const rows = await query<DocumentRow>(
    `SELECT ${DOCUMENT_SELECT}
       FROM library_documents d
       JOIN library_sources s ON s.id = d.source_id
      WHERE d.slug = $1`,
    [slug]
  );

  return rows.length ? mapDocument(rows[0]) : null;
};

/**
 * Conteudos relacionados por tema, palavra-chave e autor — nesta ordem de peso.
 * Ate a busca semantica da Fase 2, e a aproximacao possivel com os metadados
 * que temos.
 */
export const getRelatedDocuments = async (
  document: LibraryDocument,
  limit = 6
): Promise<LibraryDocument[]> => {
  const rows = await query<DocumentRow>(
    `SELECT ${DOCUMENT_SELECT},
            (
              3 * (SELECT count(*) FROM library_document_topics dt
                     JOIN library_topics t ON t.id = dt.topic_id
                    WHERE dt.document_id = d.id AND t.slug = ANY($2))
              + 2 * (SELECT count(*) FROM unnest(d.keywords) k
                      WHERE unaccent(lower(k)) = ANY(SELECT unaccent(lower(x)) FROM unnest($3::text[]) x))
              + (SELECT count(*) FROM unnest(d.authors) a
                  WHERE a = ANY($4))
            ) AS score
       FROM library_documents d
       JOIN library_sources s ON s.id = d.source_id
      WHERE d.id <> $1
      ORDER BY score DESC, d.year DESC NULLS LAST
      LIMIT $5`,
    [
      document.id,
      document.topics.map((topic) => topic.slug),
      document.keywords,
      document.authors,
      limit,
    ]
  );

  return rows.map(mapDocument);
};

export const getLibraryTopics = async (): Promise<LibraryTopic[]> => {
  const rows = await query<{ slug: string; name: string; system_slug: string | null }>(
    "SELECT slug, name, system_slug FROM library_topics WHERE active ORDER BY position"
  );

  return rows.map((row) => ({ slug: row.slug, name: row.name, systemSlug: row.system_slug }));
};

export const getLibrarySources = async (): Promise<LibrarySource[]> => {
  const rows = await query<{
    slug: string;
    name: string;
    institution: string | null;
    site_url: string | null;
  }>("SELECT slug, name, institution, site_url FROM library_sources WHERE active ORDER BY name");

  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    institution: row.institution,
    siteUrl: row.site_url,
  }));
};

export const getLibraryStats = async (): Promise<{
  documents: number;
  sources: number;
  curated: number;
}> => {
  const rows = await query<{ documents: string; sources: string; curated: string }>(
    `SELECT (SELECT count(*) FROM library_documents)::text AS documents,
            (SELECT count(*) FROM library_sources WHERE active)::text AS sources,
            (SELECT count(*) FROM library_documents WHERE curated)::text AS curated`
  );

  return {
    documents: Number(rows[0]?.documents ?? 0),
    sources: Number(rows[0]?.sources ?? 0),
    curated: Number(rows[0]?.curated ?? 0),
  };
};
