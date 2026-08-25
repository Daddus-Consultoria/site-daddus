/**
 * Texto da calculadora de juros compostos.
 *
 * E a unica das tres que nao depende do banco para calcular: a conta e
 * aritmetica sobre o que a pessoa digita. O painel entra so como referencia —
 * a Selic e o IPCA que aparecem como sugestao sao lidos na origem, e nao
 * escritos aqui, pela mesma regra de nao inventar numero.
 */

export const jurosContent = {
  eyebrow: "Calculadoras",
  title: "Juros compostos e aporte mensal",
  lead:
    "Projeta o valor futuro de um capital com aporte mensal, a uma taxa " +
    "informada, e mostra ano a ano quanto veio de aporte e quanto veio de juros.",

  metodo: {
    title: "O que a conta assume",
    paragraphs: [
      "Capitalização mensal e aporte no fim de cada mês. O primeiro aporte rende por " +
        "um mês a menos que o capital inicial, que é o que acontece quando se deposita " +
        "depois de receber.",
      "Taxa informada ao ano vira taxa mensal por equivalência composta — a raiz " +
        "duodécima —, e não por divisão: 12% ao ano equivalem a 0,9489% ao mês, e não " +
        "a 1%. É a convenção do mercado, e a diferença aparece no prazo longo.",
      "O resultado é nominal e sem impostos ou taxas. Ele diz quantos reais haverá, " +
        "não quanto eles comprarão: para o poder de compra, corrija o valor por um " +
        "índice de preços.",
    ],
  },

  form: {
    legend: "Capital, aporte, taxa e prazo",
    capital: {
      label: "Capital inicial",
      hint: "Pode ser zero, se o plano começa do zero.",
      placeholder: "10.000,00",
    },
    aporte: {
      label: "Aporte mensal",
      hint: "Pode ser zero, se há apenas a aplicação inicial.",
      placeholder: "500,00",
    },
    taxa: { label: "Taxa de juros", placeholder: "10,5" },
    base: {
      label: "Base da taxa",
      opcoes: { ano: "ao ano", mes: "ao mês" },
    },
    prazo: { label: "Prazo", placeholder: "10" },
    prazoUnidade: {
      label: "Unidade do prazo",
      opcoes: { anos: "anos", meses: "meses" },
    },
    submit: "Calcular",
    limpar: "Limpar",
  },

  referencia: {
    title: "Taxas de referência, lidas na origem",
    texto:
      "A Daddus não sugere taxa: os números abaixo são os últimos valores publicados " +
      "das séries do painel, para servirem de ponto de partida.",
    usar: "Usar esta taxa",
    /** `{data}` e trocado na tela. */
    lida: "referência de {data}",
  },

  vazio: "Preencha taxa e prazo para ver a projeção.",

  resultado: {
    title: "Resultado",
    /** `{prazo}` e `{taxa}` sao trocados na tela. */
    frase: "Em {prazo}, a {taxa}, o montante chega a:",
    aportado: "Total aportado",
    juros: "Juros acumulados",
    taxaMensal: "Taxa mensal equivalente",
    taxaAnual: "Taxa anual equivalente",
    /** `{meses}` e trocado na tela. */
    prazoEmMeses: "{meses} meses de capitalização",
  },

  tabela: {
    title: "Ano a ano",
    texto:
      "O saldo ao fim de cada ano do plano, separando o que foi aportado do que " +
      "veio de juros. O último ano pode ser parcial, quando o prazo não fecha em " +
      "doze meses.",
    colunas: {
      ano: "Ano",
      meses: "Meses",
      aportado: "Aportado",
      juros: "Juros",
      saldo: "Saldo",
    },
  },

  erros: {
    "taxa-invalida":
      "Informe a taxa em porcentagem — 10,5 para dez e meio por cento.",
    "prazo-invalido": "Informe o prazo em anos (até 50) ou em meses (até 600).",
    "valor-invalido": "Capital e aporte precisam ser zero ou um valor positivo.",
    "tudo-zero":
      "Com capital e aporte zerados não há o que capitalizar. Informe ao menos um dos dois.",
  },

  poderDeCompra: {
    texto:
      "Este montante está em reais de hoje somados a reais de amanhã. Para saber " +
      "quanto ele compraria, corrija um valor pelo IPCA no mesmo período.",
    label: "Abrir a calculadora de correção",
  },
} as const;
