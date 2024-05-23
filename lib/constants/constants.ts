import { NavigationType } from "@/lib/interfaces/navigation";
export const headerItems: NavigationType[] = [
  {
    title: "SERVIÇOS",
    subtypes: [
      {
        title: "Consultoria",
        href: "/servicos/consultoria",
        items: [
          {
            title: "Elaboração de Políticas Públicas",
            href: "/servicos/consultoria/elaboracao-politicas-publicas",
          },
          {
            title: "Estudos de Viabilidade Econômico-Financeira",
            href: "/servicos/consultoria/estudo-de-viabilidade",
          },
          {
            title: "Modelagem de Projetos",
            href: "/servicos/consultoria/modelagem-projetos",
          },
        ],
      },
      {
        title: "Desenvolvimento de sistemas",
        /*  items: [
          {
            title: "Compasso",
            href: "#",
          },
        ], */
      },
    ],
  },
  {
    title: "SETORES",
    subtypes: [
      {
        title: "Mobilidade Urbana",
        href: "/setores/mobilidade-urbana",
        items: [
          {
            title: "Transportes",
            href: "/setores/mobilidade-urbana/transportes",
          },
         /*  {
            title: "Rodovias",
            href: "/setores/mobilidade-urbana/rodovias",
          },
          {
            title: "Portos",
            href: "/setores/mobilidade-urbana/portos",
          }, */
        ],
      },
      /* {
        title: "Saúde",
        items: [
          {
            title: "Gestão Hospitalar",
            href: "#",
          },
        ],
      }, */
      /* {
        title: "Mobiliário Urbano",
        items: [
          {
            title: "RED's",
            href: "#",
          },
        ],
      }, */
    ],
  },
  {
    title: "CONTEÚDOS",
    subtypes: [
      {
        title: "Publicações",
        href: "/conteudos/publicacoes",
        items: [
          {
            title: "Estudos",
            href: "/conteudos/publicacoes/estudos",
          },
          {
            title: "Guias",
            href: "/conteudos/publicacoes/guias",
          },
          {
            title: "Perfis Municipais",
            href: "/conteudos/publicacoes/perfis-municipais",
          },
        ],
      },
    ],
  },
  {
    title: "BLOG",
    href: "/blog",
  },
  {
    title: "INSTITUCIONAL",
    subtypes:[
      {
        title: "Sobre nós",
        href: "/institucional/sobre",
      },
      {
        title: "Contato",
        href: "/institucional/contato",
      },
    ]
  }
];

export enum PublishCategories {
  COUNTIES_SOCIAL_PROFILE = "Perfil Social dos Municípios",
  COUNTIES_ELECTORAL_PROFILE = "Perfil Eleitoral dos Municípios",
  COUNTIES_ECONOMIC_PROFILE = "Perfil Econômico dos Municípios",
  GUIDES = "Guias",
  STUDIES = "Estudos",
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
