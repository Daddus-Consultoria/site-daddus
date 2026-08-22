/**
 * Conteudo da Biblioteca Daddus. Ver docs/DIRETRIZES-UX.md (tom de voz) e
 * docs/BIBLIOTECA.md (o que a area e).
 */

export const libraryPageContent = {
  title: "Biblioteca Daddus",
  intro:
    "Encontre livros, estudos, artigos, teses, relatórios e outras publicações de fontes acadêmicas e institucionais.",
  /**
   * A Biblioteca indexa metadados e leva ao documento na origem — dizer isso na
   * propria pagina evita a leitura de "acervo de PDFs da Daddus".
   */
  sourceNote:
    "A Biblioteca reúne metadados de acervos públicos e leva você ao documento no portal de origem.",
  topicsTitle: "Por tema",
  sourcesTitle: "Por fonte",
  curatedTitle: "Seleção Daddus",
  curatedDescription:
    "Documentos que a equipe técnica destacou por relação direta com o trabalho da Daddus.",
};

export const documentPageContent = {
  backToLibrary: "Voltar à Biblioteca",
  accessLabel: "Acessar documento original",
  relatedTitle: "Conteúdos relacionados",
  metadataTitle: "Ficha do documento",
  curatedTitle: "Por que a Daddus destacou",
  /** Aviso de proveniencia: o documento nao esta hospedado aqui. */
  provenanceNote:
    "O documento é disponibilizado pela fonte de origem, que mantém a versão integral e as condições de uso.",
};

/** Recomendacao contextual do ecossistema — discreta e ligada ao tema. */
export const systemRecommendations: Record<
  string,
  { name: string; description: string; href: string }
> = {
  compasso: {
    name: "Compasso",
    description: "Gestão de demandas",
    href: "/tecnologia/compasso",
  },
  opus: {
    name: "Opus",
    description: "Gestão de projetos de PPP",
    href: "/tecnologia/opus",
  },
  prisma: {
    name: "Prisma",
    description: "Gestão de compras públicas",
    href: "/tecnologia/prisma",
  },
  atlas: {
    name: "Atlas",
    description: "Inteligência para gestão municipal",
    href: "/tecnologia/atlas",
  },
};
