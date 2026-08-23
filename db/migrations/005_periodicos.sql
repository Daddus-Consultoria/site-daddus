-- Periodicos de administracao publica, economia e estudos urbanos.
--
-- Mudanca de criterio, medida no proprio acervo: Ipea e FGV classificam em
-- algum tema da Biblioteca 83,6% e 82,0% dos documentos; a UFMG, 47,8% — e no
-- nucleo tematico da Daddus (gestao municipal, politicas publicas,
-- desenvolvimento regional, economia, financas publicas, infraestrutura) a
-- UFMG cai para 12,6%, ainda inflado por falso positivo do classificador.
--
-- Periodico ja vem curado pelo escopo editorial, que e justamente o filtro que
-- falta num repositorio universitario inteiro: sao ~20 mil documentos, ~100 MB,
-- contra 738 mil e ~3,9 GB das nove universidades cadastradas na migration 004.
--
-- Endpoints confirmados um a um com verb=Identify em 23/08/2026. Ver
-- docs/BIBLIOTECA.md, secao "Fontes".

INSERT INTO library_sources (slug, name, institution, site_url, protocol, endpoint, metadata_prefix, frequency)
VALUES
  -- ~6,5 mil artigos. O repositorio institucional da Enap responde 403, mas o
  -- periodico dela nao.
  (
    'rsp-enap',
    'Revista do Serviço Público',
    'Escola Nacional de Administração Pública',
    'https://revista.enap.gov.br',
    'oai-pmh',
    'https://revista.enap.gov.br/index.php/RSP/oai',
    'oai_dc',
    'mensal'
  ),
  -- ~3,5 mil artigos.
  (
    'rap-fgv',
    'Revista de Administração Pública',
    'Fundação Getulio Vargas',
    'https://bibliotecadigital.fgv.br/ojs/index.php/rap',
    'oai-pmh',
    'https://bibliotecadigital.fgv.br/ojs/index.php/rap/oai',
    'oai_dc',
    'mensal'
  ),
  -- ~1,9 mil artigos.
  (
    'rbe-fgv',
    'Revista Brasileira de Economia',
    'Fundação Getulio Vargas',
    'https://bibliotecadigital.fgv.br/ojs/index.php/rbe',
    'oai-pmh',
    'https://bibliotecadigital.fgv.br/ojs/index.php/rbe/oai',
    'oai_dc',
    'mensal'
  ),
  -- ~1,7 mil artigos.
  (
    'ebape-fgv',
    'Cadernos EBAPE.BR',
    'Fundação Getulio Vargas',
    'https://bibliotecadigital.fgv.br/ojs/index.php/cadernosebape',
    'oai-pmh',
    'https://bibliotecadigital.fgv.br/ojs/index.php/cadernosebape/oai',
    'oai_dc',
    'mensal'
  ),
  -- ~1,5 mil artigos.
  (
    'estudos-economicos-usp',
    'Estudos Econômicos',
    'Universidade de São Paulo',
    'https://www.revistas.usp.br/ee',
    'oai-pmh',
    'https://www.revistas.usp.br/ee/oai',
    'oai_dc',
    'mensal'
  ),
  -- ~1,3 mil artigos.
  (
    'rbgdr',
    'Revista Brasileira de Gestão e Desenvolvimento Regional',
    'Universidade de Taubaté',
    'https://www.rbgdr.net/revista/index.php/rbgdr',
    'oai-pmh',
    'https://www.rbgdr.net/revista/index.php/rbgdr/oai',
    'oai_dc',
    'mensal'
  ),
  -- ~870 artigos.
  (
    'cadernos-metropole',
    'Cadernos Metrópole',
    'Pontifícia Universidade Católica de São Paulo',
    'https://revistas.pucsp.br/index.php/metropole',
    'oai-pmh',
    'https://revistas.pucsp.br/index.php/metropole/oai',
    'oai_dc',
    'mensal'
  ),
  -- ~860 artigos.
  (
    'economia-sociedade-unicamp',
    'Economia e Sociedade',
    'Universidade Estadual de Campinas',
    'https://periodicos.sbu.unicamp.br/ojs/index.php/ecos',
    'oai-pmh',
    'https://periodicos.sbu.unicamp.br/ojs/index.php/ecos/oai',
    'oai_dc',
    'mensal'
  ),
  -- ~850 artigos.
  (
    'rbeur-anpur',
    'Revista Brasileira de Estudos Urbanos e Regionais',
    'Associação Nacional de Pós-Graduação e Pesquisa em Planejamento Urbano e Regional',
    'https://rbeur.anpur.org.br',
    'oai-pmh',
    'https://rbeur.anpur.org.br/rbeur/oai',
    'oai_dc',
    'mensal'
  ),
  -- ~700 artigos.
  (
    'urbe-pucpr',
    'urbe — Revista Brasileira de Gestão Urbana',
    'Pontifícia Universidade Católica do Paraná',
    'https://periodicos.pucpr.br/urbe',
    'oai-pmh',
    'https://periodicos.pucpr.br/urbe/oai',
    'oai_dc',
    'mensal'
  ),
  -- Responde, mas nao declara completeListSize — o total so se sabe coletando.
  (
    'rberu-aber',
    'Revista Brasileira de Estudos Regionais e Urbanos',
    'Associação Brasileira de Estudos Regionais e Urbanos',
    'https://revistaaber.org.br',
    'oai-pmh',
    'https://revistaaber.org.br/rberu/oai',
    'oai_dc',
    'mensal'
  )
ON CONFLICT (slug) DO NOTHING;

-- Universidade sai como acervo inteiro. UFMG e UFPR entraram ativas na
-- migration 003 e agora acompanham as nove da 004: ficam cadastradas e
-- desativadas, para que a coleta agendada nao volte a varre-las.
--
-- Os documentos ja coletados da UFMG sao apagados a parte, na operacao — nao
-- aqui, porque migration nao tem rollback e apagar dado em migration nao deixa
-- escolha a quem roda. O comando esta em docs/BIBLIOTECA.md.
UPDATE library_sources SET active = false WHERE slug IN ('ufmg', 'ufpr');
