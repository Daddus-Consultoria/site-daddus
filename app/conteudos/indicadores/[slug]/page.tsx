import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { IndicatorSeriesChart } from "@/components/indicatorSeriesChart";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { absoluteUrl } from "@/lib/seo/constants";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  formatIndicatorValue,
  formatReferencePeriod,
  formatUpdatedAt,
  indicatorCategoryLabels,
} from "@/lib/indicadores/format";
import {
  getIndicatorChartSeries,
  getIndicatorDetail,
  getIndicatorSlugs,
  getIndicatorTableRows,
  type IndicatorDetail,
} from "@/lib/indicadores/queries";

import { BASE_CALCULADORAS } from "../calculadoras/_constants";
import { FREQUENCIA_LABEL, indicadorPageContent } from "./_constants";

/**
 * Encadear variacao mensal so faz sentido em indice de preco divulgado assim —
 * o mesmo recorte que `getCorrectionIndices` aplica no banco, aqui aplicado a
 * um indicador ja carregado, para decidir se o atalho aparece.
 */
const aceitaCorrecao = (indicador: IndicatorDetail) =>
  indicador.category === "precos" &&
  indicador.unit === "percentual" &&
  indicador.frequency === "mensal";

/** Uma hora, como o painel: a serie mais rapida daqui e diaria. */
export const revalidate = 3600;

/**
 * Pre-renderiza as paginas dos indicadores ativos.
 *
 * Tolera falha do banco de proposito: sem isto, um Postgres fora do ar durante
 * o build derruba o deploy inteiro. Devolvendo lista vazia, as paginas passam a
 * ser geradas sob demanda e voltam sozinhas na proxima revalidacao — o mesmo
 * raciocinio de `app/conteudos/indicadores/page.tsx`.
 */
export async function generateStaticParams() {
  try {
    return (await getIndicatorSlugs()).map((slug) => ({ slug }));
  } catch (error) {
    console.error("Indicadores: falha ao listar as séries", error);

    return [];
  }
}

const tituloDoIndicador = (indicador: IndicatorDetail) =>
  indicador.acronym && indicador.acronym !== indicador.name
    ? `${indicador.acronym} — ${indicador.name}`
    : indicador.name;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const indicador = await getIndicatorDetail(params.slug).catch(() => null);
  const path = `/conteudos/indicadores/${params.slug}`;

  if (!indicador) {
    return pageMetadata({
      title: "Indicador não encontrado",
      description: "Esta série não está no painel de indicadores da Daddus.",
      path,
      index: false,
    });
  }

  return pageMetadata({
    title: tituloDoIndicador(indicador),
    description: `${indicador.description} Série apurada por ${indicador.producer}, publicada com período de referência e procedência.`,
    path,
  });
}

/**
 * Dados estruturados da serie.
 *
 * `Dataset` e nao `Article`: o que a pagina publica e uma serie de dados. O
 * `creator` e quem apura, e o `publisher` e a Daddus — a mesma distincao que a
 * ficha da Biblioteca faz entre quem produziu a obra e quem a cataloga. Dizer
 * que a Daddus criou o IPCA seria falso.
 */
const buildJsonLd = (indicador: IndicatorDetail) => ({
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: tituloDoIndicador(indicador),
  description: indicador.description,
  url: absoluteUrl(`/conteudos/indicadores/${indicador.slug}`),
  creator: { "@type": "Organization", name: indicador.producer },
  publisher: { "@type": "Organization", name: "Daddus" },
  isBasedOn: indicador.methodologyUrl ?? undefined,
  temporalCoverage:
    indicador.firstDate && indicador.lastDate
      ? `${indicador.firstDate}/${indicador.lastDate}`
      : undefined,
  variableMeasured: indicador.name,
  distribution: {
    "@type": "DataDownload",
    encodingFormat: "text/csv",
    contentUrl: absoluteUrl(
      `/conteudos/indicadores/${indicador.slug}/serie.csv`
    ),
  },
});

const FichaLinha: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-1 border-b border-gray-200 py-3 last:border-b-0 sm:flex-row sm:gap-4">
    <dt className="w-44 shrink-0 text-sm text-gray-500">{label}</dt>
    <dd className="text-sm text-secondary">{children}</dd>
  </div>
);

export default async function IndicatorDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const indicador = await getIndicatorDetail(params.slug);

  if (!indicador) notFound();

  const [serie, tabela] = await Promise.all([
    getIndicatorChartSeries(params.slug),
    getIndicatorTableRows(params.slug),
  ]);

  const {
    voltar,
    serie: serieTexto,
    tabela: tabelaTexto,
    download,
    procedencia,
    marcos,
    calculadoras: calculadorasTexto,
    cta,
  } = indicadorPageContent;

  const path = `/conteudos/indicadores/${indicador.slug}`;
  const formatar = (valor: number) =>
    formatIndicatorValue(valor, indicador.unit, indicador.decimals);

  return (
    <div className="mx-auto w-full max-w-screen-limit px-5percent py-16 lg:py-24">
      <JsonLd data={buildJsonLd(indicador)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Indicadores", path: "/conteudos/indicadores" },
          { name: indicador.acronym ?? indicador.name, path },
        ])}
      />

      <nav aria-label="Trilha" className="text-sm text-gray-500">
        <Link href={voltar.href} className="hover:text-primary">
          {voltar.label}
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-secondary">
          {indicatorCategoryLabels[indicador.category] ?? indicador.category}
        </span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold text-secondary lg:text-4xl">
          {tituloDoIndicador(indicador)}
        </h1>

        <p className="mt-4 leading-7 text-gray-600">{indicador.description}</p>
      </header>

      {indicador.latestValue !== null && indicador.latestDate !== null ? (
        <div className="mt-10 rounded-lg border border-gray-200 p-6 sm:p-8">
          {/* Numero grande em digito proporcional: `tabular-nums` em corpo de
              display abre espaco demais entre os algarismos. Na tabela e no
              eixo, onde os numeros se alinham em coluna, ele volta. */}
          <p className="text-4xl font-bold text-secondary lg:text-5xl">
            {formatar(indicador.latestValue)}
          </p>

          <p className="mt-2 text-gray-600">
            Referência:{" "}
            {formatReferencePeriod(indicador.latestDate, indicador.frequency)}
            {indicador.previousValue !== null && indicador.previousDate ? (
              <>
                {" · anterior "}
                {formatar(indicador.previousValue)}
                {" ("}
                {formatReferencePeriod(
                  indicador.previousDate,
                  indicador.frequency
                )}
                {")"}
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      {serie.length > 1 ? (
        <section className="mt-16" aria-labelledby="serie-historica">
          <h2
            id="serie-historica"
            className="text-2xl font-bold text-secondary"
          >
            {serieTexto.title}
          </h2>

          <IndicatorSeriesChart
            points={serie}
            unit={indicador.unit}
            decimals={indicador.decimals}
            frequency={indicador.frequency}
            label={tituloDoIndicador(indicador)}
          />

          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-500">
            {serieTexto.reducao}
          </p>

          {indicador.comparableFrom && indicador.firstDate ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
              {serieTexto.janela
                .replace(
                  "{inicio}",
                  formatReferencePeriod(
                    indicador.comparableFrom,
                    indicador.frequency
                  )
                )
                .replace(
                  "{serieDesde}",
                  formatReferencePeriod(
                    indicador.firstDate,
                    indicador.frequency
                  )
                )}
            </p>
          ) : null}
        </section>
      ) : null}

      {indicador.maxValue !== null && indicador.minValue !== null ? (
        <section className="mt-16" aria-labelledby="marcos-da-serie">
          <h2 id="marcos-da-serie" className="text-2xl font-bold text-secondary">
            {marcos.title}
          </h2>

          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            {[
              {
                rotulo: marcos.maior,
                valor: indicador.maxValue,
                data: indicador.maxDate,
              },
              {
                rotulo: marcos.menor,
                valor: indicador.minValue,
                data: indicador.minDate,
              },
            ].map(({ rotulo, valor, data }) => (
              <div
                key={rotulo}
                className="rounded-lg border border-gray-200 p-6"
              >
                <dt className="text-sm text-gray-500">{rotulo}</dt>
                <dd className="mt-2 text-2xl font-bold text-secondary">
                  {formatar(valor)}
                </dd>
                {data ? (
                  <p className="mt-1 text-sm text-gray-500">
                    {formatReferencePeriod(data, indicador.frequency)}
                  </p>
                ) : null}
              </div>
            ))}
          </dl>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-500">
            {marcos.nota}
          </p>
        </section>
      ) : null}

      <section className="mt-16" aria-labelledby="periodos-recentes">
        <h2 id="periodos-recentes" className="text-2xl font-bold text-secondary">
          {tabelaTexto.title}
        </h2>

        {tabela.length === 0 ? (
          <p className="mt-4 text-gray-600">{tabelaTexto.vazio}</p>
        ) : (
          // A tabela rola dentro do proprio container: sem isto, uma tela
          // estreita empurraria a pagina inteira para o lado.
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[20rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-300">
                  <th scope="col" className="py-3 pr-4 text-sm font-semibold text-secondary">
                    {tabelaTexto.colunas.periodo}
                  </th>
                  <th scope="col" className="py-3 text-right text-sm font-semibold text-secondary">
                    {tabelaTexto.colunas.valor}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tabela.map((ponto) => (
                  <tr key={ponto.date} className="border-b border-gray-200">
                    <td className="py-3 pr-4 text-sm tabular-nums text-gray-600">
                      {formatReferencePeriod(ponto.date, indicador.frequency)}
                      {/* A origem so informa o fim do periodo em serie apurada
                          de data a data (TR, poupanca); quando ha, o intervalo
                          e o que da sentido ao numero. */}
                      {ponto.end && ponto.end !== ponto.date ? (
                        <span className="text-gray-400">
                          {" a "}
                          {formatReferencePeriod(ponto.end, indicador.frequency)}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 text-right text-sm font-medium tabular-nums text-secondary">
                      {formatar(ponto.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {indicador.pointCount > 0 ? (
        <section className="mt-16" aria-labelledby="serie-completa">
          <h2 id="serie-completa" className="text-2xl font-bold text-secondary">
            {download.title}
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-gray-600">
            {download.texto}
          </p>

          <a
            href={`${path}/serie.csv`}
            className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            {download.label}
          </a>
        </section>
      ) : null}

      {aceitaCorrecao(indicador) || indicador.comparableCount > 0 ? (
        <section className="mt-16" aria-labelledby="usar-esta-serie">
          <h2 id="usar-esta-serie" className="text-2xl font-bold text-secondary">
            {calculadorasTexto.title}
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {aceitaCorrecao(indicador) ? (
              <Link
                href={`${BASE_CALCULADORAS}/correcao-monetaria?indice=${indicador.slug}`}
                className="block h-full rounded-lg border border-gray-200 p-6 transition-colors hover:border-primary"
              >
                <p className="font-semibold text-secondary">
                  {calculadorasTexto.correcao.label.replace(
                    "{indice}",
                    indicador.acronym ?? indicador.name
                  )}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {calculadorasTexto.correcao.texto}
                </p>
              </Link>
            ) : null}

            {indicador.comparableCount > 0 ? (
              <Link
                href={`${BASE_CALCULADORAS}/comparador?series=${indicador.slug}`}
                className="block h-full rounded-lg border border-gray-200 p-6 transition-colors hover:border-primary"
              >
                <p className="font-semibold text-secondary">
                  {calculadorasTexto.comparar.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {calculadorasTexto.comparar.texto}
                </p>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mt-16" aria-labelledby="procedencia">
        <h2 id="procedencia" className="text-2xl font-bold text-secondary">
          {procedencia.title}
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-gray-600">
          {procedencia.texto}
        </p>

        <dl className="mt-6 max-w-3xl">
          <FichaLinha label={procedencia.rotulos.produtor}>
            {indicador.producer}
            {indicador.producerDetail &&
            indicador.producerDetail !== indicador.producer ? (
              <span className="text-gray-500">
                {" · "}
                {indicador.producerDetail}
              </span>
            ) : null}
          </FichaLinha>

          <FichaLinha label={procedencia.rotulos.distribuidor}>
            {indicador.sourceName}
          </FichaLinha>

          <FichaLinha label={procedencia.rotulos.periodicidade}>
            {FREQUENCIA_LABEL[indicador.frequency] ?? indicador.frequency}
          </FichaLinha>

          {indicador.firstDate && indicador.lastDate ? (
            <FichaLinha label={procedencia.rotulos.cobertura}>
              <span className="tabular-nums">
                {indicador.pointCount.toLocaleString("pt-BR")}
              </span>
              {", de "}
              {formatReferencePeriod(indicador.firstDate, indicador.frequency)}
              {" a "}
              {formatReferencePeriod(indicador.lastDate, indicador.frequency)}
            </FichaLinha>
          ) : null}

          {indicador.methodologyUrl ? (
            <FichaLinha label={procedencia.rotulos.metodologia}>
              <a
                href={indicador.methodologyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Ver na origem
              </a>
            </FichaLinha>
          ) : null}

          <FichaLinha label={procedencia.rotulos.codigo}>
            <span className="tabular-nums">{indicador.externalId}</span>
          </FichaLinha>

          {indicador.collectedAt ? (
            <FichaLinha label={procedencia.rotulos.coleta}>
              {formatUpdatedAt(indicador.collectedAt)}
            </FichaLinha>
          ) : null}
        </dl>
      </section>

      <section className="mt-16 rounded-lg border border-gray-200 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-secondary">{cta.title}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-600">{cta.text}</p>
        <Link
          href={cta.href}
          className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          {cta.label}
        </Link>
      </section>
    </div>
  );
}
