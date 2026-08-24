import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { CircularProgressIndicator } from "@/components/circularProgressIndicator";
import { LibraryExplorer } from "@/components/libraryExplorer";
import { getLibrarySourceSummaries, getLibrarySummary } from "@/lib/biblioteca/queries";
import { JsonLd, collectionPageJsonLd } from "@/lib/seo/jsonLd";
import { pageMetadata } from "@/lib/seo/metadata";

import { libraryPageContent } from "./_constants";

/**
 * Biblioteca Daddus — mecanismo de descoberta sobre acervos externos.
 *
 * A pagina e renderizada a cada requisicao porque o recorte vem da URL; o que
 * e estavel (temas, fontes, total) sai do banco na mesma passagem.
 */
export const dynamic = "force-dynamic";

/**
 * A canonica e sempre `/biblioteca`, sem query string: a mesma tela com
 * `?q=`, `?tema=` ou `?pagina=3` e um recorte da busca, nao uma pagina nova, e
 * indexar cada combinacao encheria o indice de variacoes do mesmo conteudo.
 */
export const metadata: Metadata = pageMetadata({
  title: "Biblioteca Daddus — pesquisa em acervos acadêmicos e institucionais",
  description: libraryPageContent.intro,
  path: "/biblioteca",
  fullTitle: true,
});

/**
 * Os temas do bloco de entrada. Os primeiros ganham destaque proporcional e o
 * resto sai em linha: uma lista de vinte e dois temas com o mesmo peso nao
 * hierarquiza nada — informa que os temas existem, nao onde esta o acervo. A
 * lista completa continua no painel de filtros, com a contagem do recorte.
 */
const FEATURED_TOPICS = 6;

/** Teto de seguranca: o painel de filtros e que serve a lista exaustiva. */
const TOPIC_LIMIT = 24;

interface LibraryPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const LibraryPage = async ({ searchParams }: LibraryPageProps) => {
  // Uma falha no banco nao deve derrubar a pagina inteira: sem os atalhos, a
  // busca continua de pe.
  const [summary, sources] = await Promise.all([
    getLibrarySummary(TOPIC_LIMIT).catch(() => null),
    getLibrarySourceSummaries().catch(() => []),
  ]);

  // Os atalhos de entrada servem a quem chega sem recorte. Sobre uma lista de
  // resultados eles empurrariam para baixo da dobra o que o usuario veio ver.
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

  const featured = summary?.topics.slice(0, FEATURED_TOPICS) ?? [];
  const remaining = summary?.topics.slice(FEATURED_TOPICS) ?? [];
  // A barra e lida contra o maior tema, nao contra o total: comparada ao
  // acervo inteiro, nenhuma passaria de um tracinho e a comparacao sumiria.
  const largestTopic = featured[0]?.count ?? 0;

  return (
    <main className="w-full">
      {/* O tamanho do acervo sai da mesma consulta que alimenta os numeros da
          tela — nunca de um literal, que envelheceria a cada coleta. */}
      <JsonLd
        data={collectionPageJsonLd({
          name: "Biblioteca Daddus",
          description: libraryPageContent.intro,
          path: "/biblioteca",
          itemCount: summary?.documents,
        })}
      />

      <header className="border-b border-border bg-mediumGray">
        <div className="mx-auto flex w-full max-w-screen-limit flex-col gap-6 px-5percent py-10 lg:py-14">
          <div className="flex flex-col gap-3">
            <h1 className="text-[28px] font-bold leading-tight text-secondary lg:text-[36px]">
              {libraryPageContent.title}
            </h1>
            <p className="max-w-[760px] text-[17px] leading-relaxed text-foreground/80">
              {libraryPageContent.intro}
            </p>
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
        {showEntryPoints && featured.length > 0 && (
          <section className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-bold text-secondary">{libraryPageContent.startTitle}</h2>
              <p className="mt-1 max-w-[760px] text-sm text-label">
                {libraryPageContent.startDescription}
              </p>
            </div>

            {/* A contagem e a barra dizem o tamanho do recorte antes do clique;
                sem elas, "Economia" e "PPP" pareciam do mesmo tamanho, e um tem
                vinte vezes o acervo do outro. */}
            <ul className="grid gap-x-10 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((topic) => (
                <li key={topic.value}>
                  <Link
                    href={`/biblioteca/${topic.value}`}
                    className="group flex flex-col gap-1.5 py-2.5"
                  >
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="text-[15px] font-medium text-secondary group-hover:text-primary">
                        {topic.label}
                      </span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-label">
                        {topic.count.toLocaleString("pt-BR")}
                      </span>
                    </span>
                    <span aria-hidden className="h-1 w-full rounded-full bg-border">
                      <span
                        className="block h-1 rounded-full bg-primary/50 transition group-hover:bg-primary"
                        style={{
                          width: `${Math.max(
                            4,
                            Math.round((topic.count / (largestTopic || 1)) * 100)
                          )}%`,
                        }}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {remaining.length > 0 && (
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-label">
                <span className="font-medium text-secondary">
                  {libraryPageContent.startMoreLabel}:
                </span>
                {remaining.map((topic, index) => (
                  <span key={topic.value}>
                    <Link href={`/biblioteca/${topic.value}`} className="hover:text-primary">
                      {topic.label}
                    </Link>
                    {index < remaining.length - 1 && <span aria-hidden> ·</span>}
                  </span>
                ))}
              </p>
            )}
          </section>
        )}

        <Suspense fallback={<CircularProgressIndicator containerHeight="400px" />}>
          <LibraryExplorer />
        </Suspense>

        {sources.length > 0 && (
          <section className="flex flex-col gap-4 border-t border-border pt-8">
            <div>
              <h2 className="text-lg font-bold text-secondary">
                {libraryPageContent.sourcesTitle}
              </h2>
              <p className="mt-1 max-w-[760px] text-sm text-label">
                {libraryPageContent.sourcesDescription} {libraryPageContent.sourceNote}
              </p>
            </div>

            {/* Nome, instituicao e volume — nao pilulas iguais. Duas fontes com
                nome parecido so se distinguem pela instituicao, e o volume diz
                quanto do que o usuario acabou de ver veio de cada uma. */}
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {sources.map((source) => (
                <li key={source.slug} className="border-b border-border">
                  <Link
                    href={`/biblioteca/${source.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-3"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] text-secondary group-hover:text-primary">
                        {source.name}
                      </span>
                      {source.institution && source.institution !== source.name && (
                        <span className="mt-0.5 block truncate text-xs text-label">
                          {source.institution}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-label">
                      {source.documents.toLocaleString("pt-BR")}
                    </span>
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
