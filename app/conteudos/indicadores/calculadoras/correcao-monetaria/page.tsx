import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  corrigirPorIndice,
  mesDe,
  type CorrecaoResultado,
} from "@/lib/indicadores/calculo";
import {
  formatMes,
  formatMoeda,
  formatNumero,
  formatPercentual,
  lerMes,
  lerValor,
  primeiro,
} from "@/lib/indicadores/formulario";
import {
  getCorrectionIndices,
  getIndicatorMonthlySeries,
  type IndicatorOption,
} from "@/lib/indicadores/queries";

import {
  Aviso,
  BOTAO,
  CAMPO,
  Cabecalho,
  Campo,
  CampoGrupo,
  ChamadaFinal,
  Metrica,
  OutrasCalculadoras,
  SeletorMesAno,
  Trilha,
} from "../_components";
import { BASE_CALCULADORAS, calculadorasContent } from "../_constants";
import { correcaoContent } from "./_constants";

export const metadata: Metadata = pageMetadata({
  title: "Calculadora de correção de valores por índice",
  description:
    "Corrija um valor entre dois meses pelo IPCA, IGP-M, INCC-DI, INPC e outros índices de preços, com a memória de cálculo mês a mês e a procedência de cada variação.",
  path: `${BASE_CALCULADORAS}/correcao-monetaria`,
});

/**
 * A pagina le `searchParams`, entao e sempre renderizada por requisicao — nao
 * ha o que pre-renderizar quando o conteudo e a resposta a um formulario. A
 * consulta que ela faz e uma serie mensal de algumas centenas de linhas.
 */
export const dynamic = "force-dynamic";

const SLUG = "correcao-monetaria";

type Params = Record<string, string | string[] | undefined>;

/** Mes de uma data ISO opcional — as pontas da serie chegam como `string | null`. */
const mesOuNulo = (iso: string | null) => (iso ? mesDe(iso) : null);

/** Um ano antes, para o formulario abrir num periodo que faz sentido olhar. */
const umAnoAntes = (mes: string) =>
  `${Number(mes.slice(0, 4)) - 1}-${mes.slice(5, 7)}`;

const mensagemDeErro = (resultado: Extract<CorrecaoResultado, { ok: false }>) => {
  const { erros } = correcaoContent;

  switch (resultado.motivo) {
    case "antes-da-serie":
      return erros["antes-da-serie"].replace(
        "{primeiro}",
        formatMes(resultado.primeiroMes)
      );
    case "depois-da-serie":
      return erros["depois-da-serie"].replace(
        "{ultimo}",
        formatMes(resultado.ultimoMes)
      );
    case "mes-faltando":
      return erros["mes-faltando"].replace("{mes}", formatMes(resultado.mes));
    default:
      return erros[resultado.motivo];
  }
};

const nomeCurto = (indice: IndicatorOption) => indice.acronym ?? indice.name;

export default async function CorrecaoMonetariaPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { form, resultado: textoResultado, memoria, erros, serie: textoSerie } =
    correcaoContent;

  // Falha do banco nao pode deixar a tela em branco: o formulario continua
  // desenhado e o recado diz o que aconteceu, como no painel.
  const indices = await getCorrectionIndices().catch((error) => {
    console.error("Calculadoras: falha ao listar os índices", error);

    return [] as IndicatorOption[];
  });

  const slugPedido = primeiro(searchParams.indice);
  const indice =
    indices.find((item) => item.slug === slugPedido) ?? indices[0] ?? null;

  // O intervalo de anos e a uniao das series: sem JavaScript a lista nao muda
  // ao trocar de indice, e um periodo fora do alcance daquele indice cai na
  // validacao do calculo, que diz onde a serie comeca.
  const primeiroAno = Math.min(
    ...indices.map((item) => Number(item.firstDate?.slice(0, 4) ?? 9999))
  );
  const ultimoMesPublicado = indices
    .map((item) => mesOuNulo(item.lastDate))
    .filter((mes): mes is string => mes !== null)
    .sort()
    .pop();

  const anos =
    indices.length && ultimoMesPublicado
      ? Array.from(
          { length: Number(ultimoMesPublicado.slice(0, 4)) - primeiroAno + 1 },
          (_, i) => primeiroAno + i
        ).reverse()
      : [];

  const padraoAte = ultimoMesPublicado ?? "";
  const padraoDe = padraoAte ? umAnoAntes(padraoAte) : "";

  const de =
    lerMes(
      `${primeiro(searchParams.deAno) ?? ""}-${primeiro(searchParams.deMes) ?? ""}`
    ) ?? padraoDe;
  const ate =
    lerMes(
      `${primeiro(searchParams.ateAno) ?? ""}-${primeiro(searchParams.ateMes) ?? ""}`
    ) ?? padraoAte;

  const valorBruto = primeiro(searchParams.valor);
  const valor = lerValor(valorBruto);

  // So calcula quando ha valor: o primeiro acesso mostra o formulario, e nao
  // uma mensagem de erro sobre um campo que ninguem preencheu ainda.
  const calculo =
    valor !== null && indice && de && ate
      ? corrigirPorIndice(
          valor,
          await getIndicatorMonthlySeries(indice.slug),
          de,
          ate
        )
      : null;

  const rotuloIndice = indice ? nomeCurto(indice) : "";
  const produtorIndice = indice?.producer ?? "";

  const erroDeEntrada =
    valorBruto && valor === null
      ? erros["valor-invalido"]
      : indices.length === 0
        ? erros["leitura-falhou"]
        : slugPedido && !indices.some((item) => item.slug === slugPedido)
          ? erros["indice-invalido"]
          : null;

  return (
    <div className="mx-auto w-full max-w-screen-limit px-5percent py-16 lg:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Indicadores", path: "/conteudos/indicadores" },
          { name: "Calculadoras", path: BASE_CALCULADORAS },
          {
            name: correcaoContent.title,
            path: `${BASE_CALCULADORAS}/${SLUG}`,
          },
        ])}
      />

      <Trilha atual={correcaoContent.title} />
      <Cabecalho
        eyebrow={correcaoContent.eyebrow}
        title={correcaoContent.title}
        lead={correcaoContent.lead}
      />

      <form method="get" className="mt-12 rounded-lg border border-gray-200 p-6 sm:p-8">
        <fieldset>
          <legend className="sr-only">{form.legend}</legend>

          <div className="grid gap-6 sm:grid-cols-2">
            <Campo
              label={form.valor.label}
              hint={form.valor.hint}
              htmlFor="valor"
            >
              <input
                id="valor"
                name="valor"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                defaultValue={valorBruto ?? ""}
                placeholder={form.valor.placeholder}
                className={`${CAMPO} mt-2`}
              />
            </Campo>

            <Campo label={form.indice.label} htmlFor="indice">
              <select
                id="indice"
                name="indice"
                defaultValue={indice?.slug ?? ""}
                className={`${CAMPO} mt-2`}
              >
                {indices.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {nomeCurto(item)} — {item.producer}
                  </option>
                ))}
              </select>
            </Campo>

            <CampoGrupo label={form.de.label} hint={form.de.hint}>
              <SeletorMesAno
                nome="de"
                mes={de.slice(5, 7)}
                ano={de.slice(0, 4)}
                anos={anos}
                rotulos={{ mes: form.mes, ano: form.ano }}
              />
            </CampoGrupo>

            <CampoGrupo label={form.ate.label} hint={form.ate.hint}>
              <SeletorMesAno
                nome="ate"
                mes={ate.slice(5, 7)}
                ano={ate.slice(0, 4)}
                anos={anos}
                rotulos={{ mes: form.mes, ano: form.ano }}
              />
            </CampoGrupo>
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

        {erroDeEntrada ? (
          <div className="mt-6">
            <Aviso tom="erro">{erroDeEntrada}</Aviso>
          </div>
        ) : calculo === null ? (
          <p className="mt-4 max-w-3xl leading-7 text-gray-600">
            {correcaoContent.vazio}
          </p>
        ) : !calculo.ok ? (
          <div className="mt-6">
            <Aviso tom="erro">{mensagemDeErro(calculo)}</Aviso>
          </div>
        ) : (
          <>
            {/* A frase enuncia a pergunta com o valor lido — e onde quem
                digitou "1.500" confere que o sistema entendeu mil e quinhentos
                —, e a resposta vem separada, em corpo de leitura a distancia. */}
            <p className="mt-6 max-w-3xl leading-7 text-gray-600">
              {textoResultado.frase
                .replace("{valorOriginal}", formatMoeda(calculo.valorOriginal))
                .replace("{de}", formatMes(calculo.de))
                .replace("{indice}", rotuloIndice)
                .replace("{produtor}", produtorIndice)
                .replace("{ate}", formatMes(calculo.ate))}
            </p>

            <p className="mt-3 text-4xl font-bold text-secondary lg:text-5xl">
              {formatMoeda(calculo.valorCorrigido)}
            </p>

            {calculo.atePedido ? (
              <div className="mt-6 max-w-3xl">
                <Aviso>
                  {textoResultado.incompleto
                    .replace("{pedido}", formatMes(calculo.atePedido))
                    .replace("{ultimo}", formatMes(calculo.ate))}
                </Aviso>
              </div>
            ) : null}

            {calculo.meses.length === 0 ? (
              <div className="mt-6 max-w-3xl">
                <Aviso>{textoResultado.mesmoMes}</Aviso>
              </div>
            ) : (
              <>
                <dl className="mt-8 grid gap-6 sm:grid-cols-3">
                  <Metrica
                    rotulo={textoResultado.variacao}
                    valor={formatPercentual(calculo.variacaoAcumulada)}
                    nota={`${formatMes(calculo.meses[0].mes)} a ${formatMes(
                      calculo.ate
                    )}`}
                  />
                  <Metrica
                    rotulo={textoResultado.fator}
                    valor={formatNumero(calculo.fator, 6)}
                  />
                  <Metrica
                    rotulo={textoResultado.meses}
                    valor={formatNumero(calculo.meses.length, 0)}
                  />
                </dl>

                <div className="mt-12">
                  <h3 className="text-xl font-bold text-secondary">
                    {memoria.title}
                  </h3>
                  <p className="mt-3 max-w-3xl leading-7 text-gray-600">
                    {memoria.texto}
                  </p>

                  {/* A memoria pode ter centenas de linhas — a correcao de um
                      valor de 1994 aplica 380 meses. Rolar dentro do proprio
                      quadro mantem a tabela conferivel sem empurrar o rodape
                      da pagina para longe. */}
                  <div className="mt-6 max-h-[32rem] overflow-auto rounded-lg border border-gray-200">
                    <table className="w-full min-w-[34rem] border-collapse text-left">
                      <thead className="sticky top-0 bg-white">
                        <tr className="border-b border-gray-300">
                          <th scope="col" className="px-4 py-3 text-sm font-semibold text-secondary">
                            {memoria.colunas.mes}
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-secondary">
                            {memoria.colunas.variacao}
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-secondary">
                            {memoria.colunas.fator}
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-secondary">
                            {memoria.colunas.valor}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculo.meses.map((linha) => (
                          <tr key={linha.mes} className="border-b border-gray-200 last:border-b-0">
                            <td className="px-4 py-2.5 text-sm tabular-nums text-gray-600">
                              {formatMes(linha.mes)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-sm tabular-nums text-gray-600">
                              {formatPercentual(linha.variacao)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-sm tabular-nums text-gray-600">
                              {formatNumero(linha.fatorAcumulado, 6)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-sm font-medium tabular-nums text-secondary">
                              {formatMoeda(linha.valor)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {indice ? (
              <p className="mt-6 max-w-3xl leading-7 text-gray-600">
                {textoSerie.texto}{" "}
                <Link
                  href={`/conteudos/indicadores/${indice.slug}`}
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  {textoSerie.label.replace("{indice}", rotuloIndice)}
                </Link>
                .
              </p>
            ) : null}
          </>
        )}
      </section>

      <section className="mt-16 border-t border-gray-200 pt-10">
        <h2 className="text-xl font-bold text-secondary">
          {correcaoContent.metodo.title}
        </h2>
        {correcaoContent.metodo.paragraphs.map((paragrafo) => (
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
