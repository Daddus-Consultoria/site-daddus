/**
 * Rotulos de eixo dos graficos de indicador.
 *
 * Separado de `format.ts` porque serve a um proposito diferente: `format.ts`
 * escreve o numero como a origem o publica ("R$ 5,1512", "0,07%"), que e o que
 * o card e o tooltip mostram. Um eixo com essa string repetida cinco vezes fica
 * ilegivel — aqui o numero e encurtado, e a unidade sai uma vez so no titulo do
 * eixo.
 */
import type { IndicatorFrequency, IndicatorUnit } from "./types";

/** Unidade escrita por extenso, para o rotulo do eixo Y. */
export const unitAxisLabel: Record<IndicatorUnit, string> = {
  percentual: "%",
  "percentual-ano": "% a.a.",
  "percentual-dia": "% a.d.",
  "percentual-pib": "% do PIB",
  indice: "índice",
  moeda: "R$",
  "moeda-milhoes": "R$ milhões",
};

/**
 * Casas decimais do eixo inteiro, deduzidas do passo entre as marcas.
 *
 * E uma decisao do eixo, e nao de cada marca: decidindo por marca, um eixo que
 * vai de 0 a 60 sairia com "0,00" ao lado de "20,0" — a mesma coluna com duas
 * precisoes, que se le como se os numeros tivessem exatidoes diferentes.
 *
 * O passo e quem manda porque e ele que define o que o eixo precisa distinguir:
 * marcas de 0,25 em 0,25 exigem duas casas; de 10 em 10 nao exigem nenhuma.
 */
export const axisDecimals = (marcas: number[]): number => {
  if (marcas.length < 2) {
    const unica = Math.abs(marcas[0] ?? 0);
    return unica >= 100 ? 0 : unica >= 10 ? 1 : 2;
  }

  const passo = Math.abs(marcas[1] - marcas[0]);
  if (passo >= 10) return 0;
  if (passo >= 1) return passo % 1 === 0 ? 0 : 1;
  if (passo >= 0.1) return 1;
  if (passo >= 0.01) return 2;

  return 3;
};

/**
 * Numero curto do eixo. Sem prefixo e sem sufixo: os dois vao no rotulo do
 * eixo, e repeti-los em cada marca so rouba largura do grafico.
 */
export const formatAxisNumber = (valor: number, casas = 2): string => {
  // Divida bruta em milhoes chega a sete digitos; sem isto o eixo fica com
  // "8.234.567" em cada marca.
  if (Math.abs(valor) >= 1_000_000) {
    return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(valor / 1_000_000)} mi`;
  }

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(valor);
};

/**
 * Marcas "redondas" cobrindo a serie.
 *
 * Passo em 1, 2, 5 ou 10 vezes uma potencia de dez — os valores que uma pessoa
 * le sem precisar pensar. Um passo cru (amplitude/5) produziria marcas como
 * "3,47" e "6,94", que atrapalham em vez de orientar.
 */
export const niceTicks = (min: number, max: number, alvo = 5): number[] => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [];
  // Serie constante — a Selic fica meses na mesma taxa. Uma marca so, no valor.
  if (min === max) return [min];

  const bruto = (max - min) / Math.max(1, alvo);
  const magnitude = 10 ** Math.floor(Math.log10(bruto));
  const normalizado = bruto / magnitude;
  const passo =
    (normalizado <= 1 ? 1 : normalizado <= 2 ? 2 : normalizado <= 5 ? 5 : 10) *
    magnitude;

  const marcas: number[] = [];
  const inicio = Math.ceil(min / passo) * passo;

  for (let v = inicio; v <= max + passo / 1000; v += passo) {
    // A soma acumula erro binario (0,1 + 0,2 = 0,30000000000000004) e o rotulo
    // sairia com lixo na decima casa; o arredondamento devolve a marca exata.
    marcas.push(Number(v.toFixed(10)));
  }

  return marcas;
};

const MESES_CURTOS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

/**
 * Rotulo de data do eixo X, na precisao que o periodo comporta.
 *
 * Uma serie de quarenta anos com "28/11/1984" em cada marca fica ilegivel e
 * repete um detalhe que nao ajuda a ler a curva; ali o ano basta. A data e
 * fatiada como texto, sem `new Date`, pelo mesmo motivo de `format.ts`: o
 * runner roda em UTC e a conversao jogaria todo dia 1 para o mes anterior.
 */
export const formatAxisDate = (
  isoDate: string,
  frequency: IndicatorFrequency,
  spanEmDias: number
): string => {
  const [ano, mes, dia] = isoDate.slice(0, 10).split("-");

  if (spanEmDias > 365 * 4) return ano;
  if (spanEmDias > 400 || frequency === "mensal") {
    return `${MESES_CURTOS[Number(mes) - 1]}/${ano.slice(2)}`;
  }

  return `${dia}/${mes}`;
};

/** Distancia em dias entre duas datas ISO, sem passar por fuso horario. */
export const diasEntre = (deIso: string, ateIso: string): number => {
  const dia = 24 * 60 * 60 * 1000;
  const ms = (iso: string) => Date.parse(`${iso.slice(0, 10)}T00:00:00Z`);

  return Math.round((ms(ateIso) - ms(deIso)) / dia);
};
