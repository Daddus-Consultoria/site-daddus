import Link from "next/link";

import type { IndicatorSummary } from "@/lib/indicadores/queries";
import {
  formatIndicatorValue,
  formatReferencePeriod,
  indicatorCategoryContext,
  indicatorCategoryLabels,
  indicatorCategoryOrder,
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
 * contexto e fonte". O que o card *nao* carrega e a descricao da serie e a
 * autodeclaracao da origem: dezesseis paragrafos numa grade so viram parede de
 * texto, e os dois textos ja estao na pagina da serie, a um clique do titulo.
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
    unit,
    decimals,
    frequency,
    latestValue,
    latestDate,
    previousValue,
    recent,
    producer,
    methodologyUrl,
  } = indicator;

  return (
    <li className="group relative flex h-full flex-col rounded-lg border border-gray-200 p-5 transition-colors hover:border-primary focus-within:border-primary">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[17px] font-bold leading-tight text-secondary">
          {/* Link esticado: o card inteiro leva a serie, sem aninhar ancora
              dentro de ancora — o que seria HTML invalido. O link da fonte
              escapa da area esticada com `relative z-[1]`. Antes o card tinha
              dois links para o mesmo destino, o titulo e um "Ver serie
              historica" no rodape; um alvo grande substitui os dois. */}
          <Link
            href={`/conteudos/indicadores/${slug}`}
            className="after:absolute after:inset-0 after:rounded-lg group-hover:text-primary"
          >
            {acronym ?? name}
          </Link>
        </h3>

        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          {FREQUENCIA_LABEL[frequency]}
        </span>
      </div>

      {/* Altura minima de duas linhas para os valores da grade caírem na mesma
          altura, com nome de uma linha ("Dólar") ou de duas. */}
      <p className="mt-1 min-h-[2.5rem] text-xs leading-5 text-gray-500">
        {name}
      </p>

      {latestValue === null || latestDate === null ? (
        // Serie cadastrada e ainda nao coletada. Melhor dizer isso do que
        // esconder o card: some da tela sem explicacao pareceria erro.
        <p className="mt-4 text-sm text-gray-500">Série ainda não coletada.</p>
      ) : (
        <>
          <p className="mt-3 text-[28px] font-bold leading-none tabular-nums text-secondary">
            {formatIndicatorValue(latestValue, unit, decimals)}
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-600">
            Referência: {formatReferencePeriod(latestDate, frequency)}
            {previousValue !== null ? (
              <>
                {" · anterior "}
                {formatIndicatorValue(previousValue, unit, decimals)}
              </>
            ) : null}
          </p>

          <div className="mt-3">
            <Sparkline points={recent} unit={unit} />

            {/* As duas pontas da janela, uma em cada extremidade do traco, no
                lugar da frase que descrevia o mesmo intervalo em texto corrido.
                Dizem a mesma coisa e funcionam como eixo do grafico. */}
            {recent.length > 1 ? (
              <p className="mt-1 flex justify-between text-[11px] tabular-nums text-gray-400">
                <span>{formatReferencePeriod(recent[0].date, frequency)}</span>
                <span>
                  {formatReferencePeriod(
                    recent[recent.length - 1].date,
                    frequency
                  )}
                </span>
              </p>
            ) : null}
          </div>
        </>
      )}

      <p className="mt-auto pt-4 text-xs text-gray-500">
        Fonte:{" "}
        {methodologyUrl ? (
          <a
            href={methodologyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-[1] font-semibold text-primary underline underline-offset-2"
          >
            {producer}
          </a>
        ) : (
          <span className="font-semibold text-secondary">{producer}</span>
        )}
      </p>
    </li>
  );
};

export const IndicatorsPanel = ({ indicators }: IndicatorsPanelProps) => {
  // A consulta ja entrega cada categoria com seus indicadores em `display_order`;
  // o agrupamento preserva essa ordem interna.
  const grupos = indicators.reduce<Record<string, IndicatorSummary[]>>(
    (acumulado, indicador) => {
      (acumulado[indicador.category] ||= []).push(indicador);
      return acumulado;
    },
    {}
  );

  // Dentro do grupo a ordem e a da consulta (`display_order`); entre grupos, a
  // editorial. Categoria que ainda nao esteja na lista vai para o fim, em vez
  // de sumir da tela.
  const entradas = Object.entries(grupos).sort(([a], [b]) => {
    const posicao = (categoria: string) => {
      const indice = indicatorCategoryOrder.indexOf(
        categoria as (typeof indicatorCategoryOrder)[number]
      );

      return indice === -1 ? indicatorCategoryOrder.length : indice;
    };

    return posicao(a) - posicao(b);
  });

  return (
    <div>
      {/* Indice dos grupos. A pagina tem dezesseis cards em cinco secoes: sem
          isto, chegar em "Dívida pública" e rolagem cega. As ancoras sao as
          mesmas que o submenu do topo ja usa (`#grupo-<categoria>`), e a
          contagem diz o tamanho de cada grupo antes do clique. */}
      <nav
        aria-label="Grupos de indicadores"
        className="flex flex-wrap gap-2 border-y border-gray-200 py-4"
      >
        {entradas.map(([categoria, doGrupo]) => (
          <a
            key={categoria}
            href={`#grupo-${categoria}`}
            className="flex items-baseline gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            {indicatorCategoryLabels[categoria] ?? categoria}
            <span className="text-xs tabular-nums text-gray-500">
              {doGrupo.length}
            </span>
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-12">
        {entradas.map(([categoria, doGrupo]) => (
          <section key={categoria} aria-labelledby={`grupo-${categoria}`}>
            <div className="flex items-baseline gap-3 border-b border-gray-200 pb-2">
              <h2
                id={`grupo-${categoria}`}
                className="scroll-mt-8 text-xl font-bold text-secondary"
              >
                {indicatorCategoryLabels[categoria] ?? categoria}
              </h2>

              <span className="text-xs tabular-nums text-gray-500">
                {doGrupo.length === 1
                  ? "1 série"
                  : `${doGrupo.length} séries`}
              </span>
            </div>

            <p className="mt-3 max-w-[760px] text-sm leading-relaxed text-gray-600">
              {indicatorCategoryContext[categoria]}
            </p>

            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {doGrupo.map((indicador) => (
                <IndicatorCard key={indicador.slug} indicator={indicador} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};
