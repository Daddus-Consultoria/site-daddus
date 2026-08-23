import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { CircularProgressIndicator } from "@/components/circularProgressIndicator";
import { LibraryExplorer } from "@/components/libraryExplorer";
import { getLibrarySources, getLibrarySummary } from "@/lib/biblioteca/queries";

import { libraryPageContent } from "./_constants";

/**
 * Biblioteca Daddus — mecanismo de descoberta sobre acervos externos.
 *
 * A pagina e renderizada a cada requisicao porque o recorte vem da URL; o que
 * e estavel (temas, fontes, total) sai do banco na mesma passagem.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Biblioteca Daddus — pesquisa em acervos acadêmicos e institucionais",
  description: libraryPageContent.intro,
  alternates: { canonical: "/biblioteca" },
  openGraph: {
    title: "Biblioteca Daddus",
    description: libraryPageContent.intro,
    url: "/biblioteca",
    type: "website",
  },
};

/** Todos os temas cabem no bloco de entrada; o limite existe so por seguranca. */
const TOPIC_LIMIT = 40;

interface LibraryPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const LibraryPage = async ({ searchParams }: LibraryPageProps) => {
  // Uma falha no banco nao deve derrubar a pagina inteira: sem os atalhos, a
  // busca continua de pe.
  const [summary, sources] = await Promise.all([
    getLibrarySummary(TOPIC_LIMIT).catch(() => null),
    getLibrarySources(true).catch(() => []),
  ]);

  // Os atalhos de entrada servem a quem chega sem recorte. Sobre uma lista de
  // resultados eles empurrariam o que o usuario veio ver para baixo da dobra.
  const showEntryPoints = Object.keys(searchParams).length === 0;

  const stats = summary
    ? [
        {
          label: libraryPageContent.statDocuments,
          value: summary.documents.toLocaleString("pt-BR"),
        },
        { label: libraryPageContent.statSources, value: summary.sources.toLocaleString("pt-BR") },
        summary.yearFrom && summary.yearTo
          ? {
              label: libraryPageContent.statYears,
              value: `${summary.yearFrom}–${summary.yearTo}`,
            }
          : null,
      ].filter((stat): stat is { label: string; value: string } => Boolean(stat))
    : [];

  return (
    <main className="w-full">
      <header className="border-b border-border bg-mediumGray">
        <div className="mx-auto flex w-full max-w-screen-limit flex-col gap-6 px-5percent py-10 lg:py-14">
          <div className="flex flex-col gap-3">
            <h1 className="text-[28px] font-bold leading-tight text-secondary lg:text-[36px]">
              {libraryPageContent.title}
            </h1>
            <p className="max-w-[760px] text-[17px] leading-relaxed text-foreground/80">
              {libraryPageContent.intro}
            </p>
            <p className="max-w-[760px] text-sm text-label">{libraryPageContent.sourceNote}</p>
          </div>

          {/* Os numeros do acervo com nome e unidade, e nao emendados no fim de
              uma frase: e a informacao que diz de que tamanho e o que se busca. */}
          {stats.length > 0 && (
            <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-label">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold tabular-nums text-secondary lg:text-3xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-screen-limit flex-col gap-10 px-5percent py-10">
        {showEntryPoints && summary && summary.topics.length > 0 && (
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-secondary">
                {libraryPageContent.startTitle}
              </h2>
              <p className="mt-1 max-w-[760px] text-sm text-label">
                {libraryPageContent.startDescription}
              </p>
            </div>

            {/* A contagem ao lado do tema evita a pilula muda: o usuario escolhe
                sabendo o tamanho do recorte antes de clicar. */}
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {summary.topics.map((topic) => (
                <li key={topic.value} className="border-b border-border">
                  <Link
                    href={`/biblioteca/${topic.value}`}
                    className="group flex items-baseline justify-between gap-4 py-2.5"
                  >
                    <span className="text-[15px] text-secondary group-hover:text-primary">
                      {topic.label}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-label">
                      {topic.count.toLocaleString("pt-BR")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Suspense fallback={<CircularProgressIndicator containerHeight="400px" />}>
          <LibraryExplorer />
        </Suspense>

        {sources.length > 0 && (
          <section className="flex flex-col gap-3 border-t border-border pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">
              {libraryPageContent.sourcesTitle}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <li key={source.slug}>
                  <Link
                    href={`/biblioteca/${source.slug}`}
                    className="inline-block rounded-full border border-border px-3 py-1.5 text-sm text-secondary transition hover:border-primary hover:text-primary"
                  >
                    {source.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
};

export default LibraryPage;
