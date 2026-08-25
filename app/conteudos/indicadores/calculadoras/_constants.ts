/**
 * As calculadoras de Indicadores.
 *
 * A lista e a fonte unica: alimenta o indice da area, os atalhos no rodape de
 * cada calculadora, o menu e o sitemap. Criar uma quarta calculadora significa
 * acrescentar uma linha aqui — e nao lembrar de quatro arquivos.
 */

export interface Calculadora {
  slug: string;
  title: string;
  /** Frase curta do card — diz o que a calculadora responde. */
  resumo: string;
  /** O que ela usa como insumo, para separar as que leem o banco das que nao leem. */
  insumo: string;
}

export const calculadoras: Calculadora[] = [
  {
    slug: "correcao-monetaria",
    title: "Correção de valores por índice",
    resumo:
      "Atualiza um valor entre dois meses encadeando as variações publicadas do índice escolhido.",
    insumo: "Usa as séries de IPCA, IGP-M, INCC-DI, INPC e demais índices de preços do painel.",
  },
  {
    slug: "juros-compostos",
    title: "Juros compostos e aporte mensal",
    resumo:
      "Projeta o valor futuro de um capital com aporte mensal, a uma taxa informada.",
    insumo: "Aritmética; a Selic e o IPCA do painel entram como taxa de referência.",
  },
  {
    slug: "comparador",
    title: "Comparador de séries",
    resumo:
      "Põe duas ou três séries de mesma unidade no mesmo gráfico e no mesmo eixo.",
    insumo: "Usa as séries do painel, sem conversão nem rebase.",
  },
];

export const BASE_CALCULADORAS = "/conteudos/indicadores/calculadoras";

export const calculadoraPor = (slug: string) =>
  calculadoras.find((item) => item.slug === slug);

export const calculadorasContent = {
  eyebrow: "Conhecimento",
  title: "Calculadoras",
  lead:
    "Contas que a Daddus faz sobre as séries que republica — correção por índice, " +
    "juros no tempo e comparação entre indicadores.",

  metodo: {
    title: "O que muda em relação ao painel",
    paragraphs: [
      "No painel de indicadores todo número exibido é um número que a origem publicou. " +
        "Aqui não: o resultado é calculado pela Daddus a partir desses valores.",
      "Por isso cada calculadora mostra a memória do que aplicou — quais períodos " +
        "entraram, em que ordem e com que fator. Um resultado que não dá para " +
        "conferir não serve para entrar em estudo, parecer ou contrato.",
    ],
  },

  /** Atalho no rodape das calculadoras. */
  outras: "Outras calculadoras",

  cta: {
    title: "Precisa dessas contas dentro de um estudo?",
    text:
      "Reajuste contratual, custo de capital e projeção de arrecadação entram nos " +
      "trabalhos de modelagem econômico-financeira da Daddus.",
    label: "Falar com a equipe",
    href: "/institucional/contato",
  },
} as const;
