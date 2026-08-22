import { NavigationType } from "@/lib/interfaces/navigation";

/**
 * O rodape espelha o menu (`headerItems` em lib/constants/constants.ts): as
 * tres frentes primeiro, depois solucoes e institucional. Quando um item entrar
 * ou sair do menu, ele precisa entrar ou sair daqui tambem — o rodape e a
 * segunda chance de quem nao achou o caminho no topo.
 *
 * Todo item leva a uma rota que existe: link sem destino era o que fazia
 * "Desenvolvimento de sistemas" virar texto morto no rodape antigo.
 */
const footerItens: NavigationType[] = [
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
      { title: "Indicadores", href: "/conteudos/indicadores" },
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
          {
            title: "Elaboração de políticas públicas",
            href: "/servicos/consultoria/elaboracao-politicas-publicas",
          },
          {
            title: "Viabilidade econômico-financeira",
            href: "/servicos/consultoria/estudo-de-viabilidade",
          },
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
    subtypes: [{ title: "Para municípios", href: "/solucoes" }],
  },
  {
    title: "INSTITUCIONAL",
    subtypes: [
      { title: "Quem somos", href: "/institucional/sobre" },
      { title: "Fale com a Daddus", href: "/institucional/contato" },
    ],
  },
];

const constantFooter = {
  /** O ano vem do relogio no componente; aqui fica so o texto fixo. */
  copyright: "Daddus Consultoria — Todos os direitos reservados.",
  /**
   * A barra de baixo guarda so o juridico. Sobre nos, contato e blog saiam
   * repetidos aqui e nas colunas acima.
   */
  information: [
    { title: "TERMOS DE USO", href: "/institucional/termos-de-uso" },
    { title: "POLÍTICA DE PRIVACIDADE", href: "/politica-de-privacidade" },
  ],
};

export { constantFooter, footerItens };
