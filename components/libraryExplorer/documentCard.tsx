import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { accessLabels, documentTypeLabels } from "@/lib/biblioteca/constants";
import type { LibraryDocument } from "@/lib/biblioteca/types";

/**
 * Resultado da Biblioteca. A ordem de leitura e a da spec: tipo, titulo,
 * autoria/fonte/ano, trecho do resumo, temas, indicadores e acoes — com o
 * documento original como acao principal, porque e para la que o usuario vai.
 *
 * Tipo, ano e acesso abrem o cartao como uma linha so de metadados: sao o que
 * o olho usa para descartar um resultado, e cabem antes do titulo justamente
 * por isso. Abaixo do titulo fica a procedencia, que e o que sustenta a
 * citacao.
 */

const ABSTRACT_PREVIEW_LENGTH = 260;

/** Acima disso a lista de temas compete com o resumo em vez de resumi-lo. */
const MAX_TOPICS = 4;

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
  const topics = document.topics.slice(0, MAX_TOPICS);
  const hiddenTopics = document.topics.length - topics.length;

  return (
    <article className="flex flex-col gap-2.5 border-b border-border py-6 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
        <span className="font-semibold uppercase tracking-wide text-primary">
          {documentTypeLabels[document.documentType]}
        </span>
        {document.year && (
          <span className="tabular-nums text-label">{document.year}</span>
        )}
        {document.openAccess && (
          <span className="text-label">{accessLabels[document.access]}</span>
        )}
        {document.curated && (
          <span className="rounded-sm border border-primary px-2 py-0.5 font-semibold uppercase tracking-wide text-primary">
            Seleção Daddus
          </span>
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
        {[authors, document.institution ?? document.source.name].filter(Boolean).join(" · ")}
      </p>

      {abstract && <p className="text-sm leading-relaxed text-foreground/80">{abstract}</p>}

      {topics.length > 0 && (
        // O tema e um recorte com endereco proprio: deixa-lo mudo desperdicava
        // o caminho mais curto entre um resultado util e outros como ele.
        <ul className="flex flex-wrap items-center gap-2 pt-0.5">
          {topics.map((topic) => (
            <li key={topic.slug}>
              <Link
                href={`/biblioteca/${topic.slug}`}
                className="inline-block rounded-sm bg-lightgray px-2 py-1 text-xs text-secondary transition hover:text-primary"
              >
                {topic.name}
              </Link>
            </li>
          ))}
          {hiddenTopics > 0 && (
            <li className="text-xs text-label">e mais {hiddenTopics}</li>
          )}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1.5">
        <a
          href={document.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4"
        >
          Acessar em {document.source.name}
          <ExternalLink size={14} aria-hidden />
        </a>
        <Link
          href={`/biblioteca/documento/${document.slug}`}
          className="text-sm font-medium text-label underline underline-offset-4 hover:text-secondary"
        >
          Ver ficha do documento
        </Link>
      </div>
    </article>
  );
};

export { DocumentCard };
