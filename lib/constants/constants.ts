import { NavigationType } from "@/lib/interfaces/navigation";
/**
 * O menu separa as tres frentes da Daddus — conhecimento, consultoria e
 * tecnologia — porque e assim que a empresa quer ser lida: nao como uma
 * consultoria que tambem publica, e sim como uma organizacao que produz
 * conhecimento, presta consultoria e desenvolve sistemas proprios.
 * Ver docs/DIRETRIZES-UX.md.
 */
export const headerItems: NavigationType[] = [
  {
    title: "DADDUS",
    subtypes: [
      { title: "Quem somos", href: "/institucional/sobre" },
      { title: "Fale com a Daddus", href: "/institucional/contato" },
    ],
  },
  {
    title: "CONHECIMENTO",
    subtypes: [
      {
        title: "Publicações",
        href: "/conteudos/publicacoes",
        items: [
          { title: "Estudos", href: "/conteudos/publicacoes/estudos" },
          { title: "Guias", href: "/conteudos/publicacoes/guias" },
          { title: "Perfis municipais", href: "/conteudos/publicacoes/perfis-municipais" },
        ],
      },
      {
        title: "Indicadores",
        href: "/conteudos/indicadores",
        items: [
          { title: "Mapas", href: "/conteudos/indicadores?slug=maps" },
          { title: "Gráficos", href: "/conteudos/indicadores?slug=graphics" },
        ],
      },
      { title: "Insights", href: "/blog" },
    ],
  },
  {
    title: "CONSULTORIA",
    subtypes: [
      {
        title: "Áreas de atuação",
        href: "/servicos/consultoria",
        items: [
          { title: "Elaboração de políticas públicas", href: "/servicos/consultoria/elaboracao-politicas-publicas" },
          { title: "Viabilidade econômico-financeira", href: "/servicos/consultoria/estudo-de-viabilidade" },
          { title: "Modelagem de projetos", href: "/servicos/consultoria/modelagem-projetos" },
        ],
      },
      {
        title: "Setores",
        href: "/setores/mobilidade-urbana",
        items: [
          { title: "Mobilidade urbana", href: "/setores/mobilidade-urbana" },
          { title: "Transportes", href: "/setores/mobilidade-urbana/transportes" },
        ],
      },
    ],
  },
  {
    title: "TECNOLOGIA",
    subtypes: [
      {
        title: "Ecossistema Daddus",
        href: "/tecnologia",
        items: [
          { title: "Compasso", href: "/tecnologia/compasso" },
          { title: "Opus", href: "/tecnologia/opus" },
          { title: "Prisma", href: "/tecnologia/prisma" },
          { title: "Atlas", href: "/tecnologia/atlas" },
        ],
      },
    ],
  },
  {
    title: "CONTATO",
    href: "/institucional/contato",
  },
];

export enum PublishCategories {
  MUNICIPAL_PROFILE = "perfil-municipal",
  GUIDES = "guia",
  STUDIES = "estudo",
}

/** Rotulo de leitura de cada tipo de publicacao, no singular. */
export const publishCategoryLabels: Record<PublishCategories, string> = {
  [PublishCategories.STUDIES]: "Estudo",
  [PublishCategories.GUIDES]: "Guia",
  [PublishCategories.MUNICIPAL_PROFILE]: "Perfil municipal",
};

export const transformCategory = {
  'guia' : 'guias',
  'estudo' : 'estudos',
  'perfil-municipal' : 'perfis-municipais'
}

export enum PublishSubCategories {
  COUNTIES_SOCIAL_PROFILE = "Perfil Social dos Municípios",
  COUNTIES_ELECTORAL_PROFILE = "Perfil Eleitoral dos Municípios",
  COUNTIES_ECONOMIC_PROFILE = "Perfil Econômico dos Municípios",
}

export enum SizesConstants {
  MAX_WIDTH = 1200,
}

export enum TimeConstants {
  FIVE_MINUTES = 300000,
  TEN_MINUTES = 600000,
  ONE_HOUR = 3600000,
  ONE_DAY = 86400000,
}

export enum Links {
  SITE_DOMAIN = "https://www.daddusconsultoria.com",
}

export enum ImageLinks {
  BLOG_LOGO = "/images/blog/logo.svg",
}

export enum Breakpoints {
  MOBILE = 640,
  TABLET = 768,
  LAPTOP = 1024,
  DESKTOP = 1280,
}
