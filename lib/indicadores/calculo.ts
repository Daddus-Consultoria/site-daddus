/**
 * A matematica das calculadoras de Indicadores.
 *
 * Este arquivo e a unica excecao a regra da area: em todo o resto, o numero
 * exibido e um numero que a origem publicou (docs/INDICADORES.md). Aqui a
 * Daddus calcula — e por isso cada funcao devolve, junto do resultado, a
 * memoria do que aplicou. A tela mostra os dois: sem a memoria, o resultado
 * seria um numero sem procedencia, que e exatamente o que a area evita.
 *
 * Nao importa nada do banco nem do React: roda igual no servidor e num teste.
 */

/** Um mes da serie de um indice de preco, como a origem o publicou. */
export interface VariacaoMensal {
  /** Inicio do periodo de referencia, em ISO (AAAA-MM-01). */
  date: string;
  /** Variacao do mes, em porcentagem. */
  value: number;
}

/* -------------------------------------------------------------------------
 * Meses
 * ---------------------------------------------------------------------- */

/**
 * Mes de uma data ISO, como texto `AAAA-MM`.
 *
 * A comparacao entre meses e feita nessa string, e nao em `Date`: `AAAA-MM`
 * ordena lexicograficamente na mesma ordem em que ordena no calendario, e
 * `new Date` jogaria todo dia 1 para o mes anterior quando o runner roda em
 * UTC — o mesmo cuidado de `format.ts`.
 */
export const mesDe = (isoDate: string): string => isoDate.slice(0, 7);

/** Proximo mes de um `AAAA-MM`. */
export const mesSeguinte = (mes: string): string => {
  const ano = Number(mes.slice(0, 4));
  const numero = Number(mes.slice(5, 7));

  return numero === 12
    ? `${ano + 1}-01`
    : `${ano}-${String(numero + 1).padStart(2, "0")}`;
};

/** Todos os meses de `de` a `ate`, inclusive nas duas pontas. */
export const mesesEntre = (de: string, ate: string): string[] => {
  const meses: string[] = [];

  for (let mes = de; mes <= ate; mes = mesSeguinte(mes)) {
    meses.push(mes);
    // Guarda contra intervalo absurdo vindo da URL: 200 anos de meses seria
    // uma tabela de 2.400 linhas montada por um parametro de query.
    if (meses.length > 2400) break;
  }

  return meses;
};

/* -------------------------------------------------------------------------
 * Correcao por indice
 * ---------------------------------------------------------------------- */

/** Um mes aplicado na correcao, para a memoria de calculo. */
export interface MesAplicado {
  mes: string;
  /** Variacao publicada para o mes, em porcentagem. */
  variacao: number;
  /** Fator acumulado depois de aplicar este mes. */
  fatorAcumulado: number;
  /** Valor corrigido ate este mes. */
  valor: number;
}

export interface CorrecaoOk {
  ok: true;
  valorOriginal: number;
  valorCorrigido: number;
  /** Produto de (1 + variacao/100) dos meses aplicados. */
  fator: number;
  /** O mesmo fator escrito como variacao percentual acumulada. */
  variacaoAcumulada: number;
  meses: MesAplicado[];
  /** Base da correcao, como pedida. */
  de: string;
  /** Ultimo mes efetivamente aplicado — pode ser anterior ao pedido. */
  ate: string;
  /**
   * Preenchido quando o indice do mes pedido ainda nao foi publicado. A tela
   * precisa dizer isso: senao o resultado sai como se cobrisse o periodo todo.
   */
  atePedido: string | null;
}

export type CorrecaoErro =
  | { ok: false; motivo: "periodo-invertido" }
  | { ok: false; motivo: "serie-vazia" }
  | { ok: false; motivo: "antes-da-serie"; primeiroMes: string }
  | { ok: false; motivo: "depois-da-serie"; ultimoMes: string }
  | { ok: false; motivo: "mes-faltando"; mes: string };

export type CorrecaoResultado = CorrecaoOk | CorrecaoErro;

/**
 * Corrige um valor entre dois meses encadeando as variacoes publicadas.
 *
 * A conta e o produto de (1 + variacao/100) — a mesma forma como um indice de
 * preco se acumula, e nao a soma das variacoes: somar 10% e 10% daria 20%,
 * quando o acumulado e 21%.
 *
 * **Quais meses entram.** Os posteriores a `de`, ate `ate` inclusive. Corrigir
 * de jan a fev aplica a variacao de fevereiro, porque o valor de janeiro ja
 * esta na moeda de janeiro. Corrigir de um mes para ele mesmo devolve o proprio
 * valor, com fator 1 — nao e erro, e o caso de quem escolheu a mesma ponta.
 *
 * **Por que o produto sai em ponto flutuante** e o resto da area guarda
 * `NUMERIC`: o erro de um produto de algumas centenas de fatores fica na ordem
 * de 1e-13 relativo, muito abaixo do centavo que a tela exibe. O que nao pode
 * acontecer em float e a soma de valores que a origem publicou, e isso continua
 * valendo — aqui nenhum valor da origem e somado, so multiplicado uma vez cada.
 */
export const corrigirPorIndice = (
  valor: number,
  serie: VariacaoMensal[],
  de: string,
  ate: string
): CorrecaoResultado => {
  if (serie.length === 0) return { ok: false, motivo: "serie-vazia" };
  if (de > ate) return { ok: false, motivo: "periodo-invertido" };

  const porMes = new Map(serie.map((ponto) => [mesDe(ponto.date), ponto.value]));
  const primeiroMes = mesDe(serie[0].date);
  const ultimoMes = mesDe(serie[serie.length - 1].date);

  // A base pode ser o mes anterior ao primeiro publicado: corrigir de dez/1979
  // com uma serie que comeca em jan/1980 aplica janeiro, e esta correto.
  if (de < primeiroMes && mesSeguinte(de) < primeiroMes) {
    return { ok: false, motivo: "antes-da-serie", primeiroMes };
  }

  if (de > ultimoMes) return { ok: false, motivo: "depois-da-serie", ultimoMes };

  // O mes pedido ainda nao publicado nao invalida a conta: corrige-se ate o
  // ultimo que existe, e o resultado declara isso.
  const ateEfetivo = ate > ultimoMes ? ultimoMes : ate;
  const aplicar = de === ateEfetivo ? [] : mesesEntre(mesSeguinte(de), ateEfetivo);

  let fator = 1;
  const meses: MesAplicado[] = [];

  for (const mes of aplicar) {
    const variacao = porMes.get(mes);

    // Buraco no meio da serie: parar e dizer qual mes falta e mais honesto do
    // que pular o mes e devolver um acumulado que ninguem consegue conferir.
    if (variacao === undefined) return { ok: false, motivo: "mes-faltando", mes };

    fator *= 1 + variacao / 100;
    meses.push({ mes, variacao, fatorAcumulado: fator, valor: valor * fator });
  }

  return {
    ok: true,
    valorOriginal: valor,
    valorCorrigido: valor * fator,
    fator,
    variacaoAcumulada: (fator - 1) * 100,
    meses,
    de,
    ate: ateEfetivo,
    atePedido: ateEfetivo === ate ? null : ate,
  };
};

/* -------------------------------------------------------------------------
 * Juros compostos
 * ---------------------------------------------------------------------- */

export type BaseDaTaxa = "ano" | "mes";

/**
 * Taxa mensal equivalente a uma taxa informada ao ano.
 *
 * Equivalencia composta — a raiz duodecima —, e nao a divisao por doze: 12% ao
 * ano dividido por 12 da 1% ao mes, que capitalizado doze vezes volta 12,68%.
 * Os dois numeros descrevem coisas diferentes, e a taxa que o mercado cota ao
 * ano e a equivalente.
 */
export const taxaMensalEquivalente = (taxa: number, base: BaseDaTaxa): number =>
  base === "mes" ? taxa / 100 : (1 + taxa / 100) ** (1 / 12) - 1;

export interface AnoDoPlano {
  /** Ano corrido desde o inicio: 1 e o primeiro. */
  ano: number;
  /** Meses ja decorridos ao fim da linha — o ultimo ano pode ser parcial. */
  meses: number;
  aportado: number;
  saldo: number;
  juros: number;
}

export interface JurosResultado {
  valorFuturo: number;
  /** Capital inicial mais a soma dos aportes — sem juros. */
  totalAportado: number;
  juros: number;
  taxaMensal: number;
  /** A mesma taxa escrita ao ano, para conferir com a cotacao de mercado. */
  taxaAnual: number;
  meses: number;
  anos: AnoDoPlano[];
}

/**
 * Valor futuro de um capital com aporte mensal.
 *
 * Capitalizacao mensal e aporte no fim de cada mes (postecipado), que e a
 * convencao de quem deposita depois de receber. O primeiro aporte rende por
 * `meses - 1` meses, e nao por `meses`.
 *
 * A serie e percorrida mes a mes em vez de fechada pela formula do valor
 * futuro de anuidade porque a tabela por ano precisa do saldo em cada ponto —
 * e o laco de algumas centenas de iteracoes custa menos do que reavaliar a
 * formula em cada linha.
 */
export const jurosCompostos = (
  capital: number,
  aporte: number,
  taxa: number,
  base: BaseDaTaxa,
  meses: number
): JurosResultado => {
  const taxaMensal = taxaMensalEquivalente(taxa, base);

  let saldo = capital;
  let aportado = capital;
  const anos: AnoDoPlano[] = [];

  for (let mes = 1; mes <= meses; mes += 1) {
    saldo = saldo * (1 + taxaMensal) + aporte;
    aportado += aporte;

    // Fecha uma linha a cada dezembro do plano e no ultimo mes, para o prazo
    // quebrado (30 meses) nao perder o pedaco final.
    if (mes % 12 === 0 || mes === meses) {
      anos.push({
        ano: Math.ceil(mes / 12),
        meses: mes,
        aportado,
        saldo,
        juros: saldo - aportado,
      });
    }
  }

  return {
    valorFuturo: saldo,
    totalAportado: aportado,
    juros: saldo - aportado,
    taxaMensal,
    taxaAnual: ((1 + taxaMensal) ** 12 - 1) * 100,
    meses,
    anos,
  };
};
