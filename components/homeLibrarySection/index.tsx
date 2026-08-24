"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { bibliotecaHome } from "@/app/constants";
import { LIBRARY_QUERY_PARAMS } from "@/lib/biblioteca/constants";
import { QueryKeys } from "@/lib/constants/queryKeys";
import { TimeConstants } from "@/lib/constants/constants";
import { LibraryUseCases } from "@/lib/useCases/libraryUseCases";

/**
 * A Biblioteca na home (docs/DIRETRIZES-UX.md, secoes 5 e 14: dar destaque a
 * producao de conhecimento e aos dados).
 *
 * A secao e a propria ferramenta, nao um cartao que fala sobre ela: quem chega
 * ja digita a busca aqui e cai no resultado. As secoes vizinhas apresentam o
 * que a Daddus produziu; esta abre um acervo de terceiros, e por isso os
 * numeros e os temas tem de vir do banco — inventa-los seria afirmar tamanho
 * de acervo que ninguem pode conferir.
 *
 * Fundo branco de proposito: a secao do blog, logo acima, ja e cinza, e duas
 * faixas cinzas seguidas fundem as duas em um bloco so, com uma linha dupla no
 * meio. A alternancia da home e o que separa uma secao da outra.
 */

/** Cabem seis na coluna sem competir com a busca ao lado. */
const HOME_TOPICS = 6;

const HomeLibrarySection: React.FC = () => {
  const router = useRouter();
  const [draft, setDraft] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [QueryKeys.librarySummary],
    queryFn: async () => await new LibraryUseCases().getLibrarySummary(),
    staleTime: TimeConstants.TEN_MINUTES,
    retry: 1,
  });

  // Mesmo criterio do bloco de numeros da home: sem banco, a secao inteira sai
  // em vez de mostrar moldura vazia ou total zerado.
  if (isError || (!isLoading && !data?.documents)) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const term = draft.trim();

    router.push(
      term
        ? `/biblioteca?${LIBRARY_QUERY_PARAMS.search}=${encodeURIComponent(term)}`
        : "/biblioteca"
    );
  };

  return (
    <section className="border-y border-gray-200">
      <div className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-16">
        {/* Mesmo cabecalho das secoes vizinhas: titulo a esquerda, destino
            nomeado a direita — e nao um link escondido no fim de uma frase. */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-secondary">{bibliotecaHome.titulo}</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-[#696984]">
              {bibliotecaHome.texto}
            </p>
          </div>
          <Link href="/biblioteca" className="text-sm font-semibold text-primary hover:underline">
            {bibliotecaHome.rotuloAcervo} →
          </Link>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="busca-biblioteca-home" className="sr-only">
                {bibliotecaHome.rotuloBusca}
              </label>
              <div className="relative flex-1">
                <Search
                  size={18}
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b8b9a]"
                />
                <input
                  id="busca-biblioteca-home"
                  type="search"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={bibliotecaHome.placeholder}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white py-3.5 pl-11 pr-4 text-[15px] text-secondary outline-none transition placeholder:text-[#8b8b9a] focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-90"
              >
                {bibliotecaHome.rotuloBusca}
              </button>
            </form>

            {/* O tamanho do acervo e o argumento da secao: no meio de uma frase
                em corpo pequeno, o unico numero que a sustenta ficava menor que
                o rotulo ao lado. Mesmo tratamento do bloco de numeros da home. */}
            <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
              {isLoading ? (
                [1, 2].map((item) => (
                  <div key={`numero-vazio-${item}`}>
                    <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
                    <div className="mt-2.5 h-8 w-24 animate-pulse rounded bg-gray-200" />
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8b9a]">
                      Documentos indexados
                    </dt>
                    <dd className="mt-1 text-3xl font-bold tabular-nums text-secondary">
                      {data?.documents.toLocaleString("pt-BR")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8b9a]">
                      {data?.sources === 1 ? "Fonte" : "Fontes"}
                    </dt>
                    <dd className="mt-1 text-3xl font-bold tabular-nums text-secondary">
                      {data?.sources.toLocaleString("pt-BR")}
                    </dd>
                  </div>
                  {data?.yearFrom && data?.yearTo && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8b9a]">
                        Cobertura
                      </dt>
                      <dd className="mt-1 text-3xl font-bold tabular-nums text-secondary">
                        {data.yearFrom}–{data.yearTo}
                      </dd>
                    </div>
                  )}
                </>
              )}
            </dl>

            <p className="mt-4 text-xs text-[#8b8b9a]">{bibliotecaHome.notaFonte}</p>
          </div>

          {/* Quem nao sabe o que digitar entra por tema — e o numero ao lado diz
              de antemao o tamanho do recorte. */}
          <div className="lg:border-l lg:border-gray-200 lg:pl-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8b9a]">
              {bibliotecaHome.rotuloTemas}
            </h3>
            <ul className="mt-4 flex flex-col">
              {isLoading &&
                [1, 2, 3, 4, 5, 6].map((item) => (
                  <li
                    key={`tema-vazio-${item}`}
                    className="border-b border-gray-200 py-2.5 last:border-b-0"
                  >
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  </li>
                ))}

              {data?.topics.slice(0, HOME_TOPICS).map((topic) => (
                <li key={topic.value} className="border-b border-gray-200 last:border-b-0">
                  <Link
                    href={`/biblioteca/${topic.value}`}
                    className="group flex items-baseline justify-between gap-4 py-2.5"
                  >
                    <span className="text-[15px] text-secondary group-hover:text-primary">
                      {topic.label}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-[#8b8b9a]">
                      {topic.count.toLocaleString("pt-BR")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HomeLibrarySection };
