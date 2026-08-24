import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CircularProgressIndicator } from "@/components/circularProgressIndicator";
import { LibraryExplorer } from "@/components/libraryExplorer";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo/jsonLd";
import { pageMetadata } from "@/lib/seo/metadata";

import { resolveRecorte } from "../_recorte";

/**
 * Recortes com URL propria: /biblioteca/teses, /biblioteca/ppp,
 * /biblioteca/ipea. Sao os mesmos filtros da busca, mas com endereco estavel e
 * indexavel — quem procura "teses sobre PPP" chega direto ao recorte.
 *
 * Cacheada por uma hora em vez de renderizada a cada requisicao: o cabecalho
 * so muda quando a equipe mexe nos temas do banco, e o painel de resultados e
 * client component, que continua lendo o recorte da URL a cada visita.
 */
export const revalidate = 3600;

interface RecortePageProps {
  params: { recorte: string };
}

export async function generateMetadata({ params }: RecortePageProps): Promise<Metadata> {
  const recorte = await resolveRecorte(params.recorte).catch(() => null);
  const path = `/biblioteca/${params.recorte}`;

  if (!recorte) {
    return pageMetadata({
      title: "Recorte não encontrado — Biblioteca Daddus",
      description: "O recorte buscado não existe na Biblioteca Daddus.",
      path,
      fullTitle: true,
      index: false,
    });
  }

  return pageMetadata({
    title: `${recorte.title} — Biblioteca Daddus`,
    description: recorte.description,
    path,
    fullTitle: true,
  });
}

const RecortePage = async ({ params }: RecortePageProps) => {
  const recorte = await resolveRecorte(params.recorte).catch(() => null);

  if (!recorte) notFound();

  const path = `/biblioteca/${params.recorte}`;

  return (
    <main className="w-full">
      {/* Uma colecao, e nao um artigo: e o que diz ao buscador que a pagina
          reune documentos de terceiros em vez de publicar um texto proprio. */}
      <JsonLd
        data={collectionPageJsonLd({
          name: `${recorte.title} — Biblioteca Daddus`,
          description: recorte.description,
          path,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Biblioteca Daddus", path: "/biblioteca" },
          { name: recorte.title, path },
        ])}
      />

      {/* Mesmo cabecalho da Biblioteca: as duas telas sao a mesma area, e o
          recorte se anuncia pela trilha, nao por um estilo proprio. */}
      <header className="border-b border-border bg-mediumGray">
        <div className="mx-auto flex w-full max-w-screen-limit flex-col gap-3 px-5percent py-8 lg:py-10">
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

          <h1 className="text-[28px] font-bold leading-tight text-secondary lg:text-[36px]">
            {recorte.title}
          </h1>
          <p className="max-w-[760px] text-[17px] leading-relaxed text-foreground/80">
            {recorte.description}
          </p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-screen-limit flex-col gap-8 px-5percent py-10">
        <Suspense fallback={<CircularProgressIndicator containerHeight="400px" />}>
          <LibraryExplorer
            fixedFilters={recorte.filters}
            hiddenGroups={[recorte.hiddenGroup]}
          />
        </Suspense>
      </div>
    </main>
  );
};

export default RecortePage;
