-- Novas fontes da Biblioteca.
--
-- Escolhidas por dois criterios: expor OAI-PMH de fato (BDTD, OASISBR, Enap,
-- IBGE, UFSC e SciELO Livros respondem com verificacao anti-bot ou 403, e por
-- isso ficam de fora ate haver acordo de acesso) e ter aderencia ao publico da
-- Daddus. Ver docs/BIBLIOTECA.md, secao "Fontes".

INSERT INTO library_sources (slug, name, institution, site_url, protocol, endpoint, metadata_prefix, frequency)
VALUES
  (
    'fgv',
    'Repositório da FGV',
    'Fundação Getulio Vargas',
    'https://repositorio.fgv.br',
    'oai-pmh',
    'https://repositorio.fgv.br/server/oai/request',
    'oai_dc',
    'semanal'
  ),
  (
    'ufmg',
    'Repositório Institucional da UFMG',
    'Universidade Federal de Minas Gerais',
    'https://repositorio.ufmg.br',
    'oai-pmh',
    'https://repositorio.ufmg.br/server/oai/request',
    'oai_dc',
    'mensal'
  ),
  (
    'ufpr',
    'Repositório Digital da UFPR',
    'Universidade Federal do Paraná',
    'https://acervodigital.ufpr.br',
    'oai-pmh',
    'https://acervodigital.ufpr.br/oai/request',
    'oai_dc',
    'mensal'
  )
ON CONFLICT (slug) DO NOTHING;
