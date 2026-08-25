/**
 * Texto do comparador de series.
 *
 * A tela nao calcula nada: poe duas ou tres series publicadas no mesmo eixo. O
 * texto daqui existe sobretudo para explicar a restricao — por que nem toda
 * combinacao e oferecida. Ver docs/INDICADORES.md.
 */
import type { IndicatorUnit } from "@/lib/indicadores/types";

export const comparadorContent = {
  eyebrow: "Calculadoras",
  title: "Comparador de séries",
  lead:
    "Põe duas ou três séries do painel no mesmo gráfico, no mesmo eixo e no " +
    "mesmo período, sem conversão de unidade nem reescala.",

  metodo: {
    title: "Por que só algumas combinações",
    paragraphs: [
      "A comparação é possível quando as séries estão na mesma unidade. IPCA e IGP-M " +
        "são variações mensais em porcentagem e cabem no mesmo eixo; a Selic ao ano e " +
        "a cotação do dólar em reais, não — o eixo teria de significar duas coisas ao " +
        "mesmo tempo.",
      "A saída usual para isso é reescalar tudo com base 100 na data inicial. Esta " +
        "tela não faz isso: o número no eixo passaria a ser um número que nenhuma " +
        "origem publicou, e a área inteira se sustenta em não publicar número " +
        "calculado sem dizer que é calculado. Restringir a unidade resolve o mesmo " +
        "problema sem inventar valor.",
      "As séries são desenhadas como cada origem as publica, com a redução de pontos " +
        "descrita na página de cada indicador. Nenhum valor é suavizado, convertido " +
        "ou recalculado.",
    ],
  },

  form: {
    legend: "Séries a comparar",
    instrucao:
      "Escolha duas ou três séries de um mesmo grupo. Grupos com uma série só não " +
      "aparecem, porque não há par para comparar.",
    submit: "Comparar séries",
    limpar: "Limpar",
  },

  erros: {
    poucas: "Escolha ao menos duas séries para comparar.",
    /** `{grupos}` e trocado na tela. */
    unidades:
      "As séries escolhidas estão em unidades diferentes ({grupos}) e não cabem no " +
      "mesmo eixo. Escolha séries de um mesmo grupo.",
    /** `{limite}` e trocado na tela. */
    demais:
      "A comparação usa no máximo {limite} séries — acima disso o gráfico deixa de " +
      "ser legível. As demais foram ignoradas.",
    "leitura-falhou":
      "Não foi possível ler as séries agora. Tente novamente em instantes.",
  },

  grafico: { title: "Comparação" },

  fichas: {
    title: "As séries comparadas",
    ultimo: "Último valor publicado",
    cobertura: "Período coberto",
    produtor: "Quem apura",
    verSerie: "Ver a série",
    baixar: "Baixar CSV",
  },
} as const;

/**
 * Nome do grupo de comparacao, que e a unidade.
 *
 * O rotulo diz o que a unidade significa, e nao so como ela se escreve: "% a.a."
 * sozinho nao explica que ali estao as taxas de juros, e e por esse sentido que
 * alguem procura o grupo.
 */
export const GRUPO_POR_UNIDADE: Partial<Record<IndicatorUnit, string>> = {
  percentual: "Variação no mês (%)",
  "percentual-ano": "Taxa ao ano (% a.a.)",
  "percentual-dia": "Taxa ao dia (% a.d.)",
  "percentual-pib": "Proporção do PIB (%)",
  indice: "Número índice",
  moeda: "Reais (R$)",
  "moeda-milhoes": "Reais em milhões",
};

/**
 * Selecao inicial: IPCA e IGP-M.
 *
 * Sao os dois indexadores que mais aparecem lado a lado em contrato — um de
 * tarifa e folha, outro de aluguel e concessao — e estao na mesma unidade. A
 * tela abre mostrando uma comparacao real em vez de um formulario vazio.
 */
export const SELECAO_PADRAO = ["ipca", "igp-m"];

/** Acima de tres linhas o grafico deixa de ser legivel. */
export const LIMITE_SERIES = 3;
