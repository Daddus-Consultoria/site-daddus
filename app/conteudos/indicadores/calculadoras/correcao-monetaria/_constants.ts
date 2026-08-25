/**
 * Texto da calculadora de correcao por indice.
 *
 * Ao contrario das outras telas de Indicadores, esta publica um numero que a
 * Daddus calculou — e o texto daqui existe para deixar claro onde termina o
 * dado da origem e onde comeca a conta nossa. Ver docs/INDICADORES.md e
 * docs/DIRETRIZES-UX.md secao 8.
 */

export const correcaoContent = {
  eyebrow: "Calculadoras",
  title: "Correção de valores por índice",
  lead:
    "Atualiza um valor entre dois meses encadeando as variações publicadas do " +
    "índice escolhido — IPCA, IGP-M, INCC-DI, INPC e os demais índices de preços " +
    "do painel.",

  metodo: {
    title: "Quem calcula o quê",
    paragraphs: [
      "As variações mensais são de quem apura o índice: o IBGE no caso do IPCA e do " +
        "INPC, a FGV no caso do IGP-M, do IGP-DI e do INCC-DI. A Daddus não altera " +
        "nenhuma delas — cada uma é lida na origem e guardada como veio.",
      "O encadeamento é conta da Daddus, e é a forma como um índice de preços se " +
        "acumula: multiplicam-se os fatores mensais (1 + variação ÷ 100). Somar as " +
        "variações daria outro número — 10% e 10% acumulam 21%, não 20%.",
      "O resultado não é um valor oficial de reajuste. Contrato costuma definir " +
        "índice, mês-base, periodicidade e regra de aniversário; esta tela aplica o " +
        "que estiver nos campos abaixo, e nada além disso.",
    ],
  },

  form: {
    legend: "Valor, índice e período",
    valor: {
      label: "Valor a corrigir",
      /** A ambiguidade do ponto e resolvida no `lerValor`, e conferida na tela. */
      hint: "Aceita 1.500,00 ou 1500. O valor lido aparece no resultado.",
      placeholder: "1.000,00",
    },
    indice: { label: "Índice" },
    de: { label: "Valor de", hint: "O mês em que o valor está expresso." },
    ate: { label: "Corrigir para", hint: "O mês para o qual atualizar." },
    mes: "Mês",
    ano: "Ano",
    submit: "Corrigir valor",
    limpar: "Limpar",
  },

  vazio:
    "Preencha o valor e o período para ver o resultado com a memória de cálculo.",

  resultado: {
    title: "Resultado",
    /** `{valorOriginal}`, `{de}`, `{indice}`, `{produtor}` e `{ate}` sao trocados na tela. */
    frase:
      "{valorOriginal} em {de}, corrigido pelo {indice} ({produtor}) até {ate}, " +
      "equivale a:",
    variacao: "Variação acumulada no período",
    fator: "Fator de correção",
    meses: "Meses aplicados",
    mesmoMes:
      "As duas pontas são o mesmo mês: não há variação a aplicar, e o valor " +
      "permanece o que foi informado.",
    /** `{pedido}` e `{ultimo}` sao trocados na tela. */
    incompleto:
      "O índice de {pedido} ainda não foi publicado. A correção vai até {ultimo}, " +
      "o último mês divulgado pela origem.",
  },

  memoria: {
    title: "Memória de cálculo",
    texto:
      "Cada linha é um mês publicado pela origem, na ordem em que entrou no " +
      "encadeamento. O fator acumulado é o produto dos fatores até ali.",
    colunas: {
      mes: "Mês",
      variacao: "Variação no mês",
      fator: "Fator acumulado",
      valor: "Valor corrigido",
    },
  },

  erros: {
    "periodo-invertido":
      "O mês final é anterior ao inicial. Inverta as duas pontas para corrigir " +
      "um valor no tempo.",
    "serie-vazia":
      "A série deste índice ainda não foi coletada. Escolha outro índice ou tente " +
      "novamente mais tarde.",
    /** `{primeiro}` e `{ultimo}` sao trocados na tela. */
    "antes-da-serie":
      "A série deste índice começa em {primeiro}, e não alcança o mês informado. " +
      "Índices com histórico mais longo cobrem períodos anteriores.",
    "depois-da-serie":
      "O mês de partida é posterior ao último publicado ({ultimo}).",
    "mes-faltando":
      "Falta o índice de {mes} na série guardada, e sem ele o acumulado não " +
      "fecha. A coleta da próxima madrugada deve completar a série.",
    "indice-invalido": "Escolha um dos índices da lista.",
    "valor-invalido": "Informe um valor maior que zero.",
    "leitura-falhou":
      "Não foi possível ler as séries agora. Tente novamente em instantes.",
  },

  serie: {
    /** `{indice}` e trocado na tela. */
    texto:
      "Todas as variações usadas aqui estão na página do índice, com a " +
      "procedência e o download da série completa.",
    label: "Ver a série do {indice}",
  },

  cta: {
    title: "Precisa desta correção dentro de um estudo?",
    text:
      "Reajuste contratual, recomposição de valores e projeção de custo entram nos " +
      "trabalhos de modelagem econômico-financeira da Daddus.",
    label: "Falar com a equipe",
    href: "/institucional/contato",
  },
} as const;
