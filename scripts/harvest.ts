/**
 * Coleta de metadados da Biblioteca Daddus.
 *
 *   yarn harvest ipea                # coleta incremental da fonte
 *   yarn harvest ipea --full         # ignora o ponto de parada e recomeca
 *   yarn harvest ipea --limit=200    # amostra, para conferir normalizacao
 *   yarn harvest --frequency=semanal # todas as fontes com essa periodicidade
 *
 * A coleta e incremental por padrao: o `from` do OAI-PMH usa o datestamp da
 * ultima execucao, entao a rotina semanal traz so o que mudou.
 */
import type { PoolClient } from "pg";

import { getPool } from "../lib/db/pool";
import { harvestOai } from "../lib/biblioteca/oai";
import { deaccent, normalizeOaiRecord } from "../lib/biblioteca/normalize";

interface SourceRow {
  id: number;
  slug: string;
  name: string;
  institution: string | null;
  site_url: string | null;
  endpoint: string | null;
  metadata_prefix: string;
  set_spec: string | null;
  last_datestamp: string | null;
}

interface TopicRule {
  topicId: number;
  term: string;
  matcher: RegExp;
}

const COMMIT_EVERY = 200;

const parseArgs = () => {
  const args = process.argv.slice(2);
  const flags = new Map<string, string>();
  const positional: string[] = [];

  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value = "true"] = arg.slice(2).split("=");
      flags.set(key, value);
    } else {
      positional.push(arg);
    }
  });

  return {
    sourceSlug: positional[0] ?? null,
    full: flags.get("full") === "true",
    limit: flags.has("limit") ? Number(flags.get("limit")) : undefined,
    frequency: flags.get("frequency") ?? null,
  };
};

const loadSources = async (
  client: PoolClient,
  sourceSlug: string | null,
  frequency: string | null
): Promise<SourceRow[]> => {
  if (sourceSlug) {
    const { rows } = await client.query<SourceRow>(
      "SELECT * FROM library_sources WHERE slug = $1",
      [sourceSlug]
    );

    if (!rows.length) throw new Error(`Fonte "${sourceSlug}" nao cadastrada.`);

    return rows;
  }

  const { rows } = await client.query<SourceRow>(
    `SELECT * FROM library_sources
      WHERE active AND protocol = 'oai-pmh' AND ($1::text IS NULL OR frequency = $1)
      ORDER BY id`,
    [frequency]
  );

  return rows;
};

/**
 * As regras de tema ficam no banco justamente para a equipe ajustar sem
 * deploy; sao carregadas uma vez por execucao e aplicadas em memoria.
 */
const loadTopicRules = async (client: PoolClient): Promise<TopicRule[]> => {
  const { rows } = await client.query<{ topic_id: number; term: string }>(
    `SELECT r.topic_id, r.term
       FROM library_topic_rules r
       JOIN library_topics t ON t.id = r.topic_id
      WHERE t.active`
  );

  return rows.map(({ topic_id, term }) => ({
    topicId: topic_id,
    term,
    // Limite de palavra nas pontas: sem isso "ppp" casaria dentro de outra
    // palavra e "dados" casaria em "cuidados".
    matcher: new RegExp(`(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(s)?([^a-z0-9]|$)`, "i"),
  }));
};

const classify = (
  rules: TopicRule[],
  haystack: string
): number[] => {
  const found = new Set<number>();

  rules.forEach((rule) => {
    if (rule.matcher.test(haystack)) found.add(rule.topicId);
  });

  return Array.from(found);
};

const run = async () => {
  const { sourceSlug, full, limit, frequency } = parseArgs();
  const pool = getPool();
  const client = await pool.connect();

  try {
    const sources = await loadSources(client, sourceSlug, frequency);
    const rules = await loadTopicRules(client);

    if (!sources.length) {
      console.log("Nenhuma fonte a coletar.");
      return;
    }

    for (const source of sources) {
      if (!source.endpoint) {
        console.log(`${source.slug}: sem endpoint, ignorada.`);
        continue;
      }

      const from = full ? null : source.last_datestamp;
      const { rows: harvestRows } = await client.query<{ id: number }>(
        "INSERT INTO library_harvests (source_id) VALUES ($1) RETURNING id",
        [source.id]
      );
      const harvestId = harvestRows[0].id;

      console.log(
        `\n${source.name} — ${from ? `incremental desde ${from}` : "coleta completa"}`
      );

      let seen = 0;
      let created = 0;
      let updated = 0;
      let skipped = 0;
      let latestDatestamp = source.last_datestamp;

      await client.query("BEGIN");

      try {
        for await (const record of harvestOai({
          endpoint: source.endpoint,
          metadataPrefix: source.metadata_prefix,
          set: source.set_spec,
          from,
          limit,
          onProgress: (count, total) =>
            console.log(`  ${count}${total ? `/${total}` : ""} registros lidos`),
        })) {
          seen += 1;

          if (!latestDatestamp || record.datestamp > latestDatestamp) {
            latestDatestamp = record.datestamp;
          }

          // O identificador OAI e a chave da origem; sem ele, todos os
          // registros colidiriam na mesma linha e a consolidacao entre fontes
          // deixaria de existir. Melhor pular e contar.
          if (!record.identifier) {
            skipped += 1;
            continue;
          }

          if (record.deleted) {
            // Some a origem; o documento so cai quando nao sobra nenhuma fonte
            // apontando para ele.
            await client.query(
              `DELETE FROM library_document_origins
                WHERE source_id = $1 AND external_identifier = $2`,
              [source.id, record.identifier]
            );
            await client.query(
              `DELETE FROM library_documents d
                WHERE NOT EXISTS (
                  SELECT 1 FROM library_document_origins o WHERE o.document_id = d.id
                )`
            );
            skipped += 1;
            continue;
          }

          const doc = normalizeOaiRecord(record, {
            slug: source.slug,
            institution: source.institution,
            siteUrl: source.site_url,
          });

          if (!doc) {
            skipped += 1;
            continue;
          }

          const { rows } = await client.query<{ id: number; inserted: boolean }>(
            `INSERT INTO library_documents (
               slug, title, subtitle, authors, institution, publisher, year,
               document_type, abstract, keywords, language, source_id, source_url,
               doi, identifier, license, open_access, access_type, country, state,
               municipality, coverage, dedupe_key, last_verified_at
             ) VALUES (
               $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23, NOW()
             )
             ON CONFLICT (dedupe_key) DO UPDATE SET
               title = EXCLUDED.title,
               subtitle = EXCLUDED.subtitle,
               authors = EXCLUDED.authors,
               institution = COALESCE(EXCLUDED.institution, library_documents.institution),
               publisher = COALESCE(EXCLUDED.publisher, library_documents.publisher),
               year = COALESCE(EXCLUDED.year, library_documents.year),
               document_type = CASE
                 WHEN library_documents.document_type = 'outro' THEN EXCLUDED.document_type
                 ELSE library_documents.document_type END,
               abstract = COALESCE(EXCLUDED.abstract, library_documents.abstract),
               keywords = EXCLUDED.keywords,
               language = EXCLUDED.language,
               license = COALESCE(EXCLUDED.license, library_documents.license),
               open_access = library_documents.open_access OR EXCLUDED.open_access,
               access_type = CASE
                 WHEN library_documents.access_type = 'nao-informado' THEN EXCLUDED.access_type
                 ELSE library_documents.access_type END,
               country = COALESCE(EXCLUDED.country, library_documents.country),
               state = COALESCE(EXCLUDED.state, library_documents.state),
               coverage = COALESCE(EXCLUDED.coverage, library_documents.coverage),
               updated_at = NOW(),
               last_verified_at = NOW()
             RETURNING id, (xmax = 0) AS inserted`,
            [
              doc.slug, doc.title, doc.subtitle, doc.authors, doc.institution,
              doc.publisher, doc.year, doc.documentType, doc.abstract, doc.keywords,
              doc.language, source.id, doc.sourceUrl, doc.doi, doc.identifier,
              doc.license, doc.openAccess, doc.access, doc.country, doc.state,
              doc.municipality, doc.coverage, doc.dedupeKey,
            ]
          );

          const documentId = rows[0].id;
          rows[0].inserted ? (created += 1) : (updated += 1);

          await client.query(
            `INSERT INTO library_document_origins (document_id, source_id, external_identifier, url)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (source_id, external_identifier)
             DO UPDATE SET document_id = EXCLUDED.document_id,
                           url = EXCLUDED.url,
                           harvested_at = NOW()`,
            [documentId, source.id, record.identifier, doc.sourceUrl]
          );

          const haystack = deaccent(
            [doc.title, doc.subtitle, doc.keywords.join(" "), doc.abstract]
              .filter(Boolean)
              .join(" ")
          ).toLowerCase();
          const topicIds = classify(rules, haystack);

          await client.query(
            "DELETE FROM library_document_topics WHERE document_id = $1",
            [documentId]
          );

          if (topicIds.length) {
            await client.query(
              `INSERT INTO library_document_topics (document_id, topic_id)
               SELECT $1, unnest($2::int[]) ON CONFLICT DO NOTHING`,
              [documentId, topicIds]
            );
          }

          if (seen % COMMIT_EVERY === 0) {
            await client.query("COMMIT");
            await client.query("BEGIN");
          }
        }

        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        await client.query(
          `UPDATE library_harvests
              SET status = 'falhou', finished_at = NOW(), error_message = $2,
                  records_seen = $3, records_new = $4, records_upd = $5, records_skip = $6
            WHERE id = $1`,
          [harvestId, String(error), seen, created, updated, skipped]
        );
        throw error;
      }

      await client.query(
        `UPDATE library_sources
            SET last_datestamp = COALESCE($2, last_datestamp), last_harvest_at = NOW()
          WHERE id = $1`,
        // Numa coleta parcial (--limit) o ponto de parada nao pode avancar: o
        // resto do repositorio ainda nao foi lido.
        [source.id, limit ? source.last_datestamp : latestDatestamp]
      );

      await client.query(
        `UPDATE library_harvests
            SET status = 'concluida', finished_at = NOW(),
                records_seen = $2, records_new = $3, records_upd = $4, records_skip = $5
          WHERE id = $1`,
        [harvestId, seen, created, updated, skipped]
      );

      console.log(
        `  ${seen} lidos · ${created} novos · ${updated} atualizados · ${skipped} ignorados`
      );
    }
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
