import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CircularProgressIndicator } from "@/components/circularProgressIndicator";
import { LibraryExplorer } from "@/components/libraryExplorer";
import { documentTypeByRoute, documentTypeLabels } from "@/lib/biblioteca/constants";
import { getLibrarySources, getLibraryTopics } from "@/lib/biblioteca/queries";
import type { LibraryQuery } from "@/lib/biblioteca/types";

/**
 * Recortes com URL propria: /biblioteca/teses, /biblioteca/ppp,
 * /biblioteca/ipea. Sao os mesmos filtros da busca, mas com endereco estavel e
 * indexavel — quem procura "teses sobre PPP" chega direto ao recorte.
 */
export const dynamic = "force-dynamic";

interface RecortePageProps {
  params: { recorte: string };
}

interface Recorte {
  title: string;
  description: string;
  filters: Partial<LibraryQuery>;
  /** Grupo de filtro que a pagina ja fixa e some do painel. */
  hiddenGroup: string;
}

/**
 * A ordem importa: tipo primeiro (lista fechada no codigo), depois tema e
 * fonte, que vem do banco e podem mudar sem deploy.
 */
const resolveRecorte = async (slug: string): Promise<Recorte | null> => {
  const type = documentTypeByRoute[slug];

  if (type) {
    return {
      title: documentTypeLabels[type],
      description: `Documentos do tipo ${documentTypeLabels[type].toLowerCase()} indexados na Biblioteca Daddus.`,
      filters: { types: [type] },
      hiddenGroup: "types",
    };
  }

  const [topics, sources] = await Promise.all([getLibraryTopics(), getLibrarySources()]);
  const topic = topics.find((item) => item.slug === slug);

  if (topic) {
    return {
      title: topic.name,
      description: `Publicações sobre ${topic.name.toLowerCase()} em acervos acadêmicos e institucionais.`,
      filters: { topics: [topic.slug] },
      hiddenGroup: "topics",
    };
  }

  const source = sources.find((item) => item.slug === slug);

  if (source) {
    return {
      title: source.name,
      description: `Documentos indexados a partir do acervo ${source.name}.`,
      filters: { sources: [source.slug] },
      hiddenGroup: "sources",
    };
  }

  return null;
};

export async function generateMetadata({ params }: RecortePageProps): Promise<Metadata> {
  const recorte = await resolveRecorte(params.recorte).catch(() => null);

  if (!recorte) return { title: "Recorte não encontrado — Biblioteca Daddus" };

  return {
    title: `${recorte.title} — Biblioteca Daddus`,
    description: recorte.description,
    alternates: { canonical: `/biblioteca/${params.recorte}` },
    openGraph: {
      title: `${recorte.title} — Biblioteca Daddus`,
      description: recorte.description,
      url: `/biblioteca/${params.recorte}`,
      type: "website",
    },
  };
}

const RecortePage = async ({ params }: RecortePageProps) => {
  const recorte = await resolveRecorte(params.recorte).catch(() => null);

  if (!recorte) notFound();

  return (
    <main className="mx-auto flex w-full max-w-screen-limit flex-col gap-8 px-5percent py-10">
      <nav aria-label="Trilha de navegação" className="text-sm text-label">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/biblioteca" className="hover:text-primary">
              Biblioteca Daddus
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li className="text-secondary">{recorte.title}</li>
        </ol>
      </nav>

      <header className="flex flex-col gap-2">
        <h1 className="text-[26px] font-bold text-primary lg:text-[32px]">{recorte.title}</h1>
        <p className="max-w-[760px] text-base text-foreground/80">{recorte.description}</p>
      </header>

      <Suspense fallback={<CircularProgressIndicator containerHeight="400px" />}>
        <LibraryExplorer
          fixedFilters={recorte.filters}
          hiddenGroups={[recorte.hiddenGroup]}
        />
      </Suspense>
    </main>
  );
};

export default RecortePage;
