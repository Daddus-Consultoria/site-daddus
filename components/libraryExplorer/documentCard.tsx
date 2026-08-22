import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { accessLabels, documentTypeLabels } from "@/lib/biblioteca/constants";
import type { LibraryDocument } from "@/lib/biblioteca/types";

/**
 * Resultado da Biblioteca. A ordem de leitura e a da spec: tipo, titulo,
 * autoria/fonte/ano, trecho do resumo, temas, indicadores e acoes — com o
 * documento original como acao principal, porque e para la que o usuario vai.
 */

const ABSTRACT_PREVIEW_LENGTH = 260;

const preview = (abstract: string | null): string | null => {
  if (!abstract) return null;
  if (abstract.length <= ABSTRACT_PREVIEW_LENGTH) return abstract;

  // Corta na ultima palavra inteira, para o resumo nao terminar no meio de uma.
  const cut = abstract.slice(0, ABSTRACT_PREVIEW_LENGTH);

  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

const authorLine = (authors: string[]): string | null => {
  if (!authors.length) return null;
  if (authors.length <= 3) return authors.join("; ");

  return `${authors.slice(0, 3).join("; ")} e mais ${authors.length - 3}`;
};

interface DocumentCardProps {
  document: LibraryDocument;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const abstract = preview(document.abstract);
  const authors = authorLine(document.authors);

  return (
    <article className="flex flex-col gap-3 border-b border-border py-6 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-sm bg-medium-gray px-2 py-1 text-xs font-semibold uppercase tracking-wide text-secondary">
          {documentTypeLabels[document.documentType]}
        </span>
        {document.curated && (
          <span className="rounded-sm border border-primary px-2 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Seleção Daddus
          </span>
        )}
        {document.openAccess && (
          <span className="text-xs font-medium text-label">{accessLabels[document.access]}</span>
        )}
      </div>

      <h3 className="text-lg font-semibold leading-snug text-secondary">
        <Link
          href={`/biblioteca/documento/${document.slug}`}
          className="hover:text-primary hover:underline"
        >
          {document.title}
          {document.subtitle ? `: ${document.subtitle}` : ""}
        </Link>
      </h3>

      <p className="text-sm text-label">
        {[authors, document.institution ?? document.source.name, document.year]
          .filter(Boolean)
          .join(" · ")}
      </p>

      {abstract && <p className="text-sm leading-relaxed text-foreground/80">{abstract}</p>}

      {document.topics.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {document.topics.map((topic) => (
            <li
              key={topic.slug}
              className="rounded-sm bg-light-gray px-2 py-1 text-xs text-secondary"
            >
              {topic.name}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Link
          href={`/biblioteca/documento/${document.slug}`}
          className="text-sm font-semibold text-secondary underline underline-offset-4 hover:text-primary"
        >
          Ver detalhes
        </Link>
        <a
          href={document.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4"
        >
          Acessar em {document.source.name}
          <ExternalLink size={14} aria-hidden />
        </a>
      </div>
    </article>
  );
};

export { DocumentCard };
