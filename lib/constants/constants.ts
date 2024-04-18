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
            href: "/setores/mobilidade-urbana/transportes",
          },
          {
            title: "Rodovias",
            href: "/setores/mobilidade-urbana/rodovias",
          },
          {
            title: "Portos",
            href: "/setores/mobilidade-urbana/portos",
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
    title: "SOBRE NÓS",
    href: "/informacoes/sobre",
  },
  
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
