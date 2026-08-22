"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  CardPublication,
  CircularProgressIndicator,
  ContentNotFoundWarning,
  InputGeneric,
  PaginationGeneric,
  SelectGeneric,
} from "@/components/index";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";
import { PublishIndexEntry } from "@/lib/interfaces/publish";
import { QueryKeys } from "@/lib/constants/queryKeys";
import {
  PublishCategories,
  TimeConstants,
  publishCategoryLabels,
  transformCategory,
} from "@/lib/constants/constants";
import { getPublishYear } from "@/lib/utils";

/**
 * Acervo de publicacoes: busca por texto e filtros por tipo, tema e ano sobre
 * o que existe no CMS. As opcoes de cada filtro saem do proprio acervo, entao
 * nenhum filtro oferece um recorte que nao tem resultado.
 *
 * O estado vive na URL: o usuario pode voltar, recarregar ou compartilhar um
 * recorte da biblioteca. Ver docs/DIRETRIZES-UX.md, secoes 7 e 12.
 */

const SEARCH_DEBOUNCE_MS = 400;

interface PublicationsLibraryProps {
  /** Fixa o tipo quando a pagina ja e de um tipo so (estudos, guias, perfis). */
  fixedCategory?: PublishCategories;
  itemsPerPage?: number;
}

const QUERY_PARAMS = {
  search: "q",
  category: "tipo",
  subCategory: "perfil",
  tag: "tema",
  year: "ano",
  page: "pagina",
};

const categoryFromLabel = (label: string): PublishCategories | undefined =>
  (Object.keys(publishCategoryLabels) as PublishCategories[]).find(
    (category) => publishCategoryLabels[category] === label
  );

const buildPath = (category: PublishCategories, slug: string) =>
  `/conteudos/publicacoes/${transformCategory[category]}/${slug}`;

const PublicationsLibrary: React.FC<PublicationsLibraryProps> = ({
  fixedCategory,
  itemsPerPage = 10,
}) => {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams?.toString() ?? ""),
    [searchParams]
  );
  const publishUseCases = useMemo(() => new PublishUseCases(), []);

  const searchParam = params.get(QUERY_PARAMS.search) ?? "";
  const categoryParam = fixedCategory
    ? fixedCategory
    : ((params.get(QUERY_PARAMS.category) as PublishCategories | null) ??
      undefined);
  const subCategoryParam = params.get(QUERY_PARAMS.subCategory) ?? "";
  const tagParam = params.get(QUERY_PARAMS.tag) ?? "";
  const yearParam = params.get(QUERY_PARAMS.year) ?? "";
  const currentPage = Number(params.get(QUERY_PARAMS.page)) || 1;

  // O campo de busca responde ao teclado na hora e so vira consulta depois de
  // uma pausa, para nao disparar uma requisicao por tecla digitada.
  const [searchDraft, setSearchDraft] = useState(searchParam);

  const updateParams = useCallback(
    (changes: Record<string, string>) => {
      const nextParams = new URLSearchParams(params.toString());

      Object.entries(changes).forEach(([key, value]) => {
        if (value) {
          nextParams.set(key, value);
        } else {
          nextParams.delete(key);
        }
      });

      // Qualquer mudanca de filtro recomeca da primeira pagina: manter a
      // pagina 7 de um recorte que agora tem duas paginas mostraria vazio.
      if (!(QUERY_PARAMS.page in changes)) {
        nextParams.delete(QUERY_PARAMS.page);
      }

      const query = nextParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, params, router]
  );

  useEffect(() => {
    setSearchDraft(searchParam);
  }, [searchParam]);

  useEffect(() => {
    if (searchDraft === searchParam) return;

    const timeout = setTimeout(
      () => updateParams({ [QUERY_PARAMS.search]: searchDraft }),
      SEARCH_DEBOUNCE_MS
    );

    return () => clearTimeout(timeout);
  }, [searchDraft, searchParam, updateParams]);

  const { data: index } = useQuery({
    queryKey: [QueryKeys.publishIndex, fixedCategory ?? "todos"],
    staleTime: TimeConstants.TEN_MINUTES,
    queryFn: async () =>
      await publishUseCases.getPublishIndex({ category: fixedCategory }),
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.publishLibrary,
      categoryParam ?? "todos",
      searchParam,
      subCategoryParam,
      tagParam,
      yearParam,
      currentPage,
    ],
    placeholderData: keepPreviousData,
    queryFn: async () =>
      await publishUseCases.searchPublish({
        page: currentPage,
        limit: itemsPerPage,
        search: searchParam || undefined,
        category: categoryParam,
        subCategory: subCategoryParam || undefined,
        tag: tagParam || undefined,
        year: yearParam ? Number(yearParam) : undefined,
      }),
  });

  const entries: PublishIndexEntry[] = useMemo(() => index ?? [], [index]);

  // As opcoes de tema e ano acompanham o tipo escolhido: filtrar por "Guia" e
  // continuar oferecendo um ano que so tem estudo levaria a lista vazia.
  const entriesInScope = useMemo(
    () =>
      categoryParam
        ? entries.filter((entry) => entry.category === categoryParam)
        : entries,
    [entries, categoryParam]
  );

  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(entries.map((entry) => entry.category)))
        .filter(Boolean)
        .map((category) => publishCategoryLabels[category])
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "pt-BR")),
    [entries]
  );

  const subCategoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          entriesInScope
            .map((entry) => entry.subCategory)
            .filter((value): value is string => Boolean(value))
        )
      ).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [entriesInScope]
  );

  const tagOptions = useMemo(
    () =>
      Array.from(
        new Set(entriesInScope.flatMap((entry) => entry.tags ?? []))
      )
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "pt-BR")),
    [entriesInScope]
  );

  const yearOptions = useMemo(
    () =>
      Array.from(
        new Set(
          entriesInScope
            .map((entry) => getPublishYear(entry.publishDate))
            .filter((year): year is number => Boolean(year))
        )
      )
        .sort((a, b) => b - a)
        .map(String),
    [entriesInScope]
  );

  const items = data?.items ?? [];
  const totalItems = data?.totalItems ?? 0;

  const hasActiveFilters = Boolean(
    searchParam ||
      (!fixedCategory && categoryParam) ||
      subCategoryParam ||
      tagParam ||
      yearParam
  );

  const clearFilters = () => {
    setSearchDraft("");
    router.replace(pathname, { scroll: false });
  };

  const resultLabel = isLoading
    ? "Carregando publicações…"
    : totalItems === 1
    ? "1 publicação encontrada"
    : `${totalItems} publicações encontradas`;

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:px-5">
        <div className="flex flex-1 flex-col gap-2 lg:min-w-[240px]">
          <label
            htmlFor="publicacoes-busca"
            className="text-[13px] font-medium text-black"
          >
            Buscar
          </label>
          <InputGeneric
            id="publicacoes-busca"
            type="white"
            placeholder="Título ou resumo"
            value={searchDraft}
            onValueChange={setSearchDraft}
            ariaLabel="Buscar publicações por título ou resumo"
          />
        </div>

        {!fixedCategory && categoryOptions.length > 1 && (
          <div className="flex flex-col gap-2 lg:w-[200px]">
            <label
              htmlFor="publicacoes-tipo"
              className="text-[13px] font-medium text-black"
            >
              Tipo
            </label>
            <SelectGeneric
              id="publicacoes-tipo"
              placeholder="Todos os tipos"
              clearLabel="Todos os tipos"
              items={categoryOptions}
              value={
                categoryParam ? publishCategoryLabels[categoryParam] : ""
              }
              onValueChange={(label) =>
                updateParams({
                  [QUERY_PARAMS.category]: label
                    ? categoryFromLabel(label) ?? ""
                    : "",
                  // Tema e perfil pertencem ao tipo anterior; trocar o tipo
                  // sem limpar os dois deixaria um recorte impossivel.
                  [QUERY_PARAMS.subCategory]: "",
                  [QUERY_PARAMS.tag]: "",
                })
              }
            />
          </div>
        )}

        {subCategoryOptions.length > 1 && (
          <div className="flex flex-col gap-2 lg:w-[240px]">
            <label
              htmlFor="publicacoes-perfil"
              className="text-[13px] font-medium text-black"
            >
              Tipo de perfil
            </label>
            <SelectGeneric
              id="publicacoes-perfil"
              placeholder="Todos os perfis"
              clearLabel="Todos os perfis"
              items={subCategoryOptions}
              value={subCategoryParam}
              onValueChange={(value) =>
                updateParams({ [QUERY_PARAMS.subCategory]: value })
              }
            />
          </div>
        )}

        {tagOptions.length > 1 && (
          <div className="flex flex-col gap-2 lg:w-[200px]">
            <label
              htmlFor="publicacoes-tema"
              className="text-[13px] font-medium text-black"
            >
              Tema
            </label>
            <SelectGeneric
              id="publicacoes-tema"
              placeholder="Todos os temas"
              clearLabel="Todos os temas"
              items={tagOptions}
              value={tagParam}
              onValueChange={(value) =>
                updateParams({ [QUERY_PARAMS.tag]: value })
              }
            />
          </div>
        )}

        {yearOptions.length > 1 && (
          <div className="flex flex-col gap-2 lg:w-[140px]">
            <label
              htmlFor="publicacoes-ano"
              className="text-[13px] font-medium text-black"
            >
              Ano
            </label>
            <SelectGeneric
              id="publicacoes-ano"
              placeholder="Todos os anos"
              clearLabel="Todos os anos"
              items={yearOptions}
              value={yearParam}
              onValueChange={(value) =>
                updateParams({ [QUERY_PARAMS.year]: value })
              }
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-row flex-wrap items-center justify-between gap-3 lg:px-5">
        <p aria-live="polite" className="text-[13px] text-[#555555]">
          {resultLabel}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[13px] font-semibold text-[#A90920] underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {isLoading ? (
        <CircularProgressIndicator containerHeight="400px" />
      ) : items.length > 0 ? (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 w-full my-[6%] lg:mt-[40px] md:h-full lg:px-5 gap-[4%]">
          {items.map((item, index) => (
            <CardPublication
              id={item.id}
              key={`card-publication-${item.id}-${index}`}
              image={item.imageUrl}
              description={item.shortDescription}
              title={item.title}
              category={item.category}
              publishDate={item.publishDate}
              authors={item.authors}
              path={buildPath(item.category, item.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="h-[400px]">
          <ContentNotFoundWarning
            message={
              hasActiveFilters
                ? "Nenhuma publicação corresponde a esses filtros"
                : "Nenhuma publicação disponível"
            }
          />
        </div>
      )}

      {totalItems > itemsPerPage && (
        <div className="flex flex-row w-full">
          <PaginationGeneric
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={(page) =>
              updateParams({
                [QUERY_PARAMS.page]: page > 1 ? String(page) : "",
              })
            }
          />
        </div>
      )}
    </div>
  );
};

export { PublicationsLibrary };
