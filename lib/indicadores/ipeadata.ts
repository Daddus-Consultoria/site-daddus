/**
 * Cliente do Ipeadata (OData v4).
 *
 *   http://www.ipeadata.gov.br/api/odata4/Metadados
 *   http://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='...')
 *
 * Escolhido em vez do SGS para os indices de precos por um motivo so: ele
 * declara quem produz a serie, a periodicidade e a URL da fonte. IGP-M e da
 * FGV e IPCA e do IBGE — o SGS os redistribui sem dizer isso, e a
 * `docs/DIRETRIZES-UX.md` secao 8 exige a fonte na tela.
 */
import type { IndicatorPoint, IndicatorSourceMetadata } from "./types";

const BASE = "http://www.ipeadata.gov.br/api/odata4";

interface MetadadoRow {
  SERCODIGO: string;
  SERNOME: string | null;
  FNTNOME: string | null;
  FNTSIGLA: string | null;
  FNTURL: string | null;
  SERATUALIZACAO: string | null;
  SERSTATUS: string | null;
}

interface ValorRow {
  VALDATA: string | null;
  VALVALOR: number | null;
}

const pedir = async <T>(caminho: string): Promise<T[]> => {
  const response = await fetch(`${BASE}/${caminho}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Ipeadata respondeu ${response.status} em ${caminho}`);
  }

  const corpo = (await response.json()) as { value?: T[] };

  return corpo.value ?? [];
};

/**
 * Metadados declarados pela origem. Sao regravados no banco a cada coleta: se
 * o Ipea corrigir o nome ou a URL da serie, o site acompanha sem deploy.
 */
export const fetchIpeadataMetadata = async (
  code: string
): Promise<IndicatorSourceMetadata | null> => {
  const linhas = await pedir<MetadadoRow>(`Metadados('${code}')`);
  const linha = linhas[0];

  if (!linha) return null;

  return {
    name: linha.SERNOME?.trim() || code,
    // FNTSIGLA e curta e legivel ("FGV/Conj. Econ. - IGP", "IBGE/SNIPC"); a
    // FNTNOME repete a sigla entre parenteses e nao cabe num card.
    producer: linha.FNTSIGLA?.trim() || linha.FNTNOME?.trim() || "",
    methodologyUrl: normalizarUrl(linha.FNTURL),
    lastUpdatedAt: linha.SERATUALIZACAO?.slice(0, 10) ?? null,
  };
};

/**
 * Parte das URLs de fonte vem sem esquema ("www.ibge.gov.br"), e um href assim
 * seria lido como caminho relativo e levaria o visitante para dentro do site.
 */
const normalizarUrl = (valor: string | null): string | null => {
  const url = valor?.trim();

  if (!url) return null;

  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

/**
 * Le a serie inteira. Nao ha coleta incremental aqui de proposito: as series
 * mensais tem poucas centenas de pontos, e reler tudo faz a revisao
 * retroativa — comum em indice de preco — chegar ao banco sozinha.
 */
export const fetchIpeadataSeries = async (
  code: string
): Promise<IndicatorPoint[]> => {
  const linhas = await pedir<ValorRow>(`ValoresSerie(SERCODIGO='${code}')`);

  return linhas.flatMap((linha) => {
    if (linha.VALDATA === null || linha.VALVALOR === null) return [];

    return [
      {
        // VALDATA vem com fuso ("2026-07-01T00:00:00-03:00"). Cortar em 10
        // preserva o dia publicado; converter para Date o deslocaria para o
        // dia anterior sempre que o runner rodar em UTC.
        referenceDate: linha.VALDATA.slice(0, 10),
        referenceEnd: null,
        value: linha.VALVALOR,
      },
    ];
  });
};
