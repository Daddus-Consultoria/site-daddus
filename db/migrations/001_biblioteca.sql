-- Biblioteca Daddus — camada de descoberta sobre metadados de fontes externas.
--
-- O documento em si continua hospedado na origem: aqui guardamos metadados,
-- resumo, classificacao e a URL original. Ver docs/BIBLIOTECA.md.

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Busca sem acento: quem procura "economia publica" precisa achar
-- "Economia Pública". A configuracao e fixa e nomeada porque colunas geradas
-- so aceitam to_tsvector com regconfig constante.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_ts_config WHERE cfgname = 'portuguese_unaccent') THEN
    CREATE TEXT SEARCH CONFIGURATION portuguese_unaccent (COPY = portuguese);
    ALTER TEXT SEARCH CONFIGURATION portuguese_unaccent
      ALTER MAPPING FOR hword, hword_part, word WITH unaccent, portuguese_stem;
  END IF;
END
$$;

-- array_to_string e declarada STABLE (o tipo do elemento poderia ter saida
-- instavel), e coluna gerada so aceita expressao IMMUTABLE. Para text[] a
-- operacao e de fato imutavel, entao declaramos o wrapper como tal.
CREATE OR REPLACE FUNCTION library_join_text(arr TEXT[])
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $fn$
  SELECT coalesce(array_to_string(arr, ' '), '')
$fn$;

-- ---------------------------------------------------------------------------
-- Fontes
-- ---------------------------------------------------------------------------
-- Cada fonte descreve como coletar, com que frequencia e onde parou. A coleta
-- incremental usa last_datestamp como `from` do OAI-PMH, para nao varrer o
-- repositorio inteiro toda semana.
CREATE TABLE IF NOT EXISTS library_sources (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  institution      TEXT,
  site_url         TEXT,
  protocol         TEXT NOT NULL DEFAULT 'oai-pmh' CHECK (protocol IN ('oai-pmh', 'api', 'manual')),
  endpoint         TEXT,
  metadata_prefix  TEXT NOT NULL DEFAULT 'oai_dc',
  set_spec         TEXT,
  frequency        TEXT NOT NULL DEFAULT 'semanal' CHECK (frequency IN ('diaria', 'semanal', 'mensal')),
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  last_datestamp   TEXT,
  last_harvest_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Documentos
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_documents (
  id               BIGSERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,

  title            TEXT NOT NULL,
  subtitle         TEXT,
  authors          TEXT[] NOT NULL DEFAULT '{}',
  institution      TEXT,
  publisher        TEXT,
  year             INTEGER,
  document_type    TEXT NOT NULL DEFAULT 'outro' CHECK (document_type IN (
                     'livro', 'e-book', 'tese', 'dissertacao', 'artigo', 'relatorio',
                     'nota-tecnica', 'estudo', 'guia', 'manual', 'monografia',
                     'documento-institucional', 'dados', 'outro')),
  abstract         TEXT,
  keywords         TEXT[] NOT NULL DEFAULT '{}',
  language         TEXT NOT NULL DEFAULT 'pt' CHECK (language IN ('pt', 'en', 'es', 'outro')),

  -- Fonte canonica do registro. As demais origens do mesmo documento ficam em
  -- library_document_origins.
  source_id        INTEGER NOT NULL REFERENCES library_sources(id) ON DELETE CASCADE,
  source_url       TEXT NOT NULL,
  doi              TEXT,
  identifier       TEXT,

  license          TEXT,
  open_access      BOOLEAN NOT NULL DEFAULT FALSE,
  access_type      TEXT NOT NULL DEFAULT 'nao-informado' CHECK (access_type IN (
                     'acesso-aberto', 'leitura-gratuita', 'emprestimo-digital',
                     'acesso-restrito', 'nao-informado')),

  country          TEXT,
  state            TEXT,
  municipality     TEXT,
  coverage         TEXT,

  -- Curadoria Daddus: discreta e tecnica, nunca promocional.
  curated          BOOLEAN NOT NULL DEFAULT FALSE,
  curator_note     TEXT,
  curator_reason   TEXT,
  curated_at       TIMESTAMPTZ,

  -- Chave de consolidacao: DOI normalizado > identificador do repositorio >
  -- titulo+autor+ano. E o que impede o mesmo estudo de aparecer tres vezes
  -- quando estiver em BDTD, OASISBR e no repositorio da universidade.
  dedupe_key       TEXT NOT NULL UNIQUE,

  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ,

  -- Peso: titulo acima de autor/palavra-chave, e o resumo por ultimo. Sem isso
  -- um termo citado de passagem no resumo empata com o titulo do documento.
  search_vector    tsvector GENERATED ALWAYS AS (
      setweight(to_tsvector('portuguese_unaccent', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('portuguese_unaccent', coalesce(subtitle, '')), 'B') ||
      setweight(to_tsvector('portuguese_unaccent', library_join_text(authors)), 'B') ||
      setweight(to_tsvector('portuguese_unaccent', library_join_text(keywords)), 'B') ||
      setweight(to_tsvector('portuguese_unaccent', coalesce(institution, '')), 'C') ||
      setweight(to_tsvector('portuguese_unaccent', coalesce(abstract, '')), 'D')
    ) STORED
);

CREATE INDEX IF NOT EXISTS library_documents_search_idx ON library_documents USING GIN (search_vector);
-- Tolerancia a erro de digitacao no titulo, usada quando a busca textual nao
-- devolve nada ("modelagem economico financiera").
CREATE INDEX IF NOT EXISTS library_documents_title_trgm_idx ON library_documents USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS library_documents_keywords_idx ON library_documents USING GIN (keywords);
CREATE INDEX IF NOT EXISTS library_documents_year_idx ON library_documents (year DESC);
CREATE INDEX IF NOT EXISTS library_documents_type_idx ON library_documents (document_type);
CREATE INDEX IF NOT EXISTS library_documents_source_idx ON library_documents (source_id);
CREATE INDEX IF NOT EXISTS library_documents_curated_idx ON library_documents (curated) WHERE curated;

-- ---------------------------------------------------------------------------
-- Origens (o mesmo documento em mais de uma fonte)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_document_origins (
  id                   BIGSERIAL PRIMARY KEY,
  document_id          BIGINT NOT NULL REFERENCES library_documents(id) ON DELETE CASCADE,
  source_id            INTEGER NOT NULL REFERENCES library_sources(id) ON DELETE CASCADE,
  external_identifier  TEXT NOT NULL,
  url                  TEXT,
  harvested_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_id, external_identifier)
);

CREATE INDEX IF NOT EXISTS library_document_origins_document_idx ON library_document_origins (document_id);

-- ---------------------------------------------------------------------------
-- Temas — configuraveis pelo administrador, nunca fixos no codigo
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_topics (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  position    INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  -- Sistema do ecossistema sugerido em documentos deste tema (compasso, opus,
  -- prisma, atlas). Alimenta a recomendacao contextual, que e discreta.
  system_slug TEXT
);

-- Regras que ligam um documento a um tema. Ficam no banco para que a equipe
-- ajuste a classificacao sem depender de deploy.
CREATE TABLE IF NOT EXISTS library_topic_rules (
  id       SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES library_topics(id) ON DELETE CASCADE,
  term     TEXT NOT NULL,
  UNIQUE (topic_id, term)
);

CREATE TABLE IF NOT EXISTS library_document_topics (
  document_id BIGINT NOT NULL REFERENCES library_documents(id) ON DELETE CASCADE,
  topic_id    INTEGER NOT NULL REFERENCES library_topics(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, topic_id)
);

CREATE INDEX IF NOT EXISTS library_document_topics_topic_idx ON library_document_topics (topic_id);

-- ---------------------------------------------------------------------------
-- Log de coletas
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_harvests (
  id            BIGSERIAL PRIMARY KEY,
  source_id     INTEGER NOT NULL REFERENCES library_sources(id) ON DELETE CASCADE,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at   TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'executando' CHECK (status IN ('executando', 'concluida', 'falhou')),
  records_seen  INTEGER NOT NULL DEFAULT 0,
  records_new   INTEGER NOT NULL DEFAULT 0,
  records_upd   INTEGER NOT NULL DEFAULT 0,
  records_skip  INTEGER NOT NULL DEFAULT 0,
  error_message TEXT
);
