import { CardBlogProps } from "@/lib/interfaces/card";
import { CardInfoProps } from "@/lib/interfaces/card";
import { Links } from "@/lib/constants/constants";

const cardsPostBlog: CardBlogProps[] = [
  {
    title: "Citolologia: um estudo demográfico de  duas ou três linhas ",
    badgeTitle: "MERCADOS",
    first: true,
    image: {
      src: "/images/blog/tremStation.svg",
      alt: "Imagem de um trem",
    },
  },
  {
    title: "Citolologia: um estudo demográfico de  duas ou três linhas ",
    badgeTitle: "MERCADOS",
    first: false,
    image: {
      src: "/images/blog/maria.svg",
      alt: "Imagem de uma mulher",
    },
  },
  {
    title: "Citolologia: um estudo demográfico de  duas ou três linhas ",
    badgeTitle: "MERCADOS",
    first: false,
    image: {
      src: "/images/blog/bike.svg",
      alt: "Imagem de uma bicicleta",
    },
  },
  {
    title: "Citolologia: um estudo demográfico de  duas ou três linhas ",
    badgeTitle: "MERCADOS",
    first: true,
    image: {
      src: "/images/blog/tremStation.svg",
      alt: "Imagem de um trem",
    },
  },
  {
    title: "Citolologia: um estudo demográfico de  duas ou três linhas ",
    badgeTitle: "MERCADOS",
    first: false,
    image: {
      src: "/images/blog/maria.svg",
      alt: "Imagem de uma mulher",
    },
  },
  {
    title: "Citolologia: um estudo demográfico de  duas ou três linhas ",
    badgeTitle: "MERCADOS",
    first: false,
    image: {
      src: "/images/blog/bike.svg",
      alt: "Imagem de uma bicicleta",
    },
  },
  {
    title: "Citolologia: um estudo demográfico de  duas ou três linhas ",
    badgeTitle: "MERCADOS",
    first: true,
    image: {
      src: "/images/blog/tremStation.svg",
      alt: "Imagem de um trem",
    },
  },
  {
    title: "Citolologia: um estudo demográfico de  duas ou três linhas ",
    badgeTitle: "MERCADOS",
    first: false,
    image: {
      src: "/images/blog/maria.svg",
      alt: "Imagem de uma mulher",
    },
  },
  {
    title: "Citolologia: um estudo demográfico de  duas ou três linhas ",
    badgeTitle: "MERCADOS",
    first: false,
    image: {
      src: "/images/blog/bike.svg",
      alt: "Imagem de uma bicicleta",
    },
  },
];

<<<<<<< HEAD
export const constantsPublicationsBlogFinancas:CardInfoProps[] = [
=======
export const constantsPublicationsBlogFinancas: CardInfoProps[] = [
>>>>>>> develop
  {
    title: "ESTUDOS",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publication1.svg",
    path: "/conteudos/publicacoes/estudos",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/estudos`,
  },
  {
    title: "GUIAS",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publications2.svg",
    path: "/conteudos/publicacoes/guias",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/guias`,
  },
  {
    title: "PERFIS MUNICIPAIS",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publications3.svg",
    path: "/conteudos/publicacoes/perfis-municipais",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/perfis-municipais`,
  },
];
<<<<<<< HEAD
  
=======
>>>>>>> develop

export const constantsFinancas = {
  title: "Finanças",
  cards: cardsPostBlog,
  titlePublications: "PUBLICAÇÕES",
  cardsPublications: constantsPublicationsBlogFinancas,
};

interface SpecialCharactersWords {
  [key: string]: string;
}

export const SPECIAL_CHARACTERS_WORDS_BLOG: SpecialCharactersWords = {
  financas: "FINANÇAS",
  "politicas-publicas": "POLÍTICAS PÚBLICAS",
  governanca: "GOVERNANÇA",
  logistica: "LOGÍSTICA",
  inovacao: "INOVAÇÃO",
  sustentabilidade: "SUSTENTABILIDADE",
  oportunidades: "OPORTUNIDADES",
};

export const CATEGORY_NAMES_BLOG: SpecialCharactersWords = {
  financas: "financas",
  "politicas-publicas": "politicasPublicas",
  governanca: "governanca",
  logistica: "logistica",
  inovacao: "inovacao",
  sustentabilidade: "sustentabilidade",
  oportunidades: "oportunidades",
};
