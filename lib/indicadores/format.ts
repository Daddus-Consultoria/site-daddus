/**
 * Formatacao dos indicadores.
 *
 * Fica separado das consultas porque roda tambem no cliente, e `queries.ts`
 * importa o pool do Postgres — que nao pode cruzar essa fronteira.
 *
 * Nenhuma funcao aqui converte valor: o banco guarda o numero como a origem
 * publicou, e o que muda e so como ele aparece. Ver docs/INDICADORES.md.
 */
import type { IndicatorFrequency, IndicatorUnit } from "./types";

const decimal = (casas: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });

/**
 * Casas decimais por unidade, seguindo como cada indicador e divulgado: o IPCA
 * sai com duas ("0,07%") e o dolar com quatro ("R$ 5,1512"). Arredondar o
 * cambio para dois esconderia justamente a variacao do dia.
 */
const CASAS_POR_UNIDADE: Record<IndicatorUnit, number> = {
  percentual: 2,
  "percentual-ano": 2,
  "percentual-dia": 4,
  "percentual-pib": 2,
  indice: 2,
  moeda: 4,
  "moeda-milhoes": 0,
};

const SUFIXO_POR_UNIDADE: Record<IndicatorUnit, string> = {
  percentual: "%",
  "percentual-ano": "% a.a.",
  "percentual-dia": "% a.d.",
  "percentual-pib": "% do PIB",
  indice: "",
  moeda: "",
  "moeda-milhoes": " mi",
};

/**
 * `decimals` sobrepoe o padrao da unidade quando o indicador e divulgado com
 * outra precisao — a rentabilidade da poupanca sai com quatro casas (0,6446%),
 * e exibi-la com duas publicaria um numero que a origem nao publicou.
 */
export const formatIndicatorValue = (
  value: number,
  unit: IndicatorUnit,
  decimals?: number | null
): string => {
  const casas = decimals ?? CASAS_POR_UNIDADE[unit] ?? 2;
  const numero = decimal(casas).format(value);
  const prefixo = unit === "moeda" || unit === "moeda-milhoes" ? "R$ " : "";

  return `${prefixo}${numero}${SUFIXO_POR_UNIDADE[unit] ?? ""}`;
};

const MESES = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

/**
 * Rotulo do periodo de referencia — nao da data da coleta. A distincao importa:
 * o IPCA de julho e publicado em agosto, e mostrar a data de coleta faria o
 * numero parecer de outro mes.
 *
 * A data chega em ISO e e fatiada como texto, sem passar por `new Date`: o
 * runner roda em UTC e a conversao jogaria todo dia 1 para o mes anterior.
 */
export const formatReferencePeriod = (
  isoDate: string,
  frequency: IndicatorFrequency
): string => {
  const [ano, mes, dia] = isoDate.slice(0, 10).split("-");

  if (frequency === "mensal") {
    return `${MESES[Number(mes) - 1]}/${ano}`;
  }

  return `${dia}/${mes}/${ano}`;
};

/** Data de atualizacao, para o rodape da pagina. */
export const formatUpdatedAt = (iso: string | null): string | null => {
  if (!iso) return null;

  const [ano, mes, dia] = iso.slice(0, 10).split("-");

  return `${dia}/${mes}/${ano}`;
};

export const indicatorCategoryLabels: Record<string, string> = {
  precos: "Índices de preços",
  juros: "Juros",
  cambio: "Câmbio",
  atividade: "Atividade econômica",
  fiscal: "Dívida pública",
};

/**
 * O que cada grupo serve para decidir. A `docs/DIRETRIZES-UX.md` secao 6 pede
 * contexto, nunca numero isolado — e o contexto do grupo evita repetir a mesma
 * explicacao em cada card.
 */
export const indicatorCategoryContext: Record<string, string> = {
  precos:
    "Indexadores de contrato, reajuste e correção de valores. IGP-M e INCC aparecem em concessão e obra; IPCA e INPC, em tarifa e folha.",
  juros:
    "Custo do dinheiro no tempo — a referência para taxa de desconto em estudo de viabilidade e modelagem econômico-financeira.",
  cambio: "Referência para contrato com componente importado ou dívida externa.",
  atividade:
    "Ritmo da economia antes do resultado trimestral do IBGE, útil para projeção de arrecadação.",
  fiscal: "Espaço fiscal do setor público consolidado.",
};
