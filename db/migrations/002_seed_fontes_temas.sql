-- Fonte-piloto e vocabulario tematico inicial.
--
-- Os temas ficam aqui apenas como ponto de partida: a partir do primeiro
-- deploy quem manda e a tabela, editavel pela equipe, e nao este arquivo.

INSERT INTO library_sources (slug, name, institution, site_url, protocol, endpoint, metadata_prefix, frequency)
VALUES (
  'ipea',
  'Repositório do Ipea',
  'Instituto de Pesquisa Econômica Aplicada',
  'https://repositorio.ipea.gov.br',
  'oai-pmh',
  'https://repositorio.ipea.gov.br/server/oai/request',
  'oai_dc',
  'semanal'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO library_topics (slug, name, position, system_slug) VALUES
  ('economia',                 'Economia',                   10, NULL),
  ('gestao-publica',           'Gestão Pública',             20, 'compasso'),
  ('politicas-publicas',       'Políticas Públicas',         30, NULL),
  ('ppp',                      'PPP',                        40, 'opus'),
  ('concessoes',               'Concessões',                 50, 'opus'),
  ('modelagem-economica',      'Modelagem Econômica',        60, 'opus'),
  ('infraestrutura',           'Infraestrutura',             70, 'opus'),
  ('mobilidade',               'Mobilidade',                 80, NULL),
  ('transportes',              'Transportes',                90, NULL),
  ('financas-publicas',        'Finanças Públicas',         100, 'atlas'),
  ('planejamento-urbano',      'Planejamento Urbano',       110, NULL),
  ('desenvolvimento-regional', 'Desenvolvimento Regional',  120, 'atlas'),
  ('desenvolvimento-economico','Desenvolvimento Econômico', 130, NULL),
  ('administracao-publica',    'Administração Pública',     140, 'compasso'),
  ('compras-publicas',         'Compras Públicas',          150, 'prisma'),
  ('tecnologia',               'Tecnologia',                160, NULL),
  ('dados',                    'Dados',                     170, 'atlas'),
  ('governanca',               'Governança',                180, 'compasso'),
  ('educacao',                 'Educação',                  190, NULL),
  ('saude',                    'Saúde',                     200, NULL),
  ('meio-ambiente',            'Meio Ambiente',             210, NULL),
  ('gestao-municipal',         'Gestão Municipal',          220, 'atlas')
ON CONFLICT (slug) DO NOTHING;

-- Regras de classificacao. O termo e comparado sem acento e sem caixa contra
-- palavras-chave, titulo e resumo do documento.
INSERT INTO library_topic_rules (topic_id, term)
SELECT t.id, r.term
FROM (VALUES
  ('economia', 'economia'), ('economia', 'economico'), ('economia', 'macroeconomia'),
  ('economia', 'inflacao'), ('economia', 'mercado de trabalho'), ('economia', 'produtividade'),
  ('gestao-publica', 'gestao publica'), ('gestao-publica', 'setor publico'),
  ('gestao-publica', 'capacidade estatal'), ('gestao-publica', 'servico publico'),
  ('politicas-publicas', 'politica publica'), ('politicas-publicas', 'politicas publicas'),
  ('politicas-publicas', 'avaliacao de politicas'), ('politicas-publicas', 'programa social'),
  ('ppp', 'parceria publico-privada'), ('ppp', 'parcerias publico-privadas'), ('ppp', 'ppp'),
  ('concessoes', 'concessao'), ('concessoes', 'concessoes'), ('concessoes', 'privatizacao'),
  ('modelagem-economica', 'modelagem'), ('modelagem-economica', 'modelo economico'),
  ('modelagem-economica', 'equilibrio geral'), ('modelagem-economica', 'analise custo-beneficio'),
  ('infraestrutura', 'infraestrutura'), ('infraestrutura', 'saneamento'), ('infraestrutura', 'energia'),
  ('mobilidade', 'mobilidade urbana'), ('mobilidade', 'mobilidade'),
  ('transportes', 'transporte'), ('transportes', 'transportes'), ('transportes', 'logistica'),
  ('financas-publicas', 'financas publicas'), ('financas-publicas', 'fiscal'),
  ('financas-publicas', 'tributacao'), ('financas-publicas', 'orcamento publico'),
  ('financas-publicas', 'divida publica'), ('financas-publicas', 'gasto publico'),
  ('planejamento-urbano', 'planejamento urbano'), ('planejamento-urbano', 'cidade'),
  ('planejamento-urbano', 'habitacao'), ('planejamento-urbano', 'urbanismo'),
  ('desenvolvimento-regional', 'desenvolvimento regional'), ('desenvolvimento-regional', 'regional'),
  ('desenvolvimento-regional', 'federalismo'),
  ('desenvolvimento-economico', 'desenvolvimento economico'), ('desenvolvimento-economico', 'crescimento economico'),
  ('desenvolvimento-economico', 'industria'),
  ('administracao-publica', 'administracao publica'), ('administracao-publica', 'burocracia'),
  ('administracao-publica', 'servidor publico'),
  ('compras-publicas', 'compras publicas'), ('compras-publicas', 'licitacao'),
  ('compras-publicas', 'contratacao publica'), ('compras-publicas', 'pregao'),
  ('tecnologia', 'tecnologia'), ('tecnologia', 'inovacao'), ('tecnologia', 'digital'),
  ('tecnologia', 'inteligencia artificial'),
  ('dados', 'dados'), ('dados', 'estatistica'), ('dados', 'indicadores'), ('dados', 'microdados'),
  ('governanca', 'governanca'), ('governanca', 'transparencia'), ('governanca', 'controle interno'),
  ('governanca', 'corrupcao'),
  ('educacao', 'educacao'), ('educacao', 'ensino'), ('educacao', 'escola'),
  ('saude', 'saude'), ('saude', 'sus'), ('saude', 'hospitalar'),
  ('meio-ambiente', 'meio ambiente'), ('meio-ambiente', 'ambiental'),
  ('meio-ambiente', 'clima'), ('meio-ambiente', 'sustentabilidade'), ('meio-ambiente', 'amazonia'),
  ('gestao-municipal', 'municipio'), ('gestao-municipal', 'municipal'), ('gestao-municipal', 'prefeitura')
) AS r(topic_slug, term)
JOIN library_topics t ON t.slug = r.topic_slug
ON CONFLICT (topic_id, term) DO NOTHING;
