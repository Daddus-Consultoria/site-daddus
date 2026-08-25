import Link from "next/link";

import type { IndicatorSummary } from "@/lib/indicadores/queries";
import {
  formatIndicatorValue,
  formatReferencePeriod,
  indicatorCategoryContext,
  indicatorCategoryLabels,
} from "@/lib/indicadores/format";

import { Sparkline } from "./sparkline";

/**
 * Painel de indicadores.
 *
 * Server component: nao ha filtro nem interacao, e os dados ja chegam prontos
 * da consulta. Deixar no servidor evita mandar as 16 series para o navegador.
 *
 * Cada card carrega valor, periodo de referencia e quem apura, porque a
 * `docs/DIRETRIZES-UX.md` secao 6 e explicita: "nunca numero isolado: sempre
 * contexto e fonte".
 */
interface IndicatorsPanelProps {
  indicators: IndicatorSummary[];
}

const FREQUENCIA_LABEL: Record<string, string> = {
  diaria: "Diária",
  mensal: "Mensal",
};

const IndicatorCard = ({ indicator }: { indicator: IndicatorSummary }) => {
  const {
    slug,
    acronym,
    name,
    description,
    unit,
    decimals,
    frequency,
    latestValue,
    latestDate,
    previousValue,
    recent,
    producer,
    producerDetail,
    methodologyUrl,
  } = indicator;

  return (
    <li className="flex h-full flex-col rounded-lg border border-gray-200 p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold text-secondary">
          {/* O card inteiro nao vira link: ele ja contem o link da metodologia,
              na origem, e aninhar ancora dentro de ancora e invalido. O titulo
              leva a serie; a fonte, ao produtor. */}
          <Link
            href={`/conteudos/indicadores/${slug}`}
            className="hover:text-primary hover:underline underline-offset-2"
          >
            {acronym ?? name}
          </Link>
        </h3>
        <span className="shrink-0 text-xs uppercase tracking-wide text-gray-500">
          {FREQUENCIA_LABEL[frequency]}
        </span>
      </div>

      <p className="mt-1 text-sm text-gray-500">{name}</p>

      {latestValue === null || latestDate === null ? (
        // Serie cadastrada e ainda nao coletada. Melhor dizer isso do que
        // esconder o card: some da tela sem explicacao pareceria erro.
        <p className="mt-6 text-sm text-gray-500">
          Série ainda não coletada.
        </p>
      ) : (
        <>
          <p className="mt-6 text-3xl font-bold text-secondary">
            {formatIndicatorValue(latestValue, unit, decimals)}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            Referência: {formatReferencePeriod(latestDate, frequency)}
            {previousValue !== null ? (
              <>
                {" · anterior "}
                {formatIndicatorValue(previousValue, unit, decimals)}
              </>
            ) : null}
          </p>

          <div className="mt-4">
            <Sparkline points={recent} unit={unit} />
            {recent.length > 1 ? (
              <p className="mt-1 text-xs text-gray-500">
                {`Últimos ${recent.length} períodos, de ${formatReferencePeriod(
                  recent[0].date,
                  frequency
                )} a ${formatReferencePeriod(
                  recent[recent.length - 1].date,
                  frequency
                )}.`}
              </p>
            ) : null}
          </div>
        </>
      )}

      <p className="mt-4 text-sm leading-6 text-gray-600">{description}</p>

      {/* CTA nomeia o destino, nunca "veja mais" — DIRETRIZES-UX secao 11. */}
      <p className="mt-4">
        <Link
          href={`/conteudos/indicadores/${slug}`}
          className="text-sm font-semibold text-primary underline underline-offset-2"
        >
          Ver série histórica
        </Link>
      </p>

      <p className="mt-auto pt-4 text-xs text-gray-500">
        Fonte:{" "}
        {methodologyUrl ? (
          <a
            href={methodologyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline underline-offset-2"
          >
            {producer}
          </a>
        ) : (
          <span className="font-semibold text-secondary">{producer}</span>
        )}
        {/* O texto tal como a origem se declara, quando difere do nome curto:
            e a procedencia exata, que o card resume para caber. */}
        {producerDetail && producerDetail !== producer ? (
          <span className="text-gray-400"> · {producerDetail}</span>
        ) : null}
      </p>
    </li>
  );
};

export const IndicatorsPanel = ({ indicators }: IndicatorsPanelProps) => {
  // A ordem das categorias ja vem da consulta (category, display_order); aqui
  // so agrupamos preservando essa ordem, sem reordenar nada.
  const grupos = indicators.reduce<Record<string, IndicatorSummary[]>>(
    (acumulado, indicador) => {
      (acumulado[indicador.category] ||= []).push(indicador);
      return acumulado;
    },
    {}
  );

  return (
    <div className="space-y-16">
      {Object.entries(grupos).map(([categoria, doGrupo]) => (
        <section key={categoria} aria-labelledby={`grupo-${categoria}`}>
          <h2
            id={`grupo-${categoria}`}
            className="text-2xl font-bold text-secondary"
          >
            {indicatorCategoryLabels[categoria] ?? categoria}
          </h2>

          <p className="mt-2 max-w-3xl leading-7 text-gray-600">
            {indicatorCategoryContext[categoria]}
          </p>

          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {doGrupo.map((indicador) => (
              <IndicatorCard key={indicador.slug} indicator={indicador} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
