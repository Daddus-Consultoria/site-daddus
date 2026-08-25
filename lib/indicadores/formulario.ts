/**
 * Leitura e escrita dos campos das calculadoras.
 *
 * As calculadoras guardam o estado na URL (`?indice=&valor=&de=&ate=`), como o
 * acervo e a Biblioteca: o resultado precisa poder ser recarregado, compartilhado
 * e citado num parecer. Isso significa que todo campo chega como texto vindo de
 * fora, e este arquivo e a fronteira que o transforma em numero — sempre com a
 * possibilidade de recusar.
 *
 * A formatacao mora aqui, e nao em `format.ts`, porque o proposito e outro:
 * `format.ts` escreve o numero como a **origem** o publicou; estes escrevem o
 * numero que a **Daddus** calculou.
 */

/** Real com centavos — o resultado de uma correcao e sempre dinheiro. */
const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatMoeda = (valor: number): string => moeda.format(valor);

export const formatNumero = (valor: number, casas: number): string =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(valor);

/**
 * Percentual calculado pela Daddus.
 *
 * Duas casas por padrao, como o mercado cota. O sinal explicito importa: uma
 * variacao acumulada negativa (deflacao no periodo) precisa se distinguir de um
 * numero pequeno, e "−0,42%" nao se confunde com "0,42%".
 */
export const formatPercentual = (valor: number, casas = 2): string =>
  `${formatNumero(valor, casas)}%`;

const MESES = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

/** `2024-07` vira `jul/2024`. Fatiado como texto, sem `new Date` — ver format.ts. */
export const formatMes = (mes: string): string =>
  `${MESES[Number(mes.slice(5, 7)) - 1] ?? "?"}/${mes.slice(0, 4)}`;

/** Nome do mes por extenso, para os rotulos do formulario. */
export const MESES_LONGOS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

/* -------------------------------------------------------------------------
 * Leitura
 * ---------------------------------------------------------------------- */

/**
 * Le um valor em dinheiro digitado a mao.
 *
 * O campo aceita o que a pessoa escreveria num documento — `1.500,00`, `1500`,
 * `R$ 1.500` —, e por isso o ponto e ambiguo: em `1.500` ele separa milhar e em
 * `1.5` ele separa decimal. A regra aplicada:
 *
 * - havendo virgula, ela e a decimal e todo ponto e separador de milhar;
 * - sem virgula, um ponto seguido de exatamente tres digitos e milhar
 *   (`1.500` = mil e quinhentos, a leitura brasileira);
 * - qualquer outro ponto e decimal (`1.5`, `1.5075`).
 *
 * A ambiguidade nao se resolve so com a regra: a tela **repete o valor lido**
 * ja formatado no resultado, para quem digitou conferir que o sistema entendeu
 * o que ele quis dizer.
 */
export const lerValor = (entrada: string | undefined): number | null => {
  if (!entrada) return null;

  const limpo = entrada.replace(/[R$\s ]/g, "");
  if (!limpo || !/^[\d.,]+$/.test(limpo)) return null;

  const normalizado = limpo.includes(",")
    ? limpo.replace(/\./g, "").replace(",", ".")
    : limpo.replace(/\.(?=\d{3}(?:\D|$))/g, "");

  const numero = Number(normalizado);

  // Valor negativo ou zero nao corrige nem rende nada: o resultado seria uma
  // tela de zeros, mais confusa do que o formulario em branco.
  return Number.isFinite(numero) && numero > 0 ? numero : null;
};

/**
 * Le um valor que pode ser zero.
 *
 * Serve ao capital inicial e ao aporte da calculadora de juros: um plano que
 * comeca do zero e so aporta, ou que aplica uma vez e nao aporta mais, sao os
 * dois casos comuns — e em cada um deles um dos campos e legitimamente zero.
 */
export const lerValorOuZero = (entrada: string | undefined): number | null => {
  if (entrada !== undefined && /^0([.,]0+)?$/.test(entrada.trim())) return 0;

  return lerValor(entrada);
};

/** Le uma taxa, que ao contrario do valor pode ser zero (e negativa faz sentido). */
export const lerTaxa = (entrada: string | undefined): number | null => {
  if (!entrada) return null;

  const limpo = entrada.replace(/[%\s ]/g, "").replace(",", ".");
  if (!limpo || !/^-?\d*\.?\d+$/.test(limpo)) return null;

  const numero = Number(limpo);

  return Number.isFinite(numero) && numero > -100 && numero < 1000
    ? numero
    : null;
};

/** Le um inteiro dentro de um intervalo, recusando o que estiver fora. */
export const lerInteiro = (
  entrada: string | undefined,
  minimo: number,
  maximo: number
): number | null => {
  if (!entrada || !/^\d+$/.test(entrada)) return null;

  const numero = Number(entrada);

  return numero >= minimo && numero <= maximo ? numero : null;
};

/** Le um mes `AAAA-MM` vindo da URL, recusando o que nao for calendario. */
export const lerMes = (entrada: string | undefined): string | null => {
  if (!entrada || !/^\d{4}-\d{2}$/.test(entrada)) return null;

  const mes = Number(entrada.slice(5, 7));
  const ano = Number(entrada.slice(0, 4));

  return mes >= 1 && mes <= 12 && ano >= 1900 && ano <= 2999 ? entrada : null;
};

/** Um parametro que pode chegar repetido na URL — fica com a primeira ocorrencia. */
export const primeiro = (valor: string | string[] | undefined) =>
  Array.isArray(valor) ? valor[0] : valor;
