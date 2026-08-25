import type { Metadata } from "next";
import Link from "next/link";

import { IndicatorsComparisonChart } from "@/components/indicatorsComparisonChart";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  formatIndicatorValue,
  formatReferencePeriod,
} from "@/lib/indicadores/format";
import {
  getIndicatorChartSeries,
  getIndicatorOptions,
  type IndicatorOption,
} from "@/lib/indicadores/queries";
import type { IndicatorUnit } from "@/lib/indicadores/types";

import {
  Aviso,
  BOTAO,
  Cabecalho,
  ChamadaFinal,
  OutrasCalculadoras,
  Trilha,
} from "../_components";
import { BASE_CALCULADORAS, calculadorasContent } from "../_constants";
import {
  comparadorContent,
  GRUPO_POR_UNIDADE,
  LIMITE_SERIES,
  SELECAO_PADRAO,
} from "./_constants";

export const metadata: Metadata = pageMetadata({
  title: "Comparador de séries econômicas",
  description:
    "Compare duas ou três séries do painel de indicadores no mesmo eixo — IPCA e IGP-M, Selic e inflação em 12 meses, dívida bruta e líquida — sem conversão nem reescala.",
  path: `${BASE_CALCULADORAS}/comparador`,
});

/** Responde a `searchParams`: nao ha o que pre-renderizar. */
export const dynamic = "force-dynamic";

const SLUG = "comparador";

type Params = Record<string, string | string[] | undefined>;

const nomeCurto = (indicador: IndicatorOption) =>
  indicador.acronym ?? indicador.name;

/** Agrupa por unidade, que e o criterio da comparacao, preservando a ordem. */
const agrupar = (opcoes: IndicatorOption[]) => {
  const grupos = new Map<IndicatorUnit, IndicatorOption[]>();

  opcoes.forEach((opcao) => {
    grupos.set(opcao.unit, [...(grupos.get(opcao.unit) ?? []), opcao]);
  });

  // Grupo de uma serie so nao forma par: ele apareceria como uma caixa que
  // nunca leva a um resultado.
  return Array.from(grupos.entries()).filter(([, itens]) => itens.length > 1);
};

export default async function ComparadorPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { form, fichas, erros } = comparadorContent;

  const opcoes = await getIndicatorOptions().catch((error) => {
    console.error("Calculadoras: falha ao listar os indicadores", error);

    return [] as IndicatorOption[];
  });

  const grupos = agrupar(opcoes);
  const comparaveis = grupos.flatMap(([, itens]) => itens);

  // Checkbox de mesmo nome chega como lista — ou como string, quando so uma
  // esta marcada. Sem parametro nenhum, a tela abre na selecao padrao.
  const pedidos = searchParams.series
    ? [searchParams.series].flat()
    : SELECAO_PADRAO;

  const escolhidos = pedidos
    .map((slug) => comparaveis.find((opcao) => opcao.slug === slug))
    .filter((opcao): opcao is IndicatorOption => opcao !== undefined);

  const unidades = Array.from(new Set(escolhidos.map((opcao) => opcao.unit)));
  const excedeu = escolhidos.length > LIMITE_SERIES;
  const selecionados = escolhidos.slice(0, LIMITE_SERIES);

  const erro =
    opcoes.length === 0
      ? erros["leitura-falhou"]
      : escolhidos.length < 2
        ? erros.poucas
        : unidades.length > 1
          ? erros.unidades.replace(
              "{grupos}",
              unidades
                .map((unidade) => GRUPO_POR_UNIDADE[unidade] ?? unidade)
                .join(" e ")
            )
          : null;

  const series = erro
    ? []
    : await Promise.all(
        selecionados.map(async (opcao) => ({
          slug: opcao.slug,
          label: nomeCurto(opcao),
          frequency: opcao.frequency,
          decimals: opcao.decimals,
          points: (await getIndicatorChartSeries(opcao.slug)).map((ponto) => ({
            date: ponto.date,
            value: ponto.value,
          })),
        }))
      );

  // Serie coletada pela metade nao desenha linha; sem esta guarda o grafico
  // receberia um array vazio e quebraria no calculo da escala.
  const desenhaveis = series.filter((serie) => serie.points.length > 1);

  return (
    <div className="mx-auto w-full max-w-screen-limit px-5percent py-16 lg:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Indicadores", path: "/conteudos/indicadores" },
          { name: "Calculadoras", path: BASE_CALCULADORAS },
          { name: comparadorContent.title, path: `${BASE_CALCULADORAS}/${SLUG}` },
        ])}
      />

      <Trilha atual={comparadorContent.title} />
      <Cabecalho
        eyebrow={comparadorContent.eyebrow}
        title={comparadorContent.title}
        lead={comparadorContent.lead}
      />

      <form method="get" className="mt-12 rounded-lg border border-gray-200 p-6 sm:p-8">
        <fieldset>
          <legend className="text-sm font-semibold text-secondary">
            {form.legend}
          </legend>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            {form.instrucao}
          </p>

          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {grupos.map(([unidade, itens]) => (
              <div key={unidade}>
                <p className="text-sm font-semibold text-secondary">
                  {GRUPO_POR_UNIDADE[unidade] ?? unidade}
                </p>

                <ul className="mt-3 space-y-2">
                  {itens.map((item) => (
                    <li key={item.slug} className="flex items-start gap-2">
                      <input
                        id={`serie-${item.slug}`}
                        type="checkbox"
                        name="series"
                        value={item.slug}
                        defaultChecked={pedidos.includes(item.slug)}
                        className="mt-1 h-4 w-4 shrink-0 accent-primary"
                      />
                      <label
                        htmlFor={`serie-${item.slug}`}
                        className="text-sm leading-6 text-gray-600"
                      >
                        {nomeCurto(item)}
                        <span className="text-gray-400">
                          {" · "}
                          {item.producer}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="submit" className={BOTAO}>
              {form.submit}
            </button>
            <Link
              href={`${BASE_CALCULADORAS}/${SLUG}`}
              className="text-sm font-semibold text-gray-500 hover:text-primary"
            >
              {form.limpar}
            </Link>
          </div>
        </fieldset>
      </form>

      <section className="mt-12" aria-labelledby="comparacao">
        <h2 id="comparacao" className="text-2xl font-bold text-secondary">
          {comparadorContent.grafico.title}
        </h2>

        {erro ? (
          <div className="mt-6">
            <Aviso tom="erro">{erro}</Aviso>
          </div>
        ) : desenhaveis.length < 2 ? (
          <div className="mt-6">
            <Aviso tom="erro">{erros["leitura-falhou"]}</Aviso>
          </div>
        ) : (
          <>
            {excedeu ? (
              <div className="mt-6 max-w-3xl">
                <Aviso>
                  {erros.demais.replace("{limite}", String(LIMITE_SERIES))}
                </Aviso>
              </div>
            ) : null}

            <IndicatorsComparisonChart
              series={desenhaveis}
              unit={selecionados[0].unit}
            />

            <h3 className="mt-12 text-xl font-bold text-secondary">
              {fichas.title}
            </h3>

            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {selecionados.map((item) => {
                const serie = series.find((atual) => atual.slug === item.slug);
                const ultimo = serie?.points[serie.points.length - 1];

                return (
                  <li
                    key={item.slug}
                    className="rounded-lg border border-gray-200 p-6"
                  >
                    <p className="font-semibold text-secondary">
                      {nomeCurto(item)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {fichas.produtor}: {item.producer}
                    </p>

                    {ultimo ? (
                      <>
                        <p className="mt-4 text-sm text-gray-500">
                          {fichas.ultimo}
                        </p>
                        <p className="mt-1 text-2xl font-bold tabular-nums text-secondary">
                          {formatIndicatorValue(
                            ultimo.value,
                            item.unit,
                            item.decimals
                          )}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatReferencePeriod(ultimo.date, item.frequency)}
                        </p>
                      </>
                    ) : null}

                    {item.firstDate && item.lastDate ? (
                      <p className="mt-4 text-sm text-gray-500">
                        {fichas.cobertura}:{" "}
                        {formatReferencePeriod(item.firstDate, item.frequency)}
                        {" a "}
                        {formatReferencePeriod(item.lastDate, item.frequency)}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                      <Link
                        href={`/conteudos/indicadores/${item.slug}`}
                        className="text-primary underline underline-offset-2"
                      >
                        {fichas.verSerie}
                      </Link>
                      <a
                        href={`/conteudos/indicadores/${item.slug}/serie.csv`}
                        className="text-gray-500 hover:text-primary"
                      >
                        {fichas.baixar}
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      <section className="mt-16 border-t border-gray-200 pt-10">
        <h2 className="text-xl font-bold text-secondary">
          {comparadorContent.metodo.title}
        </h2>
        {comparadorContent.metodo.paragraphs.map((paragrafo) => (
          <p key={paragrafo} className="mt-4 max-w-3xl leading-7 text-gray-600">
            {paragrafo}
          </p>
        ))}
      </section>

      <OutrasCalculadoras atual={SLUG} />
      <ChamadaFinal {...calculadorasContent.cta} />
    </div>
  );
}
