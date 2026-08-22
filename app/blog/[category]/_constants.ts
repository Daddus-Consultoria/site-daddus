import { CardInfoProps } from "@/lib/interfaces/card";
import { Links } from "@/lib/constants/constants";


export const constantsPublicationsBlogFinancas: CardInfoProps[] = [
  {
    title: "ESTUDOS",
    description:
      "Análises técnicas sobre políticas públicas, economia e gestão, com metodologia e fontes descritas.",
    image: "/images/publications/publication1.svg",
    path: "/conteudos/publicacoes/estudos",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/estudos`,
        ctaLabel: "Ver estudos",
  },
  {
    title: "GUIAS",
    description:
      "Materiais de orientação prática para equipes municipais aplicarem na rotina da gestão.",
    image: "/images/publications/publications2.svg",
    path: "/conteudos/publicacoes/guias",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/guias`,
        ctaLabel: "Ver guias",
  },
  {
    title: "PERFIS MUNICIPAIS",
    description:
      "Retratos social, econômico e eleitoral de municípios, organizados a partir de bases públicas.",
    image: "/images/publications/publications3.svg",
    path: "/conteudos/publicacoes/perfis-municipais",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/perfis-municipais`,
        ctaLabel: "Ver perfis municipais",
  },
];

export const constantsFinancas = {
  title: "Economia", // Mudado de Finanças para Economia
  titlePublications: "PUBLICAÇÕES",
  cardsPublications: constantsPublicationsBlogFinancas,
};

interface SpecialCharactersWords {
  [key: string]: string;
}

export const SPECIAL_CHARACTERS_WORDS_BLOG: SpecialCharactersWords = {
  financas: "ECONOMIA", // Mudado de Finanças para Economia
  "politicas-publicas": "POLÍTICAS PÚBLICAS",
  governanca: "GOVERNANÇA",
  logistica: "MOBILIDADE", // Mudado de Logística para Mobilidade
  inovacao: "INOVAÇÃO",
  sustentabilidade: "SUSTENTABILIDADE",
  oportunidades: "OPORTUNIDADES",
};

export const CATEGORY_NAMES_BLOG: SpecialCharactersWords = {
  financas: "economia", // Mudado de Finanças para Economia
  "politicas-publicas": "politicasPublicas",
  governanca: "governanca",
  logistica: "mobilidade", // Mudado de Logística para Mobilidade
  inovacao: "inovacao",
  sustentabilidade: "sustentabilidade",
  oportunidades: "oportunidades",
};
