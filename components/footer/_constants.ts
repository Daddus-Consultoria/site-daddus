import { NavigationType } from "@/lib/interfaces/navigation";
const footerItens: NavigationType[] = [
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
        title: "Indicadores",
        items: [{ title: "IDH", href: "/conteudos/indicadores" }],
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
];

const constantFooter = {
  copyright: "© 2024 Daddus Consultoria - Todos os direitos reservados.",
  information: [
    {
      title: "SOBRE NÓS",
      href: "/institucional/sobre",
    },
    {
      title: "TERMOS DE USO",
      href: "/institucional/termos-de-uso",
    },
    {
      title: "CONTATO",
      href: "/institucional/contato",
    },
    {
      title: "BLOG",
      href: "/blog",
    },
  ],
};

export { constantFooter, footerItens };
