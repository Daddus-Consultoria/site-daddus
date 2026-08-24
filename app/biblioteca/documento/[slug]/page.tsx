import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import {
  accessLabels,
  documentTypeLabels,
  documentTypeRoutes,
  languageLabels,
} from "@/lib/biblioteca/constants";
import { getDocumentBySlug, getRelatedDocuments } from "@/lib/biblioteca/queries";
import type { LibraryDocument } from "@/lib/biblioteca/types";
import { absoluteUrl } from "@/lib/seo/constants";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { metaDescription, pageMetadata } from "@/lib/seo/metadata";

import { documentPageContent, systemRecommendations } from "../../_constants";

/**
 * Ficha do documento. O conteudo aqui e metadado — o documento integral fica na
 * origem, e o botao principal leva para la.
 *
 * A pagina e cacheada por um dia, e nao renderizada a cada requisicao. Sao
 * dezenas de milhares de fichas: em `force-dynamic`, cada passada do robo de
 * busca virava uma consulta ao Postgres, e o orcamento de rastreamento se
 * esgotava antes de cobrir o acervo. O registro so muda quando a coleta roda,
 * entao servir a versao cacheada nao atrasa nada.
 */
export const revalidate = 86400;

interface DocumentPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
  const document = await getDocumentBySlug(params.slug);

  const path = `/biblioteca/documento/${params.slug}`;

  if (!document) {
    return pageMetadata({
      title: "Documento não encontrado — Biblioteca Daddus",
      description: "O documento buscado não está indexado na Biblioteca Daddus.",
      path,
      fullTitle: true,
      index: false,
    });
  }

  const label = documentTypeLabels[document.documentType];

  return pageMetadata({
    // Titulo completo: o sufixo da area diz ao leitor do resultado de busca que
    // ali ha uma ficha com a procedencia, e nao o PDF em si.
    title: `${document.title} — Biblioteca Daddus`,
    description: metaDescription(
      document.abstract,
      [label, document.institution ?? document.source.name, document.year]
        .filter(Boolean)
        .join(" · ")
    ),
    path,
    fullTitle: true,
    type: "article",
    authors: document.authors,
  });
}

const MetadataRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:gap-4">
    <dt className="w-44 shrink-0 text-sm text-label">{label}</dt>
    <dd className="text-sm text-secondary">{children}</dd>
  </div>
);

/**
 * Dados estruturados para o documento. Descreve o registro de metadados e
 * aponta a origem como o local do conteudo integral.
 *
 * A distincao entre `url` e `mainEntityOfPage` e o ponto: `url` e onde o
 * documento esta (o portal da fonte), `mainEntityOfPage` e a ficha aqui. Sem
 * ela o buscador leria a Daddus como quem publicou a obra.
 */
const buildJsonLd = (document: LibraryDocument) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: document.title,
  alternateName: document.subtitle ?? undefined,
  abstract: document.abstract ?? undefined,
  author: document.authors.map((name) => ({ "@type": "Person", name })),
  publisher: document.publisher
    ? { "@type": "Organization", name: document.publisher }
    : undefined,
  datePublished: document.year ? String(document.year) : undefined,
  inLanguage: document.language,
  keywords: document.keywords.join(", ") || undefined,
  identifier: document.doi ? `https://doi.org/${document.doi}` : document.identifier ?? undefined,
  license: document.license ?? undefined,
  isAccessibleForFree: document.openAccess,
  url: document.sourceUrl,
  sameAs: document.sourceUrl,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": absoluteUrl(`/biblioteca/documento/${document.slug}`),
  },
});

const DocumentPage = async ({ params }: DocumentPageProps) => {
  // Sem `catch`: a consulta devolve `null` quando o slug nao existe, e so
  // nesse caso a ficha e um 404. Um banco fora do ar precisa virar erro de
  // servidor — engolido, viraria um 404 cacheado por um dia dizendo ao
  // buscador que o documento saiu do acervo.
  const document = await getDocumentBySlug(params.slug);

  if (!document) notFound();

  const related = await getRelatedDocuments(document, 4).catch(() => []);
  const systemSlug = document.topics.find((topic) => topic.systemSlug)?.systemSlug;
  const system = systemSlug ? systemRecommendations[systemSlug] : undefined;
  const typeLabel = documentTypeLabels[document.documentType];
  const typePath = `/biblioteca/${documentTypeRoutes[document.documentType]}`;

  return (
    <main className="mx-auto flex w-full max-w-screen-limit flex-col gap-8 px-5percent py-10">
      <JsonLd data={buildJsonLd(document)} />
      {/* A mesma trilha que aparece na tela, em dados estruturados: o resultado
          de busca passa a exibir "Biblioteca › Teses › documento" no lugar da
          URL crua. */}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Biblioteca Daddus", path: "/biblioteca" },
          { name: typeLabel, path: typePath },
          { name: document.title, path: `/biblioteca/documento/${document.slug}` },
        ])}
      />

      <nav aria-label="Trilha de navegação" className="text-sm text-label">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/biblioteca" className="hover:text-primary">
              Biblioteca Daddus
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li>
            {/* Aponta para o recorte com endereco proprio, e nao para a busca
                com `?tipo=`: e a versao que o buscador indexa e que o usuario
                pode compartilhar. */}
            <Link href={typePath} className="hover:text-primary">
              {typeLabel}
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li className="text-secondary">{document.title}</li>
        </ol>
      </nav>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-sm bg-mediumGray px-2 py-1 text-xs font-semibold uppercase tracking-wide text-secondary">
            {documentTypeLabels[document.documentType]}
          </span>
          {document.curated && (
            <span className="rounded-sm border border-primary px-2 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Seleção Daddus
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold leading-snug text-secondary lg:text-[32px]">
          {document.title}
          {document.subtitle && (
            <span className="block text-xl font-medium text-foreground/70 lg:text-2xl">
              {document.subtitle}
            </span>
          )}
        </h1>

        {!!document.authors.length && (
          <p className="text-sm text-label">{document.authors.join("; ")}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href={document.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            {documentPageContent.accessLabel}
            <ExternalLink size={16} aria-hidden />
          </a>
          <span className="text-sm text-label">{accessLabels[document.access]}</span>
        </div>

        <p className="max-w-[760px] text-xs text-label">
          {documentPageContent.provenanceNote}
        </p>
      </header>

      {document.abstract && (
        <section className="flex max-w-[760px] flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">Resumo</h2>
          <p className="whitespace-pre-line text-base leading-relaxed text-foreground/80">
            {document.abstract}
          </p>
        </section>
      )}

      {document.curated && document.curatorNote && (
        <section className="flex max-w-[760px] flex-col gap-2 border-l-2 border-primary pl-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">
            {documentPageContent.curatedTitle}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/80">{document.curatorNote}</p>
          {document.curatorReason && (
            <p className="text-xs text-label">{document.curatorReason}</p>
          )}
        </section>
      )}

      <section className="flex max-w-[760px] flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">
          {documentPageContent.metadataTitle}
        </h2>

        <dl className="flex flex-col">
          <MetadataRow label="Tipo">{documentTypeLabels[document.documentType]}</MetadataRow>
          {document.year && <MetadataRow label="Ano">{document.year}</MetadataRow>}
          {document.institution && (
            <MetadataRow label="Instituição">{document.institution}</MetadataRow>
          )}
          {document.publisher && document.publisher !== document.institution && (
            <MetadataRow label="Editora">{document.publisher}</MetadataRow>
          )}
          <MetadataRow label="Fonte">
            {document.source.siteUrl ? (
              <a
                href={document.source.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-primary"
              >
                {document.source.name}
              </a>
            ) : (
              document.source.name
            )}
          </MetadataRow>
          {document.otherSources.length > 0 && (
            <MetadataRow label="Também disponível em">
              {document.otherSources.map((source) => source.name).join("; ")}
            </MetadataRow>
          )}
          <MetadataRow label="Idioma">{languageLabels[document.language]}</MetadataRow>
          <MetadataRow label="Acesso">{accessLabels[document.access]}</MetadataRow>
          {document.doi && (
            <MetadataRow label="DOI">
              <a
                href={`https://doi.org/${document.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-primary"
              >
                {document.doi}
              </a>
            </MetadataRow>
          )}
          {document.identifier && (
            <MetadataRow label="Identificador">{document.identifier}</MetadataRow>
          )}
          {document.license && <MetadataRow label="Licença">{document.license}</MetadataRow>}
          {document.coverage && <MetadataRow label="Abrangência">{document.coverage}</MetadataRow>}
          {!!document.topics.length && (
            <MetadataRow label="Temas">
              <span className="flex flex-wrap gap-2">
                {document.topics.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/biblioteca/${topic.slug}`}
                    className="rounded-sm bg-lightgray px-2 py-1 text-xs hover:text-primary"
                  >
                    {topic.name}
                  </Link>
                ))}
              </span>
            </MetadataRow>
          )}
          {!!document.keywords.length && (
            <MetadataRow label="Palavras-chave">
              <span className="flex flex-wrap gap-2">
                {document.keywords.map((keyword) => (
                  <Link
                    key={keyword}
                    href={`/biblioteca?palavra-chave=${encodeURIComponent(keyword)}`}
                    className="text-xs text-label hover:text-primary"
                  >
                    {keyword}
                  </Link>
                ))}
              </span>
            </MetadataRow>
          )}
        </dl>
      </section>

      {system && (
        <aside className="max-w-[760px] rounded-md bg-mediumGray px-5 py-4 text-sm">
          <Link href={system.href} className="font-semibold text-secondary hover:text-primary">
            Conheça o {system.name} — {system.description}
          </Link>
        </aside>
      )}

      {related.length > 0 && (
        <section className="flex flex-col gap-4 border-t border-border pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">
            {documentPageContent.relatedTitle}
          </h2>

          <ul className="grid gap-5 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.id} className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-label">
                  {documentTypeLabels[item.documentType]}
                </span>
                <Link
                  href={`/biblioteca/documento/${item.slug}`}
                  className="text-sm font-semibold leading-snug text-secondary hover:text-primary"
                >
                  {item.title}
                </Link>
                <span className="text-xs text-label">
                  {[item.institution ?? item.source.name, item.year].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link
        href="/biblioteca"
        className="text-sm font-semibold text-primary underline underline-offset-4"
      >
        {documentPageContent.backToLibrary}
      </Link>
    </main>
  );
};

export default DocumentPage;
