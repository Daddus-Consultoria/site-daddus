import { documentTypeByRoute, documentTypeLabels } from "@/lib/biblioteca/constants";
import { getLibrarySources, getLibraryTopics } from "@/lib/biblioteca/queries";
import type { LibraryQuery } from "@/lib/biblioteca/types";

/**
 * Resolucao de um recorte da Biblioteca — `/biblioteca/teses`,
 * `/biblioteca/ppp`, `/biblioteca/ipea`.
 *
 * Fica fora da pagina porque o cartao de compartilhamento tambem precisa saber
 * de que recorte se trata, e duplicar a resolucao deixaria os dois textos
 * livres para divergir.
 */
export interface Recorte {
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
export const resolveRecorte = async (slug: string): Promise<Recorte | null> => {
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
