import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { accessLabels, documentTypeLabels, languageLabels } from "@/lib/biblioteca/constants";
import { getDocumentBySlug, getRelatedDocuments } from "@/lib/biblioteca/queries";
import type { LibraryDocument } from "@/lib/biblioteca/types";

import { documentPageContent, systemRecommendations } from "../../_constants";

/**
 * Ficha do documento. O conteudo aqui e metadado — o documento integral fica na
 * origem, e o botao principal leva para la.
 */
export const dynamic = "force-dynamic";

interface DocumentPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
  const document = await getDocumentBySlug(params.slug).catch(() => null);

  if (!document) return { title: "Documento não encontrado — Biblioteca Daddus" };

  const description =
    document.abstract?.slice(0, 200) ??
    `${documentTypeLabels[document.documentType]} de ${document.source.name}.`;

  return {
    title: `${document.title} — Biblioteca Daddus`,
    description,
    alternates: { canonical: `/biblioteca/documento/${document.slug}` },
    openGraph: {
      title: document.title,
      description,
      url: `/biblioteca/documento/${document.slug}`,
      type: "article",
    },
  };
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
});

const DocumentPage = async ({ params }: DocumentPageProps) => {
  const document = await getDocumentBySlug(params.slug).catch(() => null);

  if (!document) notFound();

  const related = await getRelatedDocuments(document, 4).catch(() => []);
  const systemSlug = document.topics.find((topic) => topic.systemSlug)?.systemSlug;
  const system = systemSlug ? systemRecommendations[systemSlug] : undefined;

  return (
    <main className="mx-auto flex w-full max-w-screen-limit flex-col gap-8 px-5percent py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(document)) }}
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
            <Link
              href={`/biblioteca?tipo=${document.documentType}`}
              className="hover:text-primary"
            >
              {documentTypeLabels[document.documentType]}
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li className="text-secondary">{document.title}</li>
        </ol>
      </nav>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-sm bg-medium-gray px-2 py-1 text-xs font-semibold uppercase tracking-wide text-secondary">
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
                    className="rounded-sm bg-light-gray px-2 py-1 text-xs hover:text-primary"
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
        <aside className="max-w-[760px] rounded-md bg-medium-gray px-5 py-4 text-sm">
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
