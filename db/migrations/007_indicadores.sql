-- Indicadores Daddus — series historicas de indicadores economicos publicos.
--
-- Mora no mesmo Postgres da Biblioteca (mesma DATABASE_URL) por economia de
-- infraestrutura, mas em tabelas proprias: a Biblioteca guarda metadados de
-- documentos, isto guarda serie temporal. Nao ha relacao entre as duas.
--
-- O que estava no ar antes disto eram duas planilhas Google mantidas na mao,
-- paradas em Out/2021 (IDH) e Mar/2022 (IPCA-15). Ver docs/INDICADORES.md.

-- ---------------------------------------------------------------------------
-- Fontes
-- ---------------------------------------------------------------------------
-- Quem distribui a serie por API. Nao confundir com quem a produz: o IGP-M e
-- da FGV e o IPCA e do IBGE, mas nenhum dos dois publica API aberta propria
-- desses indices — eles chegam aqui redistribuidos. Por isso `producer` fica no
-- indicador, e nao aqui, e a tela mostra o produtor, nao o distribuidor.
CREATE TABLE IF NOT EXISTS indicator_sources (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  site_url         TEXT,
  protocol         TEXT NOT NULL CHECK (protocol IN ('bcb-sgs', 'ipeadata', 'ibge-agregados')),
  endpoint         TEXT NOT NULL,
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Indicadores
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS indicators (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  -- Sigla como o mercado a escreve ("IGP-M"), para caber em tabela e card.
  acronym          TEXT,

  source_id        INTEGER NOT NULL REFERENCES indicator_sources(id) ON DELETE CASCADE,
  -- Identificador da serie na origem: o codigo SGS no Banco Central, o par
  -- agregado/variavel no IBGE.
  external_id      TEXT NOT NULL,

  -- Quem apura o indicador, que e o que a pagina precisa exibir como fonte.
  -- Ver docs/DIRETRIZES-UX.md secao 8: fonte, metodologia e periodicidade sao
  -- obrigatorias em indicadores. Dizer "Banco Central" no IGP-M seria errado.
  --
  -- Sao duas colunas porque as duas coisas sao diferentes: `producer` e o nome
  -- curto que cabe num card ("FGV"), e `producer_detail` e como a origem se
  -- declara ("FGV/Conj. Econ. - IGP"). Guardar so o segundo polui a tela;
  -- guardar so o primeiro joga fora a procedencia que a origem informou.
  producer         TEXT NOT NULL,
  producer_detail  TEXT,
  methodology_url  TEXT,

  category         TEXT NOT NULL CHECK (category IN ('precos', 'juros', 'cambio', 'atividade', 'fiscal')),
  -- Governa a formatacao na interface; nao ha conversao de valor no banco, que
  -- guarda o numero exatamente como a origem publicou.
  unit             TEXT NOT NULL CHECK (unit IN (
                     'percentual', 'percentual-ano', 'percentual-dia',
                     'percentual-pib', 'indice', 'moeda', 'moeda-milhoes')),
  -- Casas decimais na exibicao, quando a unidade sozinha nao basta. Percentual
  -- sai com duas por padrao, mas a rentabilidade da poupanca e divulgada com
  -- quatro (0,6446%) — arredondar para 0,64% publicaria um numero que a origem
  -- nao publicou. NULL usa o padrao da unidade.
  decimals         SMALLINT CHECK (decimals BETWEEN 0 AND 6),
  -- Periodicidade da serie e, por consequencia, da coleta: serie mensal nao
  -- muda entre um dia e outro e nao precisa ser buscada diariamente.
  frequency        TEXT NOT NULL CHECK (frequency IN ('diaria', 'mensal')),

  description      TEXT NOT NULL,
  display_order    INTEGER NOT NULL DEFAULT 100,
  active           BOOLEAN NOT NULL DEFAULT TRUE,

  last_collect_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (source_id, external_id)
);

CREATE INDEX IF NOT EXISTS indicators_categoria_idx
  ON indicators (category, display_order) WHERE active;

-- ---------------------------------------------------------------------------
-- Valores
-- ---------------------------------------------------------------------------
-- Uma linha por periodo de referencia. O valor e NUMERIC, e nao float: taxa de
-- juros e cambio somados em ponto flutuante acumulam erro visivel na terceira
-- casa, que e justamente onde o CDI vive.
CREATE TABLE IF NOT EXISTS indicator_values (
  indicator_id     INTEGER NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
  -- Inicio do periodo. Serie mensal usa o dia 1, como a origem publica.
  reference_date   DATE NOT NULL,
  -- Fim do periodo, quando a origem o informa (TR e poupanca sao apuradas de
  -- data a data, e sem isto o valor ficaria sem intervalo).
  reference_end    DATE,
  value            NUMERIC(18, 6) NOT NULL,
  collected_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (indicator_id, reference_date)
);

CREATE INDEX IF NOT EXISTS indicator_values_serie_idx
  ON indicator_values (indicator_id, reference_date DESC);

-- ---------------------------------------------------------------------------
-- Log de coleta
-- ---------------------------------------------------------------------------
-- Espelha library_harvests: sem registro de execucao, uma serie que parou de
-- atualizar so aparece quando alguem repara no numero velho na tela.
CREATE TABLE IF NOT EXISTS indicator_collections (
  id            BIGSERIAL PRIMARY KEY,
  indicator_id  INTEGER NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at   TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'executando' CHECK (status IN ('executando', 'concluida', 'falhou')),
  values_seen   INTEGER NOT NULL DEFAULT 0,
  values_new    INTEGER NOT NULL DEFAULT 0,
  values_upd    INTEGER NOT NULL DEFAULT 0,
  error_message TEXT
);
