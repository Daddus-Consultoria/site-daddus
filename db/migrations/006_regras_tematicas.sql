-- Correcao das regras de classificacao tematica.
--
-- Medido no acervo: a Revista do Servico Publico, que e 100% administracao
-- publica, tinha 68,2% de pertinencia. Entre os artigos sem tema nenhum
-- estavam "O Estado, a administracao e os servicos publicos no mundo
-- democratico" e "A concepcao moderna de democracia e o primado do direito
-- administrativo". No outro extremo, "Gestao Municipal" abrigava tese sobre
-- aleitamento materno.
--
-- Duas causas distintas.
--
-- 1. PLURAL DE EXPRESSAO COMPOSTA. O casamento aceita um "s" opcional no fim
--    do termo inteiro, entao "servico publico" nao encontra "servicos
--    publicos" — o plural esta na primeira palavra tambem. Onde alguem lembrou
--    do problema, as duas formas foram cadastradas ("concessao" e
--    "concessoes"); onde nao, o tema simplesmente nao pegava.
--
-- 2. TERMO GENERICO DEMAIS. "municipal", sozinho, casa com "escola municipal"
--    e "rede publica municipal" — e assim qualquer trabalho sobre uma escola
--    entrava em gestao municipal. Sai o termo solto, entram as expressoes que
--    de fato falam do poder publico municipal.
--
-- Depois de aplicar: yarn biblioteca:reclassificar --simular (mede sem gravar).

-- 1. Plurais que faltavam.
INSERT INTO library_topic_rules (topic_id, term)
SELECT t.id, termo
  FROM library_topics t
  JOIN LATERAL (VALUES
    ('gestao-publica',        'servicos publicos'),
    ('gestao-publica',        'setores publicos'),
    ('administracao-publica', 'servidores publicos'),
    ('financas-publicas',     'gastos publicos'),
    ('compras-publicas',      'licitacoes'),
    ('compras-publicas',      'contratacoes publicas'),
    ('compras-publicas',      'pregoes'),
    ('politicas-publicas',    'programas sociais')
  ) AS regra(slug, termo) ON regra.slug = t.slug
ON CONFLICT (topic_id, term) DO NOTHING;

-- 2. Vocabulario que faltava em administracao publica — o campo tem nome
--    proprio para varias coisas, e o tema so conhecia tres.
INSERT INTO library_topic_rules (topic_id, term)
SELECT t.id, termo
  FROM library_topics t
  JOIN LATERAL (VALUES
    ('direito administrativo'),
    ('reforma administrativa'),
    ('funcionalismo'),
    ('carreira publica'),
    ('concurso publico'),
    ('agencia reguladora'),
    ('agencias reguladoras')
  ) AS regra(termo) ON t.slug = 'administracao-publica'
ON CONFLICT (topic_id, term) DO NOTHING;

-- 3. Gestao municipal: sai o termo solto, entram as expressoes com contexto.
DELETE FROM library_topic_rules r
 USING library_topics t
 WHERE t.id = r.topic_id AND t.slug = 'gestao-municipal' AND r.term = 'municipal';

INSERT INTO library_topic_rules (topic_id, term)
SELECT t.id, termo
  FROM library_topics t
  JOIN LATERAL (VALUES
    ('gestao municipal'),
    ('administracao municipal'),
    ('governo municipal'),
    ('poder publico municipal'),
    ('secretaria municipal'),
    ('secretarias municipais'),
    ('camara municipal'),
    ('financas municipais'),
    ('consorcio intermunicipal'),
    ('consorcios intermunicipais'),
    -- A expressao nem sempre vem colada: "gestao energetica municipal",
    -- "politica municipal de habitacao". Estas cobrem o adjetivo aplicado ao
    -- que e do poder publico, sem voltar a pegar "escola municipal".
    ('politica municipal'),
    ('politicas municipais'),
    ('tributo municipal'),
    ('tributos municipais'),
    ('receita municipal'),
    ('receitas municipais'),
    ('orcamento municipal'),
    ('orcamentos municipais'),
    ('servico municipal'),
    ('servicos municipais'),
    ('nivel municipal'),
    ('ambito municipal'),
    ('esfera municipal'),
    ('escala municipal'),
    -- Tributos que so existem no municipio.
    ('iptu'),
    ('itbi')
  ) AS regra(termo) ON t.slug = 'gestao-municipal'
ON CONFLICT (topic_id, term) DO NOTHING;

-- 4. Formas que o acervo usa e as regras nao conheciam.
--
-- "orcamento-programa" e "fiscalizacao orcamentaria" escapavam porque o tema
-- so tinha "orcamento publico". Previdencia e seguridade nao tinham tema
-- nenhum, e sao politica publica.
INSERT INTO library_topic_rules (topic_id, term)
SELECT t.id, termo
  FROM library_topics t
  JOIN LATERAL (VALUES
    -- "orcamento" sozinho puxava qualquer mencao a orcamento de qualquer
    -- coisa: politica agricola, economia solidaria. As formas abaixo so
    -- aparecem quando o assunto e financa publica de verdade.
    ('financas-publicas',  'orcamentario'),
    ('financas-publicas',  'orcamentaria'),
    ('financas-publicas',  'arrecadacao'),
    ('financas-publicas',  'plano plurianual'),
    ('financas-publicas',  'ppa'),
    ('financas-publicas',  'ldo'),
    ('financas-publicas',  'despesa publica'),
    ('financas-publicas',  'despesas publicas'),
    ('financas-publicas',  'receita publica'),
    ('financas-publicas',  'receitas publicas'),
    ('politicas-publicas', 'previdencia social'),
    ('politicas-publicas', 'seguridade social'),
    ('politicas-publicas', 'assistencia social')
  ) AS regra(slug, termo) ON regra.slug = t.slug
ON CONFLICT (topic_id, term) DO NOTHING;

-- 5. Ingles, porque periodico publica metadado bilingue.
--
-- Na RAP, "Urban development in Brazil" e "M.R.E innovations" ficavam sem tema
-- nenhum: as 81 regras eram todas em portugues. Entram so os termos centrais —
-- o vocabulario em ingles nao precisa espelhar o portugues inteiro, precisa
-- cobrir o titulo e o resumo que a fonte traduz.
INSERT INTO library_topic_rules (topic_id, term)
SELECT t.id, termo
  FROM library_topics t
  JOIN LATERAL (VALUES
    ('administracao-publica',    'public administration'),
    ('administracao-publica',    'civil service'),
    ('gestao-publica',           'public management'),
    ('gestao-publica',           'public sector'),
    ('gestao-publica',           'public service'),
    ('gestao-publica',           'public services'),
    ('politicas-publicas',       'public policy'),
    ('politicas-publicas',       'public policies'),
    ('financas-publicas',        'public finance'),
    ('financas-publicas',        'public spending'),
    ('financas-publicas',        'public budget'),
    ('compras-publicas',         'public procurement'),
    ('gestao-municipal',         'municipal government'),
    ('gestao-municipal',         'local government'),
    ('planejamento-urbano',      'urban development'),
    ('planejamento-urbano',      'urban planning'),
    ('desenvolvimento-regional', 'regional development'),
    ('desenvolvimento-economico','economic development'),
    ('governanca',               'governance'),
    ('governanca',               'transparency'),
    ('governanca',               'corruption'),
    ('dados',                    'indicators'),
    ('meio-ambiente',            'climate change')
  ) AS regra(slug, termo) ON regra.slug = t.slug
ON CONFLICT (topic_id, term) DO NOTHING;
