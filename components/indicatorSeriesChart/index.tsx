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
 * Grafico da serie historica de um indicador.
 *
 * Client component — e o unico pedaco interativo da pagina, que no resto e
 * renderizada no servidor. A interacao existe porque uma serie de quarenta anos
 * reduzida a 900px nao permite ler um periodo especifico so olhando: o cursor
 * diz qual data e qual valor estao sob o ponteiro.
 *
 * O tooltip acrescenta, nunca e o unico caminho: a tabela abaixo do grafico
 * traz os mesmos valores em texto, e o CSV leva a serie inteira. Quem navega
 * por teclado move o cursor com as setas.
 *
 * Uma serie so, entao nao ha legenda: o titulo da secao nomeia o indicador, e
 * uma caixa de legenda para uma linha unica seria ruido.
 */
interface Ponto {
  date: string;
  value: number;
}

interface IndicatorSeriesChartProps {
  points: Ponto[];
  unit: IndicatorUnit;
  decimals: number | null;
  frequency: IndicatorFrequency;
  /** Nome do indicador — vai para o `aria-label` do grafico. */
  label: string;
}

/**
 * Janelas de leitura.
 *
 * Uma serie brasileira de quarenta anos num eixo linear e ilegivel no trecho
 * recente: o IPCA de 1990 passou de 80% ao mes, e ao lado dele os 0,2% de hoje
 * viram uma linha reta colada no eixo. Nao e erro do grafico — e historia real
 * do pais — mas quem abre a pagina para ver o indice deste ano nao consegue.
 *
 * O recorte nao esconde nada: a janela maior continua sendo "Tudo", a tabela
 * lista os periodos e o CSV leva a serie inteira.
 */
const JANELAS = [
  { label: "1 ano", anos: 1 },
  { label: "5 anos", anos: 5 },
  { label: "10 anos", anos: 10 },
  { label: "Tudo", anos: null },
] as const;

const ALTURA = 320;
/** Espaco para os rotulos. O de baixo inclui a faixa do eixo X, para o
 *  container nao cortar as datas e criar barra de rolagem dentro do card. */
const MARGEM = { topo: 16, direita: 20, baixo: 36, esquerda: 60 };
const LARGURA_PADRAO = 900;

export const IndicatorSeriesChart = ({
  points,
  unit,
  decimals,
  frequency,
  label,
}: IndicatorSeriesChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [largura, setLargura] = useState(LARGURA_PADRAO);
  const [ativo, setAtivo] = useState<number | null>(null);
  const [anos, setAnos] = useState<number | null>(null);

  // Medir o container em vez de escalar um viewBox fixo: com `preserveAspect`
  // o SVG inteiro encolhe no celular e os rotulos ficariam em 5px. Medindo,
  // o texto sai sempre no mesmo corpo e so a curva se ajusta.
  const medir = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;

    // Desligar o observador anterior antes de criar outro: sem isto, cada
    // remontagem deixa um observador vivo chamando setState num componente
    // que ja saiu da tela.
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
   * Pontos da janela escolhida.
   *
   * O recorte e feito sobre os pontos que ja vieram do servidor, e nao com uma
   * nova consulta: a serie reduzida cobre o periodo inteiro com espacamento
   * regular, entao um recorte dela mantem a mesma densidade relativa e nao
   * custa nem uma ida ao banco nem um estado de carregamento.
   */
  const pontos = useMemo(() => {
    if (anos === null) return points;

    const fim = points[points.length - 1].date;
    const recorte = points.filter(
      (ponto) => diasEntre(ponto.date, fim) <= anos * 365.25
    );

    // Menos de dois pontos nao formam linha — janela curta demais para a
    // periodicidade da serie devolve a serie inteira em vez de uma tela vazia.
    return recorte.length >= 2 ? recorte : points;
  }, [points, anos]);

  const escala = useMemo(() => {
    const valores = pontos.map((p) => p.value);
    const minValor = Math.min(...valores);
    const maxValor = Math.max(...valores);

    const marcas = niceTicks(minValor, maxValor);
    // O dominio abraca as marcas para a linha nao encostar na borda de cima
    // nem sair por baixo da primeira marca.
    const dominioMin = Math.min(minValor, ...marcas);
    const dominioMax = Math.max(maxValor, ...marcas);
    const amplitude = dominioMax - dominioMin || 1;

    const tempo = (iso: string) => Date.parse(`${iso.slice(0, 10)}T00:00:00Z`);
    const t0 = tempo(pontos[0].date);
    const t1 = tempo(pontos[pontos.length - 1].date);
    const spanMs = t1 - t0 || 1;

    const larguraPlot = largura - MARGEM.esquerda - MARGEM.direita;
    const alturaPlot = ALTURA - MARGEM.topo - MARGEM.baixo;

    // Escala no tempo real, e nao no indice do ponto: serie diaria pula fim de
    // semana e feriado, e espacar por indice comprimiria 1984 e esticaria 2026.
    const x = (iso: string) =>
      MARGEM.esquerda + ((tempo(iso) - t0) / spanMs) * larguraPlot;
    const y = (valor: number) =>
      MARGEM.topo + (1 - (valor - dominioMin) / amplitude) * alturaPlot;

    return { x, y, marcas, larguraPlot, alturaPlot, minValor, maxValor };
  }, [pontos, largura]);

  const spanDias = diasEntre(pontos[0].date, pontos[pontos.length - 1].date);
  const casasEixo = axisDecimals(escala.marcas);

  const linha = useMemo(
    () =>
      pontos
        .map(
          (ponto, indice) =>
            `${indice === 0 ? "M" : "L"}${escala.x(ponto.date).toFixed(1)},${escala
              .y(ponto.value)
              .toFixed(1)}`
        )
        .join(" "),
    [pontos, escala]
  );

  /** Marcas do eixo X: seis datas equidistantes tiradas da propria serie. */
  const marcasX = useMemo(() => {
    const quantas = Math.min(6, pontos.length);
    if (quantas < 2) return pontos;

    return Array.from({ length: quantas }, (_, i) => {
      const indice = Math.round((i / (quantas - 1)) * (pontos.length - 1));
      return pontos[indice];
    });
  }, [pontos]);

  /**
   * Ponto mais proximo do ponteiro no eixo horizontal.
   *
   * A busca e pelo X e nao pela distancia ate a curva: exigir que o cursor
   * encoste na linha faria um alvo de poucos pixels, e o grafico so responderia
   * a quem mirasse bem. Assim qualquer altura da coluna serve.
   */
  const aproximar = (clientX: number) => {
    const caixa = containerRef.current?.getBoundingClientRect();
    if (!caixa) return;

    const posicao = clientX - caixa.left;
    let melhor = 0;
    let menorDistancia = Infinity;

    pontos.forEach((ponto, indice) => {
      const distancia = Math.abs(escala.x(ponto.date) - posicao);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        melhor = indice;
      }
    });

    setAtivo(melhor);
  };

  const porTeclado = (evento: React.KeyboardEvent) => {
    if (evento.key !== "ArrowLeft" && evento.key !== "ArrowRight") return;
    evento.preventDefault();

    const atual = ativo ?? pontos.length - 1;
    const proximo = evento.key === "ArrowLeft" ? atual - 1 : atual + 1;

    setAtivo(Math.min(pontos.length - 1, Math.max(0, proximo)));
  };

  const pontoAtivo = ativo === null ? null : pontos[ativo];
  const ultimo = pontos[pontos.length - 1];

  // O tooltip acompanha o cursor, mas nao pode sair do card: perto da borda
  // direita ele passa a crescer para a esquerda.
  const xAtivo = pontoAtivo ? escala.x(pontoAtivo.date) : 0;
  const tooltipADireita = xAtivo < largura - 180;

  // So oferece a janela que existe na serie: um botao "10 anos" numa serie de
  // tres anos mostraria o mesmo desenho de "Tudo" e sugeriria dado que nao ha.
  const spanTotal = diasEntre(points[0].date, points[points.length - 1].date);
  const janelas = JANELAS.filter(
    (janela) => janela.anos === null || janela.anos * 365.25 < spanTotal
  );

  return (
    <figure className="mt-8">
      {janelas.length > 1 ? (
        <div
          className="mb-4 flex flex-wrap gap-2"
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
                  // O cursor apontava para um indice da janela anterior; sem
                  // limpar, ele passaria a marcar outro periodo.
                  setAtivo(null);
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

      <div
        ref={medir}
        className="relative w-full"
        onMouseMove={(evento) => aproximar(evento.clientX)}
        onMouseLeave={() => setAtivo(null)}
        onTouchStart={(evento) => aproximar(evento.touches[0].clientX)}
        onTouchMove={(evento) => aproximar(evento.touches[0].clientX)}
      >
        <svg
          width={largura}
          height={ALTURA}
          viewBox={`0 0 ${largura} ${ALTURA}`}
          className="w-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
          role="img"
          aria-label={`Série histórica de ${label}, de ${formatReferencePeriod(
            pontos[0].date,
            frequency
          )} a ${formatReferencePeriod(ultimo.date, frequency)}. Os valores estão na tabela abaixo.`}
          tabIndex={0}
          onKeyDown={porTeclado}
          onFocus={() => setAtivo(pontos.length - 1)}
          onBlur={() => setAtivo(null)}
        >
          {/* Grade em traco continuo e um tom acima do fundo: tracejado leria
              como projecao ou limite, quando e so referencia de leitura. */}
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

          {marcasX.map((ponto, indice) => (
            <text
              key={`${ponto.date}-${indice}`}
              x={escala.x(ponto.date)}
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
              {formatAxisDate(ponto.date, frequency, spanDias)}
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

          <path
            d={linha}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          />

          {/* Rotulo direto so no ultimo ponto. Numero em cada ponto viraria
              uma parede de digitos; o resto se le no cursor ou na tabela. */}
          <circle
            cx={escala.x(ultimo.date)}
            cy={escala.y(ultimo.value)}
            r="4"
            className="fill-primary"
          />

          {pontoAtivo ? (
            <g>
              <line
                x1={xAtivo}
                y1={MARGEM.topo}
                x2={xAtivo}
                y2={ALTURA - MARGEM.baixo}
                className="stroke-gray-400"
                strokeWidth="1"
              />
              {/* Anel na cor da superficie separa o marcador da linha sem
                  desenhar uma borda por cima do dado. */}
              <circle
                cx={xAtivo}
                cy={escala.y(pontoAtivo.value)}
                r="5"
                className="fill-primary stroke-white"
                strokeWidth="2"
              />
            </g>
          ) : null}
        </svg>

        {pontoAtivo ? (
          <div
            className="pointer-events-none absolute top-2 z-10 rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm"
            style={
              tooltipADireita
                ? { left: xAtivo + 12 }
                : { right: largura - xAtivo + 12 }
            }
          >
            <p className="text-xs text-gray-500">
              {formatReferencePeriod(pontoAtivo.date, frequency)}
            </p>
            <p className="text-sm font-bold tabular-nums text-secondary">
              {formatIndicatorValue(pontoAtivo.value, unit, decimals)}
            </p>
          </div>
        ) : null}
      </div>

      <figcaption className="mt-3 text-sm text-gray-500">
        {anos === null ? "Série completa" : "Trecho exibido"}, de{" "}
        {formatReferencePeriod(pontos[0].date, frequency)} a{" "}
        {formatReferencePeriod(ultimo.date, frequency)}. Passe o cursor — ou use
        as setas do teclado — para ler um período.
      </figcaption>
    </figure>
  );
};
