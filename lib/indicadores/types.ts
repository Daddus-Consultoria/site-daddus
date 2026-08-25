/**
 * Tipos da area de Indicadores.
 *
 * Um indicador e uma serie temporal com procedencia: quem apura, com que
 * periodicidade e onde esta a metodologia. A `docs/DIRETRIZES-UX.md` secao 8
 * exige que isso apareca na tela, entao acompanha o dado desde a coleta em vez
 * de ser preenchido na interface.
 */

/** Periodicidade da serie — governa tambem o ritmo da coleta. */
export type IndicatorFrequency = "diaria" | "mensal";

export type IndicatorCategory =
  | "precos"
  | "juros"
  | "cambio"
  | "atividade"
  | "fiscal";

/**
 * Unidade do numero publicado. Nao ha conversao: o banco guarda o valor como a
 * origem o divulgou, e isto diz apenas como formata-lo.
 */
export type IndicatorUnit =
  | "percentual"
  | "percentual-ano"
  | "percentual-dia"
  | "percentual-pib"
  | "indice"
  | "moeda"
  | "moeda-milhoes";

/** Um ponto da serie, ja normalizado. */
export interface IndicatorPoint {
  /** Inicio do periodo de referencia, em ISO (AAAA-MM-DD). */
  referenceDate: string;
  /** Fim do periodo, quando a origem o informa. */
  referenceEnd?: string | null;
  value: number;
}

/**
 * Metadados que a origem declara sobre a serie. So o Ipeadata devolve isso; o
 * SGS entrega data e valor, e nada mais.
 */
export interface IndicatorSourceMetadata {
  name: string;
  producer: string;
  methodologyUrl: string | null;
  lastUpdatedAt: string | null;
}
