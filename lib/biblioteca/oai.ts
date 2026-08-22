import { XMLParser } from "fast-xml-parser";

/**
 * Cliente OAI-PMH — o protocolo oficial de exposicao de metadados dos
 * repositorios academicos. E o caminho preferido pela spec: nada de scraping.
 */

export interface OaiRecord {
  identifier: string;
  datestamp: string;
  deleted: boolean;
  sets: string[];
  /** Campos Dublin Core, sempre como lista (o mesmo campo se repete no padrao). */
  fields: Record<string, string[]>;
}

interface HarvestOptions {
  endpoint: string;
  metadataPrefix?: string;
  set?: string | null;
  /** Coleta incremental: so registros alterados a partir desta data. */
  from?: string | null;
  /** Teto de registros — usado em teste e em coleta parcial. */
  limit?: number;
  onProgress?: (seen: number, total: number | null) => void;
}

const USER_AGENT =
  "BibliotecaDaddus/1.0 (+https://www.daddusconsultoria.com; contato@daddusconsultoria.com)";

const REQUEST_TIMEOUT_MS = 60_000;
const MAX_RETRIES = 4;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
  removeNSPrefix: true,
  trimValues: true,
  // Campos Dublin Core se repetem (varios dc:title, varios dc:subject). Sem
  // isso o parser entrega ora string, ora array, e o normalizador vira um
  // emaranhado de checagem de tipo.
  isArray: (name, _path, isLeaf) =>
    isLeaf ? !["responseDate", "request"].includes(name) : ["record", "setSpec"].includes(name),
});

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const asList = <T>(value: T | T[] | undefined): T[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

/** Texto de um no que pode vir como string, numero ou objeto com atributos. */
const asText = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    const text = (value as Record<string, unknown>)["#text"];

    return text === undefined ? "" : String(text).trim();
  }

  return String(value).trim();
};

/**
 * Primeiro valor de um no. O parser entrega folhas como lista (campos Dublin
 * Core se repetem), e isso vale tambem para identifier e datestamp do header —
 * ler o no direto devolveria vazio.
 */
const firstText = (value: unknown): string => asText(asList(value as never)[0]);

const fetchWithRetry = async (url: string): Promise<string> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/xml" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      // 503 com Retry-After e o jeito padrao de um repositorio pedir calma.
      // Insistir mais rapido do que ele pediu so faz a coleta ser bloqueada.
      if (response.status === 503) {
        const retryAfter = Number(response.headers.get("retry-after")) || 10;
        await sleep(Math.min(retryAfter, 60) * 1000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} em ${url}`);
      }

      return await response.text();
    } catch (error) {
      lastError = error;
      await sleep(2 ** attempt * 1000);
    }
  }

  throw new Error(
    `Falha ao consultar ${url} apos ${MAX_RETRIES} tentativas: ${String(lastError)}`
  );
};

const buildUrl = (endpoint: string, params: Record<string, string>) => {
  const url = new URL(endpoint);

  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  return url.toString();
};

const toRecord = (raw: any): OaiRecord => {
  const header = raw?.header ?? {};
  const metadata = raw?.metadata?.dc ?? {};
  const fields: Record<string, string[]> = {};

  Object.entries(metadata).forEach(([key, value]) => {
    if (key.startsWith("@")) return;

    const values = asList(value as unknown)
      .map(asText)
      .filter(Boolean);

    if (values.length) fields[key] = values;
  });

  return {
    identifier: firstText(header.identifier),
    datestamp: firstText(header.datestamp),
    deleted: asText(header["@status"]) === "deleted",
    sets: asList(header.setSpec).map(asText).filter(Boolean),
    fields,
  };
};

/**
 * Percorre o repositorio inteiro seguindo o resumptionToken. Devolve os
 * registros aos poucos para que a coleta grave conforme avanca — 14 mil
 * registros nao precisam caber na memoria de uma vez.
 */
export async function* harvestOai(
  options: HarvestOptions
): AsyncGenerator<OaiRecord> {
  const { endpoint, metadataPrefix = "oai_dc", set, from, limit, onProgress } = options;

  let token: string | null = null;
  let seen = 0;
  let total: number | null = null;

  do {
    const params: Record<string, string> = token
      ? { verb: "ListRecords", resumptionToken: token }
      : {
          verb: "ListRecords",
          metadataPrefix,
          ...(set ? { set } : {}),
          ...(from ? { from } : {}),
        };

    const xml = await fetchWithRetry(buildUrl(endpoint, params));
    const parsed = parser.parse(xml);
    const error = parsed?.["OAI-PMH"]?.error;

    if (error) {
      const code = asText(asList(error)[0]?.["@code"] ?? "");

      // Coleta incremental sem novidade responde noRecordsMatch — e sucesso,
      // nao falha.
      if (code === "noRecordsMatch") return;

      throw new Error(`OAI-PMH respondeu erro "${code}": ${asText(asList(error)[0])}`);
    }

    const list = parsed?.["OAI-PMH"]?.ListRecords;
    const records = asList(list?.record);

    for (const raw of records) {
      yield toRecord(raw);
      seen += 1;

      if (limit && seen >= limit) return;
    }

    const resumption = asList(list?.resumptionToken)[0];
    const nextToken = asText(resumption);
    const completeListSize = Number(resumption?.["@completeListSize"]);

    if (!Number.isNaN(completeListSize) && completeListSize > 0) {
      total = completeListSize;
    }

    onProgress?.(seen, total);

    token = nextToken || null;
  } while (token);
}
