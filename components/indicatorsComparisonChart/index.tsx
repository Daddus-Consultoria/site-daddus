"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import {
  axisDecimals,
  diasEntre,
  formatAxisDate,
  formatAxisNumber,
  niceTicks,
  unitAxisLabel,
} from "@/lib/indicadores/axis";
import {
  formatIndicatorValue,
  formatReferencePeriod,
} from "@/lib/indicadores/format";
import type { IndicatorFrequency, IndicatorUnit } from "@/lib/indicadores/types";

/**
 * Duas ou tres series no mesmo eixo.
 *
 * Existe separado de `indicatorSeriesChart` — que desenha uma serie so — porque
 * o que muda nao e o numero de linhas: e a leitura. Aqui e preciso legenda,
 * cores que se distingam e um cursor que responda pelas series todas de uma
 * vez; la, nada disso apareceria e so somaria peso a pagina de um indicador.
 *
 * **Nao ha rebase.** Uma comparacao com base 100 na data inicial mostraria
 * numeros que nenhuma origem publicou, e a area inteira se sustenta em nao
 * fazer isso. O que substitui o rebase e a restricao de unidade: a pagina so
 * deixa comparar series de mesma unidade, e ai o eixo comum ja e legitimo.
 */
export interface SerieComparada {
  slug: string;
  label: string;
  frequency: IndicatorFrequency;
  decimals: number | null;
  points: { date: string; value: number }[];
}

interface Props {
  series: SerieComparada[];
  /** Unidade comum — a pagina garante que as series a compartilham. */
  unit: IndicatorUnit;
}

/**
 * Cores das linhas.
 *
 * Tres, no maximo, e escolhidas por contraste de luminancia alem do matiz: quem
 * nao distingue vermelho de verde continua separando as linhas pelo tom claro e
 * escuro. A primeira e a primaria da marca, para o grafico continuar parecendo
 * do site (DIRETRIZES-UX secao 11, que pede pouca cor).
 */
const CORES = ["hsl(var(--primary))", "#1D4E89", "#0F766E"];

const JANELAS = [
  { label: "1 ano", anos: 1 },
  { label: "5 anos", anos: 5 },
  { label: "10 anos", anos: 10 },
  { label: "Tudo", anos: null },
] as const;

const ALTURA = 340;
const MARGEM = { topo: 16, direita: 20, baixo: 36, esquerda: 60 };
const LARGURA_PADRAO = 900;

const tempo = (iso: string) => Date.parse(`${iso.slice(0, 10)}T00:00:00Z`);

export const IndicatorsComparisonChart = ({ series, unit }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [largura, setLargura] = useState(LARGURA_PADRAO);
  const [anos, setAnos] = useState<number | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);

  const medir = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;

    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!node || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entrada]) => {
      setLargura(Math.max(320, entrada.contentRect.width));
    });

    observer.observe(node);
    observerRef.current = observer;
  }, []);

  /**
   * Recorte da janela.
   *
   * O fim e a data mais recente entre todas as series, e nao a de cada uma: com
   * fins diferentes, uma serie mensal publicada com atraso apareceria deslocada
   * para tras da diaria, como se tivesse parado.
   */
  const { recortadas, fim, inicio } = useMemo(() => {
    const ultimo = series
      .map((serie) => serie.points[serie.points.length - 1]?.date)
      .filter(Boolean)
      .sort()
      .pop() as string;

    const recortadas = series.map((serie) => ({
      ...serie,
      points:
        anos === null
          ? serie.points
          : serie.points.filter(
              (ponto) => diasEntre(ponto.date, ultimo) <= anos * 365.25
            ),
    }));

    const primeiro = recortadas
      .map((serie) => serie.points[0]?.date)
      .filter(Boolean)
      .sort()
      .shift() as string;

    return { recortadas, fim: ultimo, inicio: primeiro };
  }, [series, anos]);

  const escala = useMemo(() => {
    const valores = recortadas.flatMap((serie) =>
      serie.points.map((ponto) => ponto.value)
    );
    const minValor = Math.min(...valores);
    const maxValor = Math.max(...valores);

    const marcas = niceTicks(minValor, maxValor);
    const dominioMin = Math.min(minValor, ...marcas);
    const dominioMax = Math.max(maxValor, ...marcas);
    const amplitude = dominioMax - dominioMin || 1;

    const t0 = tempo(inicio);
    const spanMs = tempo(fim) - t0 || 1;

    const larguraPlot = largura - MARGEM.esquerda - MARGEM.direita;
    const alturaPlot = ALTURA - MARGEM.topo - MARGEM.baixo;

    const x = (iso: string) =>
      MARGEM.esquerda + ((tempo(iso) - t0) / spanMs) * larguraPlot;
    const y = (valor: number) =>
      MARGEM.topo + (1 - (valor - dominioMin) / amplitude) * alturaPlot;

    return { x, y, marcas };
  }, [recortadas, inicio, fim, largura]);

  /** Datas do eixo X — a uniao das series, para o cursor poder parar em qualquer uma. */
  const datas = useMemo(() => {
    const todas = new Set<string>();
    recortadas.forEach((serie) =>
      serie.points.forEach((ponto) => todas.add(ponto.date))
    );

    return Array.from(todas).sort();
  }, [recortadas]);

  const spanDias = diasEntre(inicio, fim);
  const casasEixo = axisDecimals(escala.marcas);

  const marcasX = useMemo(() => {
    const quantas = Math.min(6, datas.length);
    if (quantas < 2) return datas;

    return Array.from(
      { length: quantas },
      (_, i) => datas[Math.round((i / (quantas - 1)) * (datas.length - 1))]
    );
  }, [datas]);

  const aproximar = (clientX: number) => {
    const caixa = containerRef.current?.getBoundingClientRect();
    if (!caixa || datas.length === 0) return;

    const posicao = clientX - caixa.left;
    let melhor = datas[0];
    let menorDistancia = Infinity;

    datas.forEach((data) => {
      const distancia = Math.abs(escala.x(data) - posicao);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        melhor = data;
      }
    });

    setCursor(melhor);
  };

  const porTeclado = (evento: React.KeyboardEvent) => {
    if (evento.key !== "ArrowLeft" && evento.key !== "ArrowRight") return;
    evento.preventDefault();

    const atual = cursor === null ? datas.length - 1 : datas.indexOf(cursor);
    const proximo = evento.key === "ArrowLeft" ? atual - 1 : atual + 1;

    setCursor(datas[Math.min(datas.length - 1, Math.max(0, proximo))]);
  };

  /**
   * Leitura de cada serie sob o cursor.
   *
   * Serie diaria e serie mensal nao compartilham datas, entao cada uma responde
   * com o ponto mais proximo do que esta sob o ponteiro — e nao com o ponto
   * exato, que na mensal existiria em um dia a cada trinta.
   */
  const leituras = useMemo(() => {
    if (!cursor) return [];

    return recortadas.map((serie) => {
      const alvo = tempo(cursor);
      let ponto = serie.points[0];

      serie.points.forEach((candidato) => {
        if (
          Math.abs(tempo(candidato.date) - alvo) <
          Math.abs(tempo(ponto.date) - alvo)
        ) {
          ponto = candidato;
        }
      });

      return { serie, ponto };
    });
  }, [cursor, recortadas]);

  const janelas = JANELAS.filter(
    (janela) =>
      janela.anos === null ||
      janela.anos * 365.25 <
        diasEntre(
          series.map((s) => s.points[0]?.date).filter(Boolean).sort()[0] ?? fim,
          fim
        )
  );

  const xCursor = cursor ? escala.x(cursor) : 0;
  const tooltipADireita = xCursor < largura - 240;

  return (
    <figure className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* A legenda vem antes do grafico: sem ela, a primeira linha lida e uma
            cor sem nome. */}
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {recortadas.map((serie, indice) => (
            <li key={serie.slug} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className="h-0.5 w-6 rounded-full"
                style={{ backgroundColor: CORES[indice] }}
              />
              <span className="font-medium text-secondary">{serie.label}</span>
            </li>
          ))}
        </ul>

        {janelas.length > 1 ? (
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Período exibido no gráfico"
          >
            {janelas.map((janela) => {
              const selecionada = anos === janela.anos;

              return (
                <button
                  key={janela.label}
                  type="button"
                  aria-pressed={selecionada}
                  onClick={() => {
                    setAnos(janela.anos);
                    setCursor(null);
                  }}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    selecionada
                      ? "border-primary bg-primary font-semibold text-white"
                      : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
                  }`}
                >
                  {janela.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div
        ref={medir}
        className="relative mt-4 w-full"
        onMouseMove={(evento) => aproximar(evento.clientX)}
        onMouseLeave={() => setCursor(null)}
        onTouchStart={(evento) => aproximar(evento.touches[0].clientX)}
        onTouchMove={(evento) => aproximar(evento.touches[0].clientX)}
      >
        <svg
          width={largura}
          height={ALTURA}
          viewBox={`0 0 ${largura} ${ALTURA}`}
          className="w-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
          role="img"
          aria-label={`Comparação entre ${recortadas
            .map((serie) => serie.label)
            .join(", ")}, de ${formatReferencePeriod(
            inicio,
            "mensal"
          )} a ${formatReferencePeriod(fim, "mensal")}. Os valores estão na tabela abaixo.`}
          tabIndex={0}
          onKeyDown={porTeclado}
          onFocus={() => setCursor(datas[datas.length - 1] ?? null)}
          onBlur={() => setCursor(null)}
        >
          {escala.marcas.map((marca) => (
            <g key={marca}>
              <line
                x1={MARGEM.esquerda}
                y1={escala.y(marca)}
                x2={largura - MARGEM.direita}
                y2={escala.y(marca)}
                className="stroke-gray-200"
                strokeWidth="1"
              />
              <text
                x={MARGEM.esquerda - 10}
                y={escala.y(marca)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-gray-500 text-[11px] tabular-nums"
              >
                {formatAxisNumber(marca, casasEixo)}
              </text>
            </g>
          ))}

          {marcasX.map((data, indice) => (
            <text
              key={`${data}-${indice}`}
              x={escala.x(data)}
              y={ALTURA - MARGEM.baixo + 20}
              textAnchor={
                indice === 0
                  ? "start"
                  : indice === marcasX.length - 1
                    ? "end"
                    : "middle"
              }
              className="fill-gray-500 text-[11px] tabular-nums"
            >
              {formatAxisDate(data, "mensal", spanDias)}
            </text>
          ))}

          <text
            x={MARGEM.esquerda - 10}
            y={MARGEM.topo - 4}
            textAnchor="end"
            className="fill-gray-400 text-[11px]"
          >
            {unitAxisLabel[unit]}
          </text>

          {recortadas.map((serie, indice) => (
            <path
              key={serie.slug}
              d={serie.points
                .map(
                  (ponto, i) =>
                    `${i === 0 ? "M" : "L"}${escala.x(ponto.date).toFixed(1)},${escala
                      .y(ponto.value)
                      .toFixed(1)}`
                )
                .join(" ")}
              fill="none"
              stroke={CORES[indice]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {cursor ? (
            <g>
              <line
                x1={xCursor}
                y1={MARGEM.topo}
                x2={xCursor}
                y2={ALTURA - MARGEM.baixo}
                className="stroke-gray-400"
                strokeWidth="1"
              />
              {leituras.map(({ serie, ponto }, indice) => (
                <circle
                  key={serie.slug}
                  cx={escala.x(ponto.date)}
                  cy={escala.y(ponto.value)}
                  r="5"
                  fill={CORES[indice]}
                  className="stroke-white"
                  strokeWidth="2"
                />
              ))}
            </g>
          ) : null}
        </svg>

        {cursor ? (
          <div
            className="pointer-events-none absolute top-2 z-10 rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm"
            style={
              tooltipADireita
                ? { left: xCursor + 12 }
                : { right: largura - xCursor + 12 }
            }
          >
            {leituras.map(({ serie, ponto }, indice) => (
              <div key={serie.slug} className={indice > 0 ? "mt-2" : ""}>
                <p className="flex items-center gap-2 text-xs text-gray-500">
                  <span
                    aria-hidden="true"
                    className="h-0.5 w-4 rounded-full"
                    style={{ backgroundColor: CORES[indice] }}
                  />
                  {serie.label}
                  {" · "}
                  {formatReferencePeriod(ponto.date, serie.frequency)}
                </p>
                <p className="text-sm font-bold tabular-nums text-secondary">
                  {formatIndicatorValue(ponto.value, unit, serie.decimals)}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <figcaption className="mt-3 text-sm text-gray-500">
        {anos === null ? "Séries completas" : "Trecho exibido"}, de{" "}
        {formatReferencePeriod(inicio, "mensal")} a{" "}
        {formatReferencePeriod(fim, "mensal")}. Passe o cursor — ou use as setas
        do teclado — para ler um período em todas as séries.
      </figcaption>
    </figure>
  );
};
