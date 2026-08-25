/**
 * Texto da pagina de Indicadores.
 *
 * Numero nenhum mora aqui: tudo o que a tela exibe sai do banco, coletado das
 * origens. O que fica neste arquivo e so o que explica e enquadra os dados —
 * ver docs/DIRETRIZES-UX.md secoes 6 e 8, e a regra de nao inventar numeros em
 * CLAUDE.md.
 */

export const indicadoresPageContent = {
  eyebrow: "Conhecimento",
  title: "Indicadores",
  lead:
    "Séries econômicas que entram em contrato, reajuste e estudo de viabilidade — " +
    "atualizadas direto na fonte, com o período de referência e quem apura cada uma.",

  /**
   * A pagina precisa dizer o que ela nao e. Quem chega buscando indicador
   * municipal precisa saber que ele ainda nao esta aqui, em vez de concluir que
   * o site nao tem.
   */
  escopo:
    "Por ora o painel cobre índices de preços, juros, câmbio, atividade e dívida " +
    "pública em âmbito nacional. Recortes municipais e estaduais entram na etapa seguinte.",

  /**
   * As calculadoras sao a excecao a frase acima: ali a Daddus calcula. O convite
   * precisa dizer isso, para o visitante nao levar um numero calculado como se
   * fosse leitura de origem.
   */
  calculadoras: {
    title: "Calculadoras",
    text:
      "Correção de valores por índice, juros compostos com aporte mensal e comparação " +
      "entre séries. São contas da Daddus sobre estas mesmas séries, e cada uma mostra " +
      "a memória do que aplicou.",
    label: "Ver as calculadoras",
    href: "/conteudos/indicadores/calculadoras",
  },

  metodologia: {
    title: "Como estes números chegam aqui",
    paragraphs: [
      "A Daddus não apura indicador: coleta a série na instituição que a produz e a " +
        "republica com a procedência preservada. Cada card mostra quem apura, qual o " +
        "período de referência do valor e quando a série foi lida pela última vez.",
      "Os índices de preços vêm do Ipeadata, que declara o produtor e a metodologia de " +
        "cada série. As séries do Banco Central vêm do SGS, o sistema de séries " +
        "temporais da própria instituição. Nenhum valor é recalculado no caminho.",
    ],
  },

  /** CTA nomeia o destino, nunca "veja mais" — DIRETRIZES-UX secao 11. */
  cta: {
    title: "Precisa desses dados dentro de um estudo?",
    text:
      "A leitura de indicador vira insumo de modelagem econômico-financeira, " +
      "projeção de arrecadação e reajuste contratual nos trabalhos da Daddus.",
    label: "Falar com a equipe",
    href: "/institucional/contato",
  },
} as const;
