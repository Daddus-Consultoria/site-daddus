import { NavigationType } from "@/lib/interfaces/navigation";
export const headerItems: NavigationType[] = [
  {
    title: "SERVIÇOS",
    subtypes: [
      {
        title: "Consultoria",
        href: "/conteudos/consultoria",
        items: [
          {
            title: "Elaboração de Políticas Públicas",
            href: "#",
          },
          {
            title: "Estudos de Viabilidade Econômico-Financeira",
            href: "#",
          },
          {
            title: "Modelagem de Projetos",
            href: "#",
          },
        ],
      },
      {
        title: "Desenvolvimento de sistemas",
        items: [
          {
            title: "Compasso",
            href: "#",
          },
        ],
      },
    ],
  },
  {
    title: "SETORES",
    subtypes: [
      {
        title: "Mobilidade Urbana",
        items: [
          {
            title: "Transportes",
            href: "#",
          },
          {
            title: "Rodovias",
            href: "#",
          },
          {
            title: "Portos",
            href: "#",
          },
        ],
      },
      {
        title: "Saúde",
        items: [
          {
            title: "Gestão Hospitalar",
            href: "#",
          },
        ],
      },
      {
        title: "Mobiliário Urbano",
        items: [
          {
            title: "RED's",
            href: "#",
          },
        ],
      },
    ],
  },
  {
    title: "CONTEÚDOS",
    subtypes: [
      {
        title: "Blog",
        href: "#",
        items: [],
      },
      {
        title: "Publicações",
        href: "/conteudos/publicacoes",
        items: [
          {
            title: "Estudos",
            href: "#",
          },
          {
            title: "Guias",
            href: "#",
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
    title: "SOBRE NÓS",
    href: "#",
  },
];

export enum PublishCategories {
  COUNTIES_SOCIAL_PROFILE = "Perfil Social dos Municípios",
  COUNTIES_ELECTORAL_PROFILE = "Perfil Eleitoral dos Municípios",
  COUNTIES_ECONOMIC_PROFILE = "Perfil Econômico dos Municípios",
}

export enum SizesConstants {
  MAX_WIDTH = 1200,
}
