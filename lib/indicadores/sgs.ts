/**
 * Cliente do SGS — Sistema Gerenciador de Series Temporais do Banco Central.
 *
 *   https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo}/dados
 *
 * Aberto, sem chave e sem limite declarado de requisicoes. Devolve apenas
 * `{ data, valor }` — nao ha endpoint de metadados, entao nome, produtor e
 * metodologia da serie vem da semente (conferidos no portal de dados abertos
 * do BCB), e nao daqui.
 */
import type { IndicatorPoint } from "./types";

const BASE = "https://api.bcb.gov.br/dados/serie";

/**
 * Series diarias so podem ser consultadas em janelas de ate 10 anos, e sem
 * intervalo nenhum a API recusa com 406. Buscamos 9 anos por vez para nao
 * depender de como o BCB arredonda o limite.
 */
const JANELA_ANOS = 9;

/** A API fala e entende DD/MM/AAAA; o banco e o resto do codigo, ISO. */
const paraBR = (iso: string) => {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
};

const paraISO = (br: string) => {
  const [dia, mes, ano] = br.split("/");
  return `${ano}-${mes}-${dia}`;
};

interface SgsPoint {
  data: string;
  dataFim?: string;
  valor: string;
}

/**
 * Sob rajada de requisicoes o SGS as vezes devolve uma pagina de erro em HTML
 * com status 200, em vez de JSON. E intermitente: a mesma janela responde na
 * tentativa seguinte. Como a coleta roda sozinha por cron, desistir na primeira
 * ocorrencia derrubaria a rotina por um erro que se resolve esperando.
 */
const TENTATIVAS = 3;
const ESPERA_MS = 1500;

const espera = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const buscarJanela = async (
  code: string,
  from: string | null,
  to: string | null
): Promise<SgsPoint[]> => {
  const params = new URLSearchParams({ formato: "json" });
  if (from) params.set("dataInicial", paraBR(from));
  if (to) params.set("dataFinal", paraBR(to));

  const url = `${BASE}/bcdata.sgs.${code}/dados?${params}`;
  let ultimoErro = "";

  for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa += 1) {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    // Intervalo sem nenhum dado devolve 404 — que aqui e resposta valida, e
    // nao erro: a serie simplesmente comeca depois da janela consultada.
    if (response.status === 404) return [];

    const texto = await response.text();

    if (!response.ok) {
      // 406 e a recusa por janela maior que 10 anos em serie diaria; e erro de
      // montagem da consulta e nao melhora com retentativa.
      if (response.status === 406) {
        throw new Error(`SGS ${code} recusou a janela: ${texto.slice(0, 200)}`);
      }

      ultimoErro = `status ${response.status}`;
    } else {
      try {
        return JSON.parse(texto) as SgsPoint[];
      } catch {
        ultimoErro = `resposta nao-JSON (${texto.slice(0, 80).replace(/\s+/g, " ")})`;
      }
    }

    if (tentativa < TENTATIVAS) await espera(ESPERA_MS * tentativa);
  }

  throw new Error(
    `SGS ${code} falhou em ${TENTATIVAS} tentativas na janela ${from ?? "inicio"}..${to ?? "hoje"} — ${ultimoErro}`
  );
};

/**
 * Le a serie inteira a partir de `from` (exclusive na pratica: o ponto
 * repetido e sobrescrito pelo upsert, o que corrige revisao da origem).
 *
 * `from` nulo significa desde o inicio da serie. Como nao sabemos quando ela
 * comeca e a janela diaria e limitada, varremos de `desde` ate hoje em fatias.
 */
export const fetchSgsSeries = async ({
  code,
  from,
  desde = "1980-01-01",
}: {
  code: string;
  from: string | null;
  desde?: string;
}): Promise<IndicatorPoint[]> => {
  const hoje = new Date().toISOString().slice(0, 10);
  const inicio = from ?? desde;

  const pontos: IndicatorPoint[] = [];
  let cursor = inicio;

  while (cursor <= hoje) {
    const fim = new Date(cursor);
    fim.setFullYear(fim.getFullYear() + JANELA_ANOS);
    const fimISO = fim.toISOString().slice(0, 10);
    const janelaFim = fimISO > hoje ? hoje : fimISO;

    const bruto = await buscarJanela(code, cursor, janelaFim);

    bruto.forEach((ponto) => {
      const valor = Number(ponto.valor);
      // Serie do BCB traz lacuna como string vazia. Guardar NaN poluiria a
      // media e o grafico; melhor a serie ter buraco onde a origem tem buraco.
      if (!ponto.valor || Number.isNaN(valor)) return;

      pontos.push({
        referenceDate: paraISO(ponto.data),
        referenceEnd: ponto.dataFim ? paraISO(ponto.dataFim) : null,
        value: valor,
      });
    });

    if (janelaFim === hoje) break;

    // Um dia adiante para nao repetir a fronteira da janela anterior.
    const proximo = new Date(janelaFim);
    proximo.setDate(proximo.getDate() + 1);
    cursor = proximo.toISOString().slice(0, 10);
  }

  return pontos;
};
