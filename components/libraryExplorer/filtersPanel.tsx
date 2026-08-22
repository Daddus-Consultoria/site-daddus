"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";

import type { LibraryFacet, LibraryFacets } from "@/lib/biblioteca/types";

/**
 * Filtros combinaveis. Cada opcao mostra quantos documentos traria dentro do
 * recorte atual — e por isso que uma opcao com zero resultado simplesmente nao
 * aparece: a faceta vem do proprio acervo filtrado.
 */

const MAX_VISIBLE_OPTIONS = 8;

/** A partir daqui, rolar a lista atras de uma opcao custa mais do que digitar. */
const SEARCHABLE_FROM = 10;

const deaccent = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

interface FilterGroupProps {
  title: string;
  options: LibraryFacet[];
  selected: string[];
  onToggle: (value: string) => void;
  expanded: boolean;
  onExpand: () => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  options,
  selected,
  onToggle,
  expanded,
  onExpand,
}) => {
  const [term, setTerm] = useState("");

  const matching = useMemo(() => {
    const needle = deaccent(term.trim());

    if (!needle) return options;

    return options.filter((option) => deaccent(option.label).includes(needle));
  }, [options, term]);

  if (!options.length) return null;

  const searchable = options.length >= SEARCHABLE_FROM;
  // Buscar dentro do grupo ja e escolher: mostrar so os oito primeiros de um
  // resultado filtrado esconderia justamente o que o usuario procurou.
  const visible =
    expanded || term.trim() ? matching : matching.slice(0, MAX_VISIBLE_OPTIONS);
  const selectedHidden = options.filter(
    (option) => selected.includes(option.value) && !visible.includes(option)
  );

  return (
    <fieldset className="border-b border-border py-5 last:border-b-0">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary">
        {title}
      </legend>

      {searchable && (
        <div className="relative mb-2">
          <Search
            size={14}
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-label"
            aria-hidden
          />
          <input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder={`Buscar em ${title.toLowerCase()}`}
            aria-label={`Buscar em ${title.toLowerCase()}`}
            className="w-full rounded-sm border border-border py-1.5 pl-7 pr-2 text-sm text-secondary outline-none focus:border-primary"
          />
        </div>
      )}

      <ul className="flex flex-col gap-1">
        {/* Um filtro ativo nunca some da lista: some-lo tiraria do usuario o
            jeito de desmarca-lo. */}
        {[...visible, ...selectedHidden].map((option) => {
          const isSelected = selected.includes(option.value);

          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onToggle(option.value)}
                aria-pressed={isSelected}
                className="flex w-full items-center justify-between gap-2 rounded-sm px-1 py-1.5 text-left text-sm hover:bg-medium-gray"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border ${
                      isSelected ? "border-primary bg-primary text-white" : "border-border"
                    }`}
                    aria-hidden
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className={isSelected ? "font-medium text-secondary" : "text-foreground/80"}>
                    {option.label}
                  </span>
                </span>
                <span className="text-xs text-label">{option.count}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {!term.trim() && matching.length > MAX_VISIBLE_OPTIONS && !expanded && (
        <button
          type="button"
          onClick={onExpand}
          className="mt-2 text-xs font-semibold text-primary underline underline-offset-4"
        >
          Ver todos os {matching.length}
        </button>
      )}

      {term.trim() && !matching.length && (
        <p className="mt-2 text-xs text-label">Nenhuma opção com esse termo.</p>
      )}
    </fieldset>
  );
};

interface FiltersPanelProps {
  facets: LibraryFacets;
  selected: {
    types: string[];
    topics: string[];
    sources: string[];
    languages: string[];
    access: string[];
  };
  yearFrom?: number;
  yearTo?: number;
  curatedOnly: boolean;
  expandedGroups: string[];
  /** Grupos ocultos quando a pagina ja fixa aquele recorte (ex.: /biblioteca/teses). */
  hiddenGroups?: string[];
  onToggle: (group: string, value: string) => void;
  onYearChange: (field: "yearFrom" | "yearTo", value: string) => void;
  onCuratedChange: (value: boolean) => void;
  onExpand: (group: string) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  facets,
  selected,
  yearFrom,
  yearTo,
  curatedOnly,
  expandedGroups,
  hiddenGroups = [],
  onToggle,
  onYearChange,
  onCuratedChange,
  onExpand,
}) => {
  const years = facets.years.map((facet) => facet.value);
  const groupProps = (group: string) => ({
    expanded: expandedGroups.includes(group),
    onExpand: () => onExpand(group),
    onToggle: (value: string) => onToggle(group, value),
  });

  const isVisible = (group: string) => !hiddenGroups.includes(group);

  return (
    <div className="flex flex-col">
      {isVisible("types") && (
        <FilterGroup
          title="Tipo de documento"
          options={facets.types}
          selected={selected.types}
          {...groupProps("types")}
        />
      )}

      {isVisible("topics") && (
        <FilterGroup
          title="Tema"
          options={facets.topics}
          selected={selected.topics}
          {...groupProps("topics")}
        />
      )}

      {isVisible("sources") && (
        <FilterGroup
          title="Fonte"
          options={facets.sources}
          selected={selected.sources}
          {...groupProps("sources")}
        />
      )}

      <fieldset className="border-b border-border py-5">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary">
          Ano
        </legend>

        <div className="flex items-center gap-2">
          {(["yearFrom", "yearTo"] as const).map((field) => (
            <label key={field} className="flex flex-1 flex-col gap-1 text-xs text-label">
              {field === "yearFrom" ? "De" : "Até"}
              <select
                value={(field === "yearFrom" ? yearFrom : yearTo) ?? ""}
                onChange={(event) => onYearChange(field, event.target.value)}
                className="rounded-sm border border-border bg-white px-2 py-1.5 text-sm text-secondary"
              >
                <option value="">—</option>
                {years.map((year) => (
                  <option key={`${field}-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </fieldset>

      {isVisible("languages") && (
        <FilterGroup
          title="Idioma"
          options={facets.languages}
          selected={selected.languages}
          {...groupProps("languages")}
        />
      )}

      <FilterGroup
        title="Acesso"
        options={facets.access}
        selected={selected.access}
        {...groupProps("access")}
      />

      <fieldset className="py-5">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary">
          Curadoria
        </legend>

        <button
          type="button"
          onClick={() => onCuratedChange(!curatedOnly)}
          aria-pressed={curatedOnly}
          className="flex w-full items-center gap-2 rounded-sm px-1 py-1.5 text-left text-sm hover:bg-medium-gray"
        >
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border ${
              curatedOnly ? "border-primary bg-primary text-white" : "border-border"
            }`}
            aria-hidden
          >
            {curatedOnly && <Check size={12} strokeWidth={3} />}
          </span>
          <span className={curatedOnly ? "font-medium text-secondary" : "text-foreground/80"}>
            Apenas Seleção Daddus
          </span>
        </button>
      </fieldset>
    </div>
  );
};

export { FiltersPanel };
