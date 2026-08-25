import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { jurosCompostos, type BaseDaTaxa } from "@/lib/indicadores/calculo";
import { formatIndicatorValue, formatUpdatedAt } from "@/lib/indicadores/format";
import {
  formatMoeda,
  formatNumero,
  formatPercentual,
  lerInteiro,
  lerTaxa,
  lerValorOuZero,
  primeiro,
} from "@/lib/indicadores/formulario";
import { getLatestValues } from "@/lib/indicadores/queries";

import {
  Aviso,
  BOTAO,
  CAMPO,
  Cabecalho,
  Campo,
  ChamadaFinal,
  Metrica,
  OutrasCalculadoras,
  Trilha,
} from "../_components";
import { BASE_CALCULADORAS, calculadorasContent } from "../_constants";
import { jurosContent } from "./_constants";

export const metadata: Metadata = pageMetadata({
  title: "Calculadora de juros compostos com aporte mensal",
  description:
    "Projete o valor futuro de um capital com aporte mensal, com taxa ao ano ou ao mês, equivalência composta e a evolução do saldo ano a ano.",
  path: `${BASE_CALCULADORAS}/juros-compostos`,
});

/** Responde a `searchParams`: nao ha o que pre-renderizar. */
export const dynamic = "force-dynamic";

const SLUG = "juros-compostos";

/** Prazo maximo por unidade — cinquenta anos, escrito das duas formas. */
const LIMITE = { anos: 50, meses: 600 } as const;

/**
 * Series que servem de referencia para a taxa.
 *
 * A Selic e o custo do dinheiro no tempo, e o IPCA em 12 meses e a inflacao
 * que corroi o resultado nominal. As duas leituras enquadram a taxa que a
 * pessoa vai digitar sem que a tela sugira uma.
 */
const REFERENCIAS = ["selic-meta", "ipca-12-meses"] as const;

const ROTULO_REFERENCIA: Record<string, string> = {
  "selic-meta": "Selic — meta do Copom",
  "ipca-12-meses": "IPCA — acumulado em 12 meses",
};

type Params = Record<string, string | string[] | undefined>;

export default async function JurosCompostosPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { form, resultado: textoResultado, tabela, erros, referencia } =
    jurosContent;

  const referencias = await getLatestValues([...REFERENCIAS]).catch((error) => {
    console.error("Calculadoras: falha ao ler as taxas de referência", error);

    return {} as Awaited<ReturnType<typeof getLatestValues>>;
  });

  const capitalBruto = primeiro(searchParams.capital);
  const aporteBruto = primeiro(searchParams.aporte);
  const taxaBruta = primeiro(searchParams.taxa);
  const prazoBruto = primeiro(searchParams.prazo);

  const base: BaseDaTaxa = primeiro(searchParams.base) === "mes" ? "mes" : "ano";
  const unidade =
    primeiro(searchParams.prazoUnidade) === "meses" ? "meses" : "anos";

  const capital = lerValorOuZero(capitalBruto);
  const aporte = lerValorOuZero(aporteBruto);
  const taxa = lerTaxa(taxaBruta);
  const prazo = lerInteiro(prazoBruto, 1, LIMITE[unidade]);

  const erro =
    taxaBruta && taxa === null
      ? erros["taxa-invalida"]
      : prazoBruto && prazo === null
        ? erros["prazo-invalido"]
        : (capitalBruto && capital === null) || (aporteBruto && aporte === null)
          ? erros["valor-invalido"]
          : taxa !== null && prazo !== null && !(capital ?? 0) && !(aporte ?? 0)
            ? erros["tudo-zero"]
            : null;

  const meses = prazo === null ? 0 : unidade === "anos" ? prazo * 12 : prazo;

  const calculo =
    !erro && taxa !== null && prazo !== null
      ? jurosCompostos(capital ?? 0, aporte ?? 0, taxa, base, meses)
      : null;

  /** Link que troca so a taxa, preservando o que ja foi preenchido. */
  const linkComTaxa = (valor: number) => {
    const query = new URLSearchParams();

    Object.entries(searchParams).forEach(([chave, valorBruto]) => {
      const unico = primeiro(valorBruto);
      if (unico) query.set(chave, unico);
    });

    query.set("taxa", formatNumero(valor, 2));
    query.set("base", "ano");

    return `${BASE_CALCULADORAS}/${SLUG}?${query.toString()}`;
  };

  const prazoEscrito =
    prazo === null
      ? ""
      : unidade === "anos"
        ? `${prazo} ${prazo === 1 ? "ano" : "anos"}`
        : `${prazo} ${prazo === 1 ? "mês" : "meses"}`;

  return (
    <div className="mx-auto w-full max-w-screen-limit px-5percent py-16 lg:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Indicadores", path: "/conteudos/indicadores" },
          { name: "Calculadoras", path: BASE_CALCULADORAS },
          { name: jurosContent.title, path: `${BASE_CALCULADORAS}/${SLUG}` },
        ])}
      />

      <Trilha atual={jurosContent.title} />
      <Cabecalho
        eyebrow={jurosContent.eyebrow}
        title={jurosContent.title}
        lead={jurosContent.lead}
      />

      <form method="get" className="mt-12 rounded-lg border border-gray-200 p-6 sm:p-8">
        <fieldset>
          <legend className="sr-only">{form.legend}</legend>

          <div className="grid gap-6 sm:grid-cols-2">
            <Campo
              label={form.capital.label}
              hint={form.capital.hint}
              htmlFor="capital"
            >
              <input
                id="capital"
                name="capital"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                defaultValue={capitalBruto ?? ""}
                placeholder={form.capital.placeholder}
                className={`${CAMPO} mt-2`}
              />
            </Campo>

            <Campo
              label={form.aporte.label}
              hint={form.aporte.hint}
              htmlFor="aporte"
            >
              <input
                id="aporte"
                name="aporte"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                defaultValue={aporteBruto ?? ""}
                placeholder={form.aporte.placeholder}
                className={`${CAMPO} mt-2`}
              />
            </Campo>

            {/* Taxa e base andam juntas: "10,5" sozinho nao diz se e ao mes ou
                ao ano, e a diferenca entre as duas leituras e de quase quatro
                vezes num prazo de dez anos. */}
            <Campo label={form.taxa.label} htmlFor="taxa">
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  id="taxa"
                  name="taxa"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  defaultValue={taxaBruta ?? ""}
                  placeholder={form.taxa.placeholder}
                  className={CAMPO}
                />
                <div>
                  <label htmlFor="base" className="sr-only">
                    {form.base.label}
                  </label>
                  <select
                    id="base"
                    name="base"
                    defaultValue={base}
                    className={CAMPO}
                  >
                    <option value="ano">{form.base.opcoes.ano}</option>
                    <option value="mes">{form.base.opcoes.mes}</option>
                  </select>
                </div>
              </div>
            </Campo>

            <Campo label={form.prazo.label} htmlFor="prazo">
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  id="prazo"
                  name="prazo"
                  type="number"
                  min={1}
                  max={LIMITE[unidade]}
                  inputMode="numeric"
                  autoComplete="off"
                  defaultValue={prazoBruto ?? ""}
                  placeholder={form.prazo.placeholder}
                  className={CAMPO}
                />
                <div>
                  <label htmlFor="prazoUnidade" className="sr-only">
                    {form.prazoUnidade.label}
                  </label>
                  <select
                    id="prazoUnidade"
                    name="prazoUnidade"
                    defaultValue={unidade}
                    className={CAMPO}
                  >
                    <option value="anos">{form.prazoUnidade.opcoes.anos}</option>
                    <option value="meses">
                      {form.prazoUnidade.opcoes.meses}
                    </option>
                  </select>
                </div>
              </div>
            </Campo>
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

      <section className="mt-12" aria-labelledby="resultado">
        <h2 id="resultado" className="text-2xl font-bold text-secondary">
          {textoResultado.title}
        </h2>

        {erro ? (
          <div className="mt-6">
            <Aviso tom="erro">{erro}</Aviso>
          </div>
        ) : calculo === null ? (
          <p className="mt-4 max-w-3xl leading-7 text-gray-600">
            {jurosContent.vazio}
          </p>
        ) : (
          <>
            <p className="mt-6 max-w-3xl leading-7 text-gray-600">
              {textoResultado.frase
                .replace("{prazo}", prazoEscrito)
                .replace(
                  "{taxa}",
                  `${formatPercentual(taxa ?? 0)} ${
                    base === "ano" ? "ao ano" : "ao mês"
                  }`
                )}
            </p>

            <p className="mt-3 text-4xl font-bold text-secondary lg:text-5xl">
              {formatMoeda(calculo.valorFuturo)}
            </p>
            <p className="mt-2 text-gray-600">
              {textoResultado.prazoEmMeses.replace(
                "{meses}",
                formatNumero(calculo.meses, 0)
              )}
            </p>

            <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Metrica
                rotulo={textoResultado.aportado}
                valor={formatMoeda(calculo.totalAportado)}
              />
              <Metrica
                rotulo={textoResultado.juros}
                valor={formatMoeda(calculo.juros)}
              />
              <Metrica
                rotulo={textoResultado.taxaMensal}
                valor={formatPercentual(calculo.taxaMensal * 100, 4)}
              />
              <Metrica
                rotulo={textoResultado.taxaAnual}
                valor={formatPercentual(calculo.taxaAnual)}
              />
            </dl>

            <div className="mt-12">
              <h3 className="text-xl font-bold text-secondary">
                {tabela.title}
              </h3>
              <p className="mt-3 max-w-3xl leading-7 text-gray-600">
                {tabela.texto}
              </p>

              <div className="mt-6 max-h-[32rem] overflow-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[40rem] border-collapse text-left">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-gray-300">
                      {[
                        tabela.colunas.ano,
                        tabela.colunas.meses,
                        tabela.colunas.aportado,
                        tabela.colunas.juros,
                        tabela.colunas.saldo,
                      ].map((coluna, indice) => (
                        <th
                          key={coluna}
                          scope="col"
                          className={`px-4 py-3 text-sm font-semibold text-secondary ${
                            indice === 0 ? "" : "text-right"
                          }`}
                        >
                          {coluna}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {calculo.anos.map((linha) => (
                      <tr
                        key={linha.meses}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="px-4 py-2.5 text-sm tabular-nums text-gray-600">
                          {linha.ano}
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm tabular-nums text-gray-600">
                          {linha.meses}
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm tabular-nums text-gray-600">
                          {formatMoeda(linha.aportado)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm tabular-nums text-gray-600">
                          {formatMoeda(linha.juros)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm font-medium tabular-nums text-secondary">
                          {formatMoeda(linha.saldo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-8 max-w-3xl leading-7 text-gray-600">
              {jurosContent.poderDeCompra.texto}{" "}
              <Link
                href={`${BASE_CALCULADORAS}/correcao-monetaria`}
                className="font-semibold text-primary underline underline-offset-2"
              >
                {jurosContent.poderDeCompra.label}
              </Link>
              .
            </p>
          </>
        )}
      </section>

      {Object.keys(referencias).length > 0 ? (
        <section className="mt-16" aria-labelledby="taxas-de-referencia">
          <h2
            id="taxas-de-referencia"
            className="text-xl font-bold text-secondary"
          >
            {referencia.title}
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-600">
            {referencia.texto}
          </p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {REFERENCIAS.map((slug) => {
              const leitura = referencias[slug];
              if (!leitura) return null;

              return (
                <li
                  key={slug}
                  className="rounded-lg border border-gray-200 p-5"
                >
                  <p className="text-sm text-gray-500">
                    {ROTULO_REFERENCIA[slug]}
                  </p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-secondary">
                    {formatIndicatorValue(leitura.value, "percentual-ano")}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {referencia.lida.replace(
                      "{data}",
                      formatUpdatedAt(leitura.date) ?? ""
                    )}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                    <Link
                      href={linkComTaxa(leitura.value)}
                      className="text-primary underline underline-offset-2"
                    >
                      {referencia.usar}
                    </Link>
                    <Link
                      href={`/conteudos/indicadores/${slug}`}
                      className="text-gray-500 hover:text-primary"
                    >
                      Ver a série
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="mt-16 border-t border-gray-200 pt-10">
        <h2 className="text-xl font-bold text-secondary">
          {jurosContent.metodo.title}
        </h2>
        {jurosContent.metodo.paragraphs.map((paragrafo) => (
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
