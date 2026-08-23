/**
 * Classificacao tematica da Biblioteca.
 *
 * As regras ficam no banco (`library_topic_rules`) justamente para a equipe
 * ajustar sem deploy. Este modulo e a unica implementacao: a coleta classifica
 * o documento que acaba de ler, e `yarn biblioteca:reclassificar` reaplica as
 * mesmas regras ao acervo ja indexado. Duas copias da regra de casamento
 * divergiriam na primeira correcao.
 */
import type { PoolClient } from "pg";

import { deaccent } from "./normalize";

export interface TopicRule {
  topicId: number;
  term: string;
  matcher: RegExp;
}

export const loadTopicRules = async (client: PoolClient): Promise<TopicRule[]> => {
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
    matcher: new RegExp(
      `(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(s)?([^a-z0-9]|$)`,
      "i"
    ),
  }));
};

/**
 * O texto contra o qual as regras sao aplicadas. Titulo, subtitulo, palavras-
 * chave e resumo — nao o texto integral, que a Biblioteca nao guarda.
 */
export const buildHaystack = (parts: {
  title?: string | null;
  subtitle?: string | null;
  keywords?: string[] | null;
  abstract?: string | null;
}): string =>
  deaccent(
    [parts.title, parts.subtitle, (parts.keywords ?? []).join(" "), parts.abstract]
      .filter(Boolean)
      .join(" ")
  ).toLowerCase();

export const classify = (rules: TopicRule[], haystack: string): number[] => {
  const found = new Set<number>();

  rules.forEach((rule) => {
    if (rule.matcher.test(haystack)) found.add(rule.topicId);
  });

  return Array.from(found);
};
