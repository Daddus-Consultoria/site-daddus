import { getIndicatorDetail, getIndicatorFullSeries } from "@/lib/indicadores/queries";

/**
 * Download da serie completa de um indicador.
 *
 * Rota propria em vez de gerar o arquivo no cliente: a serie do dolar tem ~10
 * mil linhas, e monta-la no navegador exigiria mandar todos os pontos para a
 * pagina — que hoje carrega 360. Aqui o arquivo so existe para quem clica.
 *
 * O formato mira o Excel em portugues, que e onde esse arquivo costuma ser
 * aberto: separador `;`, decimal com virgula e BOM no inicio (sem ele, o Excel
 * le UTF-8 como Latin-1 e "Índice" vira "Ãndice"). A data fica em ISO, que
 * ordena corretamente como texto e nao depende da configuracao regional.
 */
export const revalidate = 3600;

/** Uma celula segura de CSV: aspas dobradas e o campo entre aspas se precisar. */
const celula = (valor: string): string =>
  /[;"\n\r]/.test(valor) ? `"${valor.replace(/"/g, '""')}"` : valor;

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const indicador = await getIndicatorDetail(params.slug);

  if (!indicador) {
    return new Response("Indicador não encontrado.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const serie = await getIndicatorFullSeries(params.slug);

  const cabecalho = [
    `# ${indicador.name}`,
    `# Apurado por: ${indicador.producer}${
      indicador.producerDetail && indicador.producerDetail !== indicador.producer
        ? ` (${indicador.producerDetail})`
        : ""
    }`,
    `# Lido em: ${indicador.sourceName} · código ${indicador.externalId}`,
    `# Unidade: ${indicador.unit} · periodicidade: ${indicador.frequency}`,
    // O aviso vai no arquivo, e nao so na pagina: o CSV circula solto por
    // e-mail e planilha, longe do contexto que a tela dava.
    "# Republicado pela Daddus sem conversão nem recálculo. Valores como a origem os publicou.",
    indicador.methodologyUrl ? `# Metodologia: ${indicador.methodologyUrl}` : null,
  ].filter(Boolean) as string[];

  const linhas = [
    ...cabecalho,
    ["data_referencia", "fim_referencia", "valor"].join(";"),
    ...serie.map((ponto) =>
      [
        celula(ponto.date),
        celula(ponto.end ?? ""),
        // Virgula decimal, como o Excel pt-BR espera. Sem casas fixas: o valor
        // sai com a precisao que o banco guarda, que e a que a origem publicou.
        celula(String(ponto.value).replace(".", ",")),
      ].join(";")
    ),
  ];

  return new Response(`﻿${linhas.join("\r\n")}\r\n`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${indicador.slug}-daddus.csv"`,
    },
  });
}
