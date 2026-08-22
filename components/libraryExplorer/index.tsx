"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";

import { CircularProgressIndicator } from "@/components/circularProgressIndicator";
import { ContentNotFoundWarning } from "@/components/contentNotFoundWarning";
import { LibraryUseCases } from "@/lib/useCases/libraryUseCases";
import { QueryKeys } from "@/lib/constants/queryKeys";
import { TimeConstants } from "@/lib/constants/constants";
import {
  DEFAULT_ORDER,
  LIBRARY_QUERY_PARAMS,
  accessLabels,
  documentTypeLabels,
  languageLabels,
  orderLabels,
  orderOptions,
} from "@/lib/biblioteca/constants";
import {
  buildLibrarySearchParams,
  countActiveFilters,
  parseLibraryQuery,
} from "@/lib/biblioteca/searchParams";
import type { LibraryFacets, LibraryOrder, LibraryQuery } from "@/lib/biblioteca/types";

import { DocumentCard } from "./documentCard";
import { FiltersPanel } from "./filtersPanel";

/**
 * Biblioteca Daddus: busca sobre metadados de fontes externas, com filtros
 * combinaveis. Ver docs/BIBLIOTECA.md e docs/DIRETRIZES-UX.md, secoes 7 e 12.
 *
 * Como no acervo de publicacoes, o estado vive na URL — o usuario pode voltar,
 * recarregar e compartilhar um recorte. Por isso a pagina que usa este
 * componente precisa envolve-lo em <Suspense>: ele le useSearchParams.
 */

const SEARCH_DEBOUNCE_MS = 400;

/** Grupos de filtro por chave da consulta, para o toggle ser um caminho so. */
const GROUP_PARAM: Record<string, string> = {
  types: LIBRARY_QUERY_PARAMS.type,
  topics: LIBRARY_QUERY_PARAMS.topic,
  sources: LIBRARY_QUERY_PARAMS.source,
  languages: LIBRARY_QUERY_PARAMS.language,
  access: LIBRARY_QUERY_PARAMS.access,
  keywords: LIBRARY_QUERY_PARAMS.keyword,
};

const EMPTY_FACETS: LibraryFacets = {
  types: [],
  topics: [],
  sources: [],
  languages: [],
  access: [],
  years: [],
};

interface LibraryExplorerProps {
  /**
   * Recorte fixo da pagina (ex.: /biblioteca/teses fixa o tipo). Nao aparece
   * como filtro removivel, porque removê-lo mudaria o sentido da pagina.
   */
  fixedFilters?: Partial<LibraryQuery>;
  /** Grupos que a pagina ja fixa e que, por isso, saem do painel. */
  hiddenGroups?: string[];
}

const LibraryExplorer: React.FC<LibraryExplorerProps> = ({
  fixedFilters,
  hiddenGroups = [],
}) => {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams?.toString() ?? ""),
    [searchParams]
  );
  const libraryUseCases = useMemo(() => new LibraryUseCases(), []);

  const query = useMemo(
    () => parseLibraryQuery(params, fixedFilters),
    [params, fixedFilters]
  );

  const [searchDraft, setSearchDraft] = useState(query.search ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const updateParams = useCallback(
    (changes: Record<string, string | string[] | null>) => {
      const next = new URLSearchParams(params.toString());

      Object.entries(changes).forEach(([key, value]) => {
        next.delete(key);

        if (Array.isArray(value)) {
          value.forEach((item) => next.append(key, item));
        } else if (value) {
          next.set(key, value);
        }
      });

      // Qualquer mudanca de recorte volta para a primeira pagina: manter a
      // pagina 7 de um recorte que agora tem duas mostraria vazio.
      if (!(LIBRARY_QUERY_PARAMS.page in changes)) {
        next.delete(LIBRARY_QUERY_PARAMS.page);
      }

      const queryString = next.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [params, pathname, router]
  );

  useEffect(() => {
    setSearchDraft(query.search ?? "");
  }, [query.search]);

  // O campo responde ao teclado na hora e so vira consulta depois de uma pausa,
  // para nao disparar uma requisicao por tecla digitada.
  useEffect(() => {
    if (searchDraft === (query.search ?? "")) return;

    const timeout = setTimeout(
      () => updateParams({ [LIBRARY_QUERY_PARAMS.search]: searchDraft || null }),
      SEARCH_DEBOUNCE_MS
    );

    return () => clearTimeout(timeout);
  }, [searchDraft, query.search, updateParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [QueryKeys.librarySearch, query],
    staleTime: TimeConstants.TEN_MINUTES,
    placeholderData: keepPreviousData,
    queryFn: async () => await libraryUseCases.searchLibrary(query),
  });

  const facets = data?.facets ?? EMPTY_FACETS;
  const totalItems = data?.totalItems ?? 0;
  const totalPages = Math.max(Math.ceil(totalItems / query.limit), 1);
  const activeFilters = countActiveFilters(query);

  const toggleValue = useCallback(
    (group: string, value: string) => {
      const key = GROUP_PARAM[group];
      const current = (query[group as keyof LibraryQuery] as string[] | undefined) ?? [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      updateParams({ [key]: next });
    },
    [query, updateParams]
  );

  const clearFilters = useCallback(() => {
    updateParams(
      Object.values(GROUP_PARAM).reduce<Record<string, null>>(
        (accumulator, key) => ({ ...accumulator, [key]: null }),
        {
          [LIBRARY_QUERY_PARAMS.yearFrom]: null,
          [LIBRARY_QUERY_PARAMS.yearTo]: null,
          [LIBRARY_QUERY_PARAMS.curated]: null,
        }
      )
    );
  }, [updateParams]);

  /** Filtros aplicados, sempre visiveis e removiveis um a um. */
  const chips = useMemo(() => {
    const labelFor: Record<string, (value: string) => string> = {
      types: (value) => documentTypeLabels[value as keyof typeof documentTypeLabels] ?? value,
      languages: (value) => languageLabels[value as keyof typeof languageLabels] ?? value,
      access: (value) => accessLabels[value as keyof typeof accessLabels] ?? value,
      topics: (value) =>
        facets.topics.find((facet) => facet.value === value)?.label ?? value,
      sources: (value) =>
        facets.sources.find((facet) => facet.value === value)?.label ?? value,
      keywords: (value) => value,
    };
    const groupTitle: Record<string, string> = {
      types: "Tipo",
      topics: "Tema",
      sources: "Fonte",
      languages: "Idioma",
      access: "Acesso",
      keywords: "Palavra-chave",
    };

    const list = Object.keys(GROUP_PARAM)
      .filter((group) => !hiddenGroups.includes(group))
      .flatMap((group) =>
        ((query[group as keyof LibraryQuery] as string[] | undefined) ?? []).map((value) => ({
          key: `${group}-${value}`,
          label: `${groupTitle[group]}: ${labelFor[group](value)}`,
          onRemove: () => toggleValue(group, value),
        }))
      );

    if (query.yearFrom || query.yearTo) {
      list.push({
        key: "ano",
        label: `Ano: ${query.yearFrom ?? "…"}–${query.yearTo ?? "…"}`,
        onRemove: () =>
          updateParams({
            [LIBRARY_QUERY_PARAMS.yearFrom]: null,
            [LIBRARY_QUERY_PARAMS.yearTo]: null,
          }),
      });
    }

    if (query.curatedOnly) {
      list.push({
        key: "curadoria",
        label: "Curadoria: Seleção Daddus",
        onRemove: () => updateParams({ [LIBRARY_QUERY_PARAMS.curated]: null }),
      });
    }

    return list;
  }, [query, facets, hiddenGroups, toggleValue, updateParams]);

  const panel = (
    <FiltersPanel
      facets={facets}
      selected={{
        types: query.types ?? [],
        topics: query.topics ?? [],
        sources: query.sources ?? [],
        languages: query.languages ?? [],
        access: query.access ?? [],
      }}
      yearFrom={query.yearFrom}
      yearTo={query.yearTo}
      curatedOnly={Boolean(query.curatedOnly)}
      expandedGroups={expandedGroups}
      hiddenGroups={hiddenGroups}
      onToggle={toggleValue}
      onYearChange={(field, value) =>
        updateParams({
          [field === "yearFrom" ? LIBRARY_QUERY_PARAMS.yearFrom : LIBRARY_QUERY_PARAMS.yearTo]:
            value || null,
        })
      }
      onCuratedChange={(value) =>
        updateParams({ [LIBRARY_QUERY_PARAMS.curated]: value ? "daddus" : null })
      }
      onExpand={(group) => setExpandedGroups((groups) => [...groups, group])}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label htmlFor="busca-biblioteca" className="sr-only">
          Pesquisar na Biblioteca Daddus
        </label>
        <input
          id="busca-biblioteca"
          type="search"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder="Pesquise por tema, título, autor, instituição ou palavra-chave..."
          className="w-full rounded-md border border-border px-4 py-3.5 text-base text-secondary outline-none focus:border-primary"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-label" aria-live="polite">
          {isLoading
            ? "Consultando o acervo…"
            : `${totalItems.toLocaleString("pt-BR")} ${
                totalItems === 1 ? "documento encontrado" : "documentos encontrados"
              }`}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-secondary lg:hidden"
          >
            <SlidersHorizontal size={16} aria-hidden />
            Filtrar
            {activeFilters > 0 && (
              <span className="rounded-full bg-primary px-1.5 text-xs text-white">
                {activeFilters}
              </span>
            )}
          </button>

          <label className="flex items-center gap-2 text-sm text-label">
            Ordenar por
            <select
              value={query.order}
              onChange={(event) =>
                updateParams({
                  [LIBRARY_QUERY_PARAMS.order]:
                    (event.target.value as LibraryOrder) === DEFAULT_ORDER
                      ? null
                      : event.target.value,
                })
              }
              className="rounded-sm border border-border bg-white px-2 py-1.5 text-sm text-secondary"
            >
              {orderOptions.map((option) => (
                <option key={option} value={option}>
                  {orderLabels[option]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              className="inline-flex items-center gap-1.5 rounded-full bg-medium-gray px-3 py-1.5 text-xs text-secondary hover:bg-border"
            >
              {chip.label}
              <X size={12} aria-hidden />
              <span className="sr-only">Remover filtro</span>
            </button>
          ))}

          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold uppercase tracking-wide text-primary underline underline-offset-4"
          >
            Limpar filtros
          </button>
        </div>
      )}

      <div className="flex gap-10">
        <aside className="hidden w-64 shrink-0 lg:block">{panel}</aside>

        <div className="min-w-0 flex-1">
          {data?.approximate && (
            <p className="mb-4 rounded-md bg-medium-gray px-4 py-3 text-sm text-secondary">
              Nenhum resultado exato para <strong>{query.search}</strong>. Mostrando documentos
              com títulos parecidos.
            </p>
          )}

          {isLoading && (
            <div className="py-16">
              <CircularProgressIndicator />
            </div>
          )}

          {isError && !isLoading && (
            <p className="py-16 text-center text-sm text-label">
              Não foi possível consultar a Biblioteca agora. Tente novamente em instantes.
            </p>
          )}

          {!isLoading && !isError && !data?.items.length && (
            <ContentNotFoundWarning />
          )}

          {!isLoading && !isError && !!data?.items.length && (
            <>
              <div className="flex flex-col">
                {data.items.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  className="flex items-center justify-between gap-4 pt-8"
                  aria-label="Paginação dos resultados"
                >
                  <button
                    type="button"
                    disabled={query.page <= 1}
                    onClick={() =>
                      updateParams({ [LIBRARY_QUERY_PARAMS.page]: String(query.page - 1) })
                    }
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  <span className="text-sm text-label">
                    Página {query.page.toLocaleString("pt-BR")} de{" "}
                    {totalPages.toLocaleString("pt-BR")}
                  </span>

                  <button
                    type="button"
                    disabled={query.page >= totalPages}
                    onClick={() =>
                      updateParams({ [LIBRARY_QUERY_PARAMS.page]: String(query.page + 1) })
                    }
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* Celular: o mesmo painel em tela cheia, com contagem e limpeza a mao. */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-secondary">
              Filtrar {activeFilters > 0 && `(${activeFilters})`}
            </h2>
            <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Fechar filtros">
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-5">{panel}</div>

          <footer className="flex items-center gap-3 border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-secondary"
            >
              Limpar filtros
            </button>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white"
            >
              Ver {totalItems.toLocaleString("pt-BR")} resultados
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export { LibraryExplorer };
