import type { Metadata } from "next";
import Link from "next/link";

import { IndicatorsPanel } from "@/components/indicatorsPanel";
import { pageMetadata } from "@/lib/seo/metadata";
import { formatUpdatedAt } from "@/lib/indicadores/format";
import {
  getIndicatorsOverview,
  getLastCollectionDate,
  type IndicatorSummary,
} from "@/lib/indicadores/queries";

import {
  BASE_CALCULADORAS,
  calculadoras as calculadorasDisponiveis,
} from "./calculadoras/_constants";
import { indicadoresPageContent } from "./_constants";

export const metadata: Metadata = pageMetadata({
  title: "Indicadores",
  description:
    "Índices de preços, juros, câmbio, atividade e dívida pública, coletados nas instituições que os apuram e publicados com fonte e período de referência.",
  path: "/conteudos/indicadores",
});

/**
 * Uma hora. A serie mais rapida daqui e diaria: o dolar fecha uma vez por dia
 * util, e a coleta roda de madrugada. Revalidar a cada acesso faria a pagina
 * consultar o banco para reencontrar o mesmo numero.
 */
export const revalidate = 3600;

/**
 * Le as series tolerando falha do banco.
 *
 * Esta pagina e pre-renderizada no build, entao uma excecao aqui nao derruba
 * so a tela de indicadores: derruba o deploy inteiro, e qualquer outra
 * mudanca pronta fica presa junto. Como ela revalida de hora em hora, o
 * estado degradado se corrige sozinho na proxima revalidacao — enquanto um
 * build quebrado exige alguem para reparar.
 *
 * E o oposto da decisao em `app/conteudos/publicacoes/_publishPage.tsx`, onde
 * a falha sobe de proposito; la o que esta em jogo e uma pagina virar 404 aos
 * olhos do buscador, e nao a publicacao do site.
 */
const carregarSeries = async (): Promise<
  [IndicatorSummary[], string | null]
> => {
  try {
    return await Promise.all([getIndicatorsOverview(), getLastCollectionDate()]);
  } catch (error) {
    console.error("Indicadores: falha ao ler as séries", error);

    return [[], null];
  }
};

export default async function IndicatorsPage() {
  const [indicators, lastCollection] = await carregarSeries();

  const atualizadoEm = formatUpdatedAt(lastCollection);
  const { eyebrow, title, lead, escopo, stats, calculadoras, metodologia, cta } =
    indicadoresPageContent;

  /**
   * Os numeros do cabecalho saem do que foi lido, nunca de literal — a mesma
   * regra dos cards. Quando o banco nao responde, a lista fica vazia e o
   * cabecalho nao anuncia um acervo que a tela nao vai mostrar.
   */
  const totalDeGrupos = new Set(indicators.map((item) => item.category)).size;

  const numeros: { label: string; value: string }[] = [];

  if (indicators.length) {
    numeros.push(
      { label: stats.series, value: indicators.length.toLocaleString("pt-BR") },
      { label: stats.grupos, value: String(totalDeGrupos) }
    );
  }

  if (atualizadoEm) {
    numeros.push({ label: stats.atualizado, value: atualizadoEm });
  }

  return (
    <>
      {/* Mesma faixa de cabecalho da Biblioteca: as duas sao areas de acervo, e
          abrir igual poupa o visitante de reaprender a tela a cada area. */}
      <header className="border-b border-gray-200 bg-mediumGray">
        <div className="mx-auto flex w-full max-w-screen-limit flex-col gap-6 px-5percent py-10 lg:py-14">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              {eyebrow}
            </p>

            <h1 className="text-[28px] font-bold leading-tight text-secondary lg:text-[36px]">
              {title}
            </h1>

            <p className="max-w-[760px] text-[17px] leading-relaxed text-gray-600">
              {lead}
            </p>

            <p className="max-w-[760px] text-sm text-gray-500">{escopo}</p>
          </div>

          {numeros.length > 0 ? (
            <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-gray-200 pt-6">
              {numeros.map((numero) => (
                <div key={numero.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    {numero.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold tabular-nums text-secondary lg:text-3xl">
                    {numero.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </header>

      <div className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-16">
        {/* As calculadoras antes do painel, e nao depois dele: sao a unica coisa
            da area em que o visitante age sobre a serie em vez de so ler. Os tres
            destinos aparecem nomeados aqui — um link so para o indice esconderia
            que existem tres contas diferentes. */}
        <section
          aria-labelledby="calculadoras-titulo"
          className="rounded-xl border border-primary/40 bg-primary/5 p-6 lg:p-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2
              id="calculadoras-titulo"
              className="text-xl font-bold text-secondary"
            >
              {calculadoras.title}
            </h2>

            <Link
              href={calculadoras.href}
              className="text-sm font-semibold text-primary underline underline-offset-2"
            >
              {calculadoras.label}
            </Link>
          </div>

          <p className="mt-2 max-w-[760px] text-sm leading-relaxed text-gray-600">
            {calculadoras.text}
          </p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {calculadorasDisponiveis.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`${BASE_CALCULADORAS}/${item.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary"
                >
                  <span className="text-[15px] font-bold leading-tight text-secondary group-hover:text-primary">
                    {item.title}
                  </span>
                  <span className="mt-1.5 text-sm leading-6 text-gray-600">
                    {item.resumo}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14">
          {indicators.length ? (
            <IndicatorsPanel indicators={indicators} />
          ) : (
            // Banco vazio ou fora do ar. Uma tela em branco pareceria bug; dizer
            // que a leitura falhou e verdadeiro nos dois casos.
            <p className="leading-7 text-gray-600">
              Não foi possível carregar as séries agora. Tente novamente em
              instantes.
            </p>
          )}
        </div>

        {/* A procedencia continua na tela, mas do tamanho de uma nota: quem quer
            o detalhe de uma serie tem a pagina dela. */}
        <section className="mt-16 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-secondary">
            {metodologia.title}
          </h2>

          <p className="mt-2 max-w-[760px] text-sm leading-relaxed text-gray-600">
            {metodologia.text}
          </p>
        </section>

        <section className="mt-12 rounded-xl bg-mediumGray p-8 lg:p-10">
          <h2 className="text-xl font-bold text-secondary">{cta.title}</h2>

          <p className="mt-2 max-w-[760px] leading-relaxed text-gray-600">
            {cta.text}
          </p>

          <Link
            href={cta.href}
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            {cta.label}
          </Link>
        </section>
      </div>
    </>
  );
}
