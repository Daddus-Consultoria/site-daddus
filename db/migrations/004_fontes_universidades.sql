-- Universidades e o caminho do MEC.
--
-- Endpoints confirmados um a um com verb=Identify e verb=ListIdentifiers em
-- 23/08/2026 — o numero de registros ao lado veio do completeListSize da
-- propria fonte. Ver docs/BIBLIOTECA.md, secao "Fontes".
--
-- Entram DESATIVADAS de proposito. Somadas passam de um milhao de documentos,
-- perto de 5,6 GB pelo tamanho medido no acervo (5,2 KB por documento), e a
-- coleta agendada varre todas as fontes ativas da periodicidade. Ativar e
-- decisao de espaco em disco, tomada fonte a fonte:
--
--   UPDATE library_sources SET active = true WHERE slug IN ('ufrgs', 'unesp');

INSERT INTO library_sources (slug, name, institution, site_url, protocol, endpoint, metadata_prefix, frequency, active)
VALUES
  -- ~304 mil registros. O maior acervo universitario aberto do pais.
  (
    'ufrgs',
    'Lume — Repositório Digital da UFRGS',
    'Universidade Federal do Rio Grande do Sul',
    'https://lume.ufrgs.br',
    'oai-pmh',
    'https://lume.ufrgs.br/oai/request',
    'oai_dc',
    'mensal',
    false
  ),
  -- ~243 mil registros.
  (
    'unesp',
    'Repositório Institucional da Unesp',
    'Universidade Estadual Paulista',
    'https://repositorio.unesp.br',
    'oai-pmh',
    'https://repositorio.unesp.br/server/oai/request',
    'oai_dc',
    'mensal',
    false
  ),
  -- ~37 mil registros.
  (
    'ufla',
    'Repositório Institucional da UFLA',
    'Universidade Federal de Lavras',
    'https://repositorio.ufla.br',
    'oai-pmh',
    'https://repositorio.ufla.br/server/oai/request',
    'oai_dc',
    'mensal',
    false
  ),
  -- ~36,7 mil registros.
  (
    'ufpb',
    'Repositório Institucional da UFPB',
    'Universidade Federal da Paraíba',
    'https://repositorio.ufpb.br',
    'oai-pmh',
    'https://repositorio.ufpb.br/oai/request',
    'oai_dc',
    'mensal',
    false
  ),
  -- ~34,7 mil registros.
  (
    'ufv',
    'Locus — Repositório Institucional da UFV',
    'Universidade Federal de Viçosa',
    'https://locus.ufv.br',
    'oai-pmh',
    'https://locus.ufv.br/server/oai/request',
    'oai_dc',
    'mensal',
    false
  ),
  -- ~23,4 mil registros.
  (
    'ufscar',
    'Repositório Institucional da UFSCar',
    'Universidade Federal de São Carlos',
    'https://repositorio.ufscar.br',
    'oai-pmh',
    'https://repositorio.ufscar.br/server/oai/request',
    'oai_dc',
    'mensal',
    false
  ),
  -- ~22,7 mil registros.
  (
    'ufs',
    'Repositório Institucional da UFS',
    'Universidade Federal de Sergipe',
    'https://ri.ufs.br',
    'oai-pmh',
    'https://ri.ufs.br/oai/request',
    'oai_dc',
    'mensal',
    false
  ),
  -- ~20,1 mil registros.
  (
    'ufop',
    'Repositório Institucional da UFOP',
    'Universidade Federal de Ouro Preto',
    'https://www.repositorio.ufop.br',
    'oai-pmh',
    'https://www.repositorio.ufop.br/server/oai/request',
    'oai_dc',
    'mensal',
    false
  ),
  -- ~15,8 mil registros.
  (
    'ufes',
    'Repositório Institucional da UFES',
    'Universidade Federal do Espírito Santo',
    'https://repositorio.ufes.br',
    'oai-pmh',
    'https://repositorio.ufes.br/server/oai/request',
    'oai_dc',
    'mensal',
    false
  ),
  -- ~346 mil registros, e o caminho do MEC: e da Capes e agrega material de
  -- universidades e institutos federais. Fica desativada por conteudo, e nao
  -- por espaco — a amostra veio dominada por objeto educacional solto (audio
  -- de aula de ingles, material de curso), que nao e o que a Biblioteca
  -- indexa. Aproveitavel so com recorte por set_spec, depois de curadoria.
  (
    'educapes',
    'eduCAPES',
    'Coordenação de Aperfeiçoamento de Pessoal de Nível Superior',
    'https://educapes.capes.gov.br',
    'oai-pmh',
    'https://educapes.capes.gov.br/oai/request',
    'oai_dc',
    'mensal',
    false
  )
ON CONFLICT (slug) DO NOTHING;
