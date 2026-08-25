import type { IndicatorUnit } from "@/lib/indicadores/types";

/**
 * Grafico de linha do card.
 *
 * SVG montado a mao, e nao `react-google-charts` como a tela antiga: sao 16
 * graficos numa pagina so, cada um com 24 pontos e sem interacao nenhuma.
 * A biblioteca carregaria um script externo do Google e obrigaria a pagina
 * inteira a virar client component para desenhar o que o servidor ja sabe.
 *
 * Nao ha eixo nem rotulo de proposito: o numero exato esta escrito ao lado, em
 * tamanho grande. Aqui o que interessa e a direcao da serie.
 */
interface SparklineProps {
  points: { date: string; value: number }[];
  unit: IndicatorUnit;
}

const LARGURA = 240;
const ALTURA = 56;

export const Sparkline = ({ points, unit }: SparklineProps) => {
  // Dois pontos e o minimo para existir uma linha. Com menos, o card mostra o
  // valor sem grafico em vez de desenhar um traco sem significado.
  if (points.length < 2) return null;

  const valores = points.map((point) => point.value);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  // Serie constante (a Selic fica meses na mesma taxa) faria a divisao dar zero
  // e todos os pontos irem para a mesma coordenada; o traco vai ao meio.
  const amplitude = max - min || 1;

  const coordenadas = points.map((point, indice) => {
    const x = (indice / (points.length - 1)) * LARGURA;
    const y = ALTURA - ((point.value - min) / amplitude) * ALTURA;

    return { x, y: max === min ? ALTURA / 2 : y };
  });

  const linha = coordenadas
    .map(({ x, y }, indice) => `${indice === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const ultimo = coordenadas[coordenadas.length - 1];

  // Indice e cambio nao tem zero de referencia; variacao percentual tem, e a
  // linha do zero e o que separa alta de deflacao.
  const temZero =
    unit !== "indice" && unit !== "moeda" && min < 0 && max > 0;
  const yZero = ALTURA - ((0 - min) / amplitude) * ALTURA;

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      className="h-14 w-full"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
    >
      {temZero ? (
        <line
          x1="0"
          y1={yZero}
          x2={LARGURA}
          y2={yZero}
          stroke="currentColor"
          strokeWidth="1"
          className="text-gray-300"
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}

      <path
        d={linha}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
        // Sem isto a linha engrossa e afina conforme o card estica, porque o
        // preserveAspectRatio="none" deforma o traco junto com a geometria.
        vectorEffect="non-scaling-stroke"
      />

      <circle cx={ultimo.x} cy={ultimo.y} r="3" className="fill-primary" />
    </svg>
  );
};
