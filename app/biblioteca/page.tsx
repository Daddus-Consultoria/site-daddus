import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { CircularProgressIndicator } from "@/components/circularProgressIndicator";
import { LibraryExplorer } from "@/components/libraryExplorer";
import { getLibrarySources, getLibraryStats, getLibraryTopics } from "@/lib/biblioteca/queries";

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

const LibraryPage = async () => {
  // Uma falha no banco nao deve derrubar a pagina inteira: sem os atalhos, a
  // busca continua de pe.
  const [topics, sources, stats] = await Promise.all([
    getLibraryTopics().catch(() => []),
    getLibrarySources().catch(() => []),
    getLibraryStats().catch(() => ({ documents: 0, sources: 0, curated: 0 })),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-screen-limit flex-col gap-10 px-5percent py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-[26px] font-bold text-primary lg:text-[32px]">
          {libraryPageContent.title}
        </h1>
        <p className="max-w-[760px] text-base leading-relaxed text-foreground/80">
          {libraryPageContent.intro}
        </p>
        <p className="max-w-[760px] text-sm text-label">
          {libraryPageContent.sourceNote}
          {stats.documents > 0 && (
            <>
              {" "}
              {stats.documents.toLocaleString("pt-BR")} documentos de{" "}
              {stats.sources.toLocaleString("pt-BR")}{" "}
              {stats.sources === 1 ? "fonte" : "fontes"}.
            </>
          )}
        </p>
      </header>

      <Suspense fallback={<CircularProgressIndicator containerHeight="400px" />}>
        <LibraryExplorer />
      </Suspense>

      {topics.length > 0 && (
        <section className="flex flex-col gap-3 border-t border-border pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">
            {libraryPageContent.topicsTitle}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/biblioteca/${topic.slug}`}
                  className="inline-block rounded-full border border-border px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary"
                >
                  {topic.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {sources.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">
            {libraryPageContent.sourcesTitle}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {sources.map((source) => (
              <li key={source.slug}>
                <Link
                  href={`/biblioteca/${source.slug}`}
                  className="inline-block rounded-full border border-border px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary"
                >
                  {source.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};

export default LibraryPage;
