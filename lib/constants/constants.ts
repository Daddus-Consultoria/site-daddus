import { NavigationType } from "@/lib/interfaces/navigation";
/**
 * O menu separa as tres frentes da Daddus — conhecimento, consultoria e
 * tecnologia — porque e assim que a empresa quer ser lida: nao como uma
 * consultoria que tambem publica, e sim como uma organizacao que produz
 * conhecimento, presta consultoria e desenvolve sistemas proprios.
 *
 * A ordem e proposital: as tres frentes primeiro, depois as solucoes por
 * necessidade, e o institucional por ultimo — quem procura "quem somos" ou o
 * contato sabe olhar no fim do menu, enquanto o comeco fica para o que a
 * empresa produz. Quem somos e Fale com a Daddus vivem sob INSTITUCIONAL, e
 * nao mais em um item DADDUS separado.
 * Ver docs/DIRETRIZES-UX.md.
 */
export const headerItems: NavigationType[] = [
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
        title: "Biblioteca Daddus",
        href: "/biblioteca",
        items: [
          { title: "Teses e dissertações", href: "/biblioteca/teses" },
          { title: "Artigos científicos", href: "/biblioteca/artigos" },
          { title: "Relatórios e estudos", href: "/biblioteca/relatorios" },
        ],
      },
      {
        /**
         * Os submenus sao os grupos que a propria pagina renderiza, ancorados
         * pelo `id` que o `IndicatorsPanel` emite (`grupo-<categoria>`). Antes
         * havia "Mapas" e "Graficos" apontando para `?slug=maps` e
         * `?slug=graphics`: parametros do painel de planilhas, que a pagina
         * atual nao le — os dois itens caiam na mesma tela, identica.
         * CTA nomeia o destino (DIRETRIZES-UX secao 11), e um menu que promete
         * duas telas e entrega uma so quebra essa regra.
         */
        title: "Indicadores",
        href: "/conteudos/indicadores",
        items: [
          { title: "Índices de preços", href: "/conteudos/indicadores#grupo-precos" },
          { title: "Juros", href: "/conteudos/indicadores#grupo-juros" },
          { title: "Câmbio", href: "/conteudos/indicadores#grupo-cambio" },
          { title: "Atividade econômica", href: "/conteudos/indicadores#grupo-atividade" },
          { title: "Dívida pública", href: "/conteudos/indicadores#grupo-fiscal" },
          /**
           * A unica entrada que nao e ancora: as calculadoras sao telas
           * proprias, e a distincao importa — o painel publica o que a origem
           * divulgou, elas calculam em cima disso.
           */
          { title: "Calculadoras", href: "/conteudos/indicadores/calculadoras" },
        ],
      },
      { title: "Blog", href: "/blog" },
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
    title: "SOLUÇÕES",
    href: "/solucoes",
  },
  {
    title: "INSTITUCIONAL",
    subtypes: [
      { title: "Quem somos", href: "/institucional/sobre" },
      { title: "Fale com a Daddus", href: "/institucional/contato" },
    ],
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
