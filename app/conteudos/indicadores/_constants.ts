/**
 * Texto da pagina de Indicadores.
 *
 * Numero nenhum mora aqui: tudo o que a tela exibe sai do banco, coletado das
 * origens. O que fica neste arquivo e so o que explica e enquadra os dados —
 * ver docs/DIRETRIZES-UX.md secoes 6 e 8, e a regra de nao inventar numeros em
 * CLAUDE.md.
 *
 * O texto e curto de proposito. A pagina publica dezesseis series; paragrafo
 * de enquadramento empurra a primeira delas para fora da tela e faz o visitante
 * rolar por explicacao antes de chegar ao numero que veio buscar. O que precisa
 * ser dito uma vez esta dito uma vez, e o resto vive na pagina de cada serie.
 */

export const indicadoresPageContent = {
  eyebrow: "Conhecimento",
  title: "Indicadores",
  lead:
    "As séries que entram em contrato, reajuste e estudo de viabilidade — " +
    "lidas na instituição que apura cada uma.",

  /**
   * A pagina precisa dizer o que ela nao e. Quem chega buscando indicador
   * municipal precisa saber que ele ainda nao esta aqui, em vez de concluir que
   * o site nao tem.
   */
  escopo:
    "Cobertura nacional. Recortes municipais e estaduais entram na etapa seguinte.",

  /**
   * O cabecalho abre com os numeros do painel, no mesmo formato da Biblioteca:
   * dizem de que tamanho e o acervo antes da primeira rolagem.
   */
  stats: {
    series: "Séries",
    grupos: "Grupos",
    atualizado: "Lidas na origem em",
  },

  /**
   * As calculadoras sao a excecao a regra da area: ali a Daddus calcula. Por
   * isso vem antes do painel e com moldura propria — quem chega para corrigir
   * um valor nao deveria ter de passar por dezesseis cards para descobrir que
   * existe uma tela para isso. O texto avisa que o numero e conta da Daddus,
   * para ninguem levar resultado calculado como leitura de origem.
   */
  calculadoras: {
    title: "Calculadoras",
    text: "Contas da Daddus sobre estas mesmas séries, com a memória do cálculo à vista.",
    label: "Ver as calculadoras",
    href: "/conteudos/indicadores/calculadoras",
  },

  metodologia: {
    title: "De onde vêm estes números",
    text:
      "A Daddus não apura indicador: coleta a série na instituição que a produz e " +
      "republica sem recalcular. Os índices de preços vêm do Ipeadata, que declara o " +
      "produtor e a metodologia de cada série; as séries do Banco Central vêm do SGS.",
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
