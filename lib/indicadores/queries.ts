/**
 * Consultas da area de Indicadores.
 *
 * So pode ser importado do servidor: puxa `lib/db/pool`, que depende de
 * DATABASE_URL. Ver docs/INDICADORES.md.
 */
import { query } from "../db/pool";
import type {
  IndicatorCategory,
  IndicatorFrequency,
  IndicatorUnit,
} from "./types";

export interface IndicatorSummary {
  slug: string;
  name: string;
  acronym: string | null;
  description: string;
  producer: string;
  producerDetail: string | null;
  methodologyUrl: string | null;
  sourceName: string;
  category: IndicatorCategory;
  unit: IndicatorUnit;
  decimals: number | null;
  frequency: IndicatorFrequency;
  /** Ultimo valor publicado, ou null enquanto a serie nao foi coletada. */
  latestValue: number | null;
  latestDate: string | null;
  /** Valor do periodo anterior, para mostrar a direcao sem inventar analise. */
  previousValue: number | null;
  /** Pontos recentes, do mais antigo ao mais novo, para o grafico de linha. */
  recent: { date: string; value: number }[];
  collectedAt: string | null;
}

interface SummaryRow {
  slug: string;
  name: string;
  acronym: string | null;
  description: string;
  producer: string;
  producer_detail: string | null;
  methodology_url: string | null;
  source_name: string;
  category: IndicatorCategory;
  unit: IndicatorUnit;
  decimals: number | null;
  frequency: IndicatorFrequency;
  latest_value: string | null;
  latest_date: string | null;
  previous_value: string | null;
  recent: { date: string; value: string }[] | null;
  collected_at: string | null;
}

/** Quantos pontos alimentam o grafico de cada card. */
const PONTOS_RECENTES = 24;

/**
 * Todos os indicadores ativos com o ultimo valor e a serie recente.
 *
 * Uma consulta so, com LATERAL: uma por indicador significaria 16 idas ao banco
 * a cada carregamento da pagina. O LATERAL corre o indice
 * (indicator_id, reference_date DESC), entao cada recorte le so o topo da serie
 * em vez de varrer os 10 mil pontos do dolar.
 */
export const getIndicatorsOverview = async (): Promise<IndicatorSummary[]> => {
  const rows = await query<SummaryRow>(
    `SELECT
       i.slug, i.name, i.acronym, i.description,
       i.producer, i.producer_detail, i.methodology_url,
       s.name AS source_name,
       i.category, i.unit, i.decimals, i.frequency,
       to_char(i.last_collect_at, 'YYYY-MM-DD') AS collected_at,
       to_char(ultimo.reference_date, 'YYYY-MM-DD') AS latest_date,
       ultimo.value::text AS latest_value,
       anterior.value::text AS previous_value,
       serie.pontos AS recent
     FROM indicators i
     JOIN indicator_sources s ON s.id = i.source_id
     LEFT JOIN LATERAL (
       SELECT v.reference_date, v.value
         FROM indicator_values v
        WHERE v.indicator_id = i.id
        ORDER BY v.reference_date DESC
        LIMIT 1
     ) ultimo ON TRUE
     LEFT JOIN LATERAL (
       SELECT v.value
         FROM indicator_values v
        WHERE v.indicator_id = i.id
        ORDER BY v.reference_date DESC
        OFFSET 1 LIMIT 1
     ) anterior ON TRUE
     LEFT JOIN LATERAL (
       SELECT json_agg(
                json_build_object('date', to_char(p.reference_date, 'YYYY-MM-DD'), 'value', p.value::text)
                ORDER BY p.reference_date
              ) AS pontos
         FROM (
           SELECT v.reference_date, v.value
             FROM indicator_values v
            WHERE v.indicator_id = i.id
            ORDER BY v.reference_date DESC
            LIMIT $1
         ) p
     ) serie ON TRUE
     WHERE i.active AND s.active
     ORDER BY i.category, i.display_order`,
    [PONTOS_RECENTES]
  );

  // NUMERIC volta do pg como string, de proposito (o driver nao arrisca perder
  // precisao em float). A conversao acontece aqui, num lugar so, para que a
  // interface receba numero e nao precise saber disso.
  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    acronym: row.acronym,
    description: row.description,
    producer: row.producer,
    producerDetail: row.producer_detail,
    methodologyUrl: row.methodology_url,
    sourceName: row.source_name,
    category: row.category,
    unit: row.unit,
    decimals: row.decimals,
    frequency: row.frequency,
    latestValue: row.latest_value === null ? null : Number(row.latest_value),
    latestDate: row.latest_date,
    previousValue:
      row.previous_value === null ? null : Number(row.previous_value),
    recent: (row.recent ?? []).map((ponto) => ({
      date: ponto.date,
      value: Number(ponto.value),
    })),
    collectedAt: row.collected_at,
  }));
};

/** Data da coleta mais recente, para declarar a atualizacao da pagina. */
export const getLastCollectionDate = async (): Promise<string | null> => {
  const rows = await query<{ ultima: string | null }>(
    `SELECT to_char(MAX(last_collect_at), 'YYYY-MM-DD') AS ultima FROM indicators WHERE active`
  );

  return rows[0]?.ultima ?? null;
};
