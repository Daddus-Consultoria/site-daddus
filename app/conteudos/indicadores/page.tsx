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
  const { eyebrow, title, lead, escopo, calculadoras, metodologia, cta } =
    indicadoresPageContent;

  return (
    <div className="mx-auto w-full max-w-screen-limit px-5percent py-16 lg:py-24">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>

        <h1 className="mt-3 text-3xl font-bold text-secondary lg:text-4xl">
          {title}
        </h1>

        <p className="mt-4 text-lg leading-8 text-gray-600">{lead}</p>

        <p className="mt-4 leading-7 text-gray-600">{escopo}</p>

        {atualizadoEm ? (
          <p className="mt-6 text-sm text-gray-500">
            Séries lidas na origem em {atualizadoEm}.
          </p>
        ) : null}
      </header>

      <div className="mt-16">
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

      <section className="mt-20 rounded-lg border border-gray-200 p-8 lg:p-10">
        <h2 className="text-xl font-bold text-secondary">
          {calculadoras.title}
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-600">
          {calculadoras.text}
        </p>
        <Link
          href={calculadoras.href}
          className="mt-6 inline-block text-sm font-semibold text-primary underline underline-offset-2"
        >
          {calculadoras.label}
        </Link>
      </section>

      <section className="mt-16 border-t border-gray-200 pt-10">
        <h2 className="text-xl font-bold text-secondary">
          {metodologia.title}
        </h2>

        {metodologia.paragraphs.map((paragrafo) => (
          <p key={paragrafo} className="mt-4 max-w-3xl leading-7 text-gray-600">
            {paragrafo}
          </p>
        ))}
      </section>

      <section className="mt-16 rounded-lg bg-gray-50 p-8 lg:p-10">
        <h2 className="text-xl font-bold text-secondary">{cta.title}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-600">{cta.text}</p>
        <Link
          href={cta.href}
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          {cta.label}
        </Link>
      </section>
    </div>
  );
}
