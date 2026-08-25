-- Fontes e indicadores do piloto.
--
-- Cada codigo aqui foi conferido contra a origem antes de entrar: os do Banco
-- Central pelo nome no portal de dados abertos do proprio BCB, e os do
-- IPEADATA cruzando seis meses de valores serie a serie com o SGS. Um codigo
-- errado nao quebra nada — ele publica um numero certo com o rotulo de outro
-- indicador, que e pior. Ver docs/INDICADORES.md.

INSERT INTO indicator_sources (slug, name, site_url, protocol, endpoint) VALUES
  ('bcb-sgs', 'Banco Central — SGS', 'https://www.bcb.gov.br/estatisticas/serieshistoricas',
   'bcb-sgs', 'https://api.bcb.gov.br/dados/serie'),
  ('ipeadata', 'Ipeadata', 'http://www.ipeadata.gov.br/',
   'ipeadata', 'http://www.ipeadata.gov.br/api/odata4')
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Indices de precos — via Ipeadata
-- ---------------------------------------------------------------------------
-- Vem do Ipeadata, e nao do SGS, porque a API do Ipeadata declara o produtor,
-- a periodicidade e a URL de metodologia de cada serie. O SGS entrega so data
-- e valor: o rotulo teria de ser escrito na mao aqui e nao teria como se
-- corrigir sozinho. Com o Ipeadata, o coletor reescreve nome e produtor a cada
-- execucao a partir da origem.
INSERT INTO indicators (slug, name, acronym, source_id, external_id, producer, category, unit, frequency, description, display_order)
SELECT v.slug, v.name, v.acronym, s.id, v.external_id, v.producer, v.category, v.unit, v.frequency, v.description, v.display_order
FROM indicator_sources s, (VALUES
  ('ipca', 'IPCA — variação mensal', 'IPCA', 'PRECOS12_IPCAG12', 'IBGE', 'precos', 'percentual', 'mensal',
   'Índice oficial de inflação do país, usado como meta pelo Banco Central e como indexador em boa parte dos contratos públicos.', 10),
  ('ipca-12-meses', 'IPCA — acumulado em 12 meses', 'IPCA 12m', 'PRECOS12_IPCAGA12', 'IBGE', 'precos', 'percentual-ano', 'mensal',
   'O mesmo índice acumulado no ano móvel — a leitura que se compara com a meta de inflação.', 20),
  ('ipca-15', 'IPCA-15 — variação mensal', 'IPCA-15', 'PRECOS12_IPCA15G12', 'IBGE', 'precos', 'percentual', 'mensal',
   'Prévia do IPCA, com coleta encerrada no meio do mês. Antecipa a tendência antes do índice cheio.', 30),
  ('inpc', 'INPC — variação mensal', 'INPC', 'PRECOS12_INPCBR12', 'IBGE', 'precos', 'percentual', 'mensal',
   'Inflação medida sobre famílias de renda mais baixa; referência frequente em reajuste salarial e piso de categoria.', 40),
  ('igp-m', 'IGP-M — variação mensal', 'IGP-M', 'IGP12_IGPMG12', 'FGV', 'precos', 'percentual', 'mensal',
   'Índice geral de preços de mercado. É o indexador tradicional de aluguel e de contratos de concessão de longo prazo.', 50),
  ('igp-di', 'IGP-DI — variação mensal', 'IGP-DI', 'IGP12_IGPDIG12', 'FGV', 'precos', 'percentual', 'mensal',
   'Mesma cesta do IGP-M, apurada do primeiro ao último dia do mês em vez do período de coleta deslocado.', 60),
  ('incc-di', 'INCC-DI — variação mensal', 'INCC-DI', 'IGP12_INCCG12', 'FGV', 'precos', 'percentual', 'mensal',
   'Custo da construção habitacional. É o índice que reajusta obra pública e contrato de empreitada.', 70),
  ('ipc-di', 'IPC-DI — variação mensal', 'IPC-DI', 'IGP12_IPCG12', 'FGV', 'precos', 'percentual', 'mensal',
   'Componente de consumo do IGP, apurado pela FGV em sete capitais.', 80)
) AS v(slug, name, acronym, external_id, producer, category, unit, frequency, description, display_order)
WHERE s.slug = 'ipeadata'
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Juros, cambio, atividade e fiscal — via SGS
-- ---------------------------------------------------------------------------
-- Aqui o Banco Central e o proprio produtor, e o nome de cada serie foi lido
-- do catalogo de dados abertos do BCB (dadosabertos.bcb.gov.br), que so
-- cataloga as series que ele apura. CDI, TR e euro ficaram de fora justamente
-- por nao constarem la: sem o rotulo oficial, entrariam por suposicao.
INSERT INTO indicators (slug, name, acronym, source_id, external_id, producer, methodology_url, category, unit, decimals, frequency, description, display_order)
SELECT v.slug, v.name, v.acronym, s.id, v.external_id, v.producer, v.methodology_url, v.category, v.unit, v.decimals, v.frequency, v.description, v.display_order
FROM indicator_sources s, (VALUES
  ('selic-meta', 'Taxa Selic — meta definida pelo Copom', 'Selic', '432', 'Banco Central do Brasil',
   'https://www.bcb.gov.br/controleinflacao/taxaselic', 'juros', 'percentual-ano', NULL, 'diaria',
   'A taxa básica de juros da economia, fixada a cada reunião do Copom. Baliza o custo de capital de qualquer projeto de longo prazo.', 10),
  ('selic-anualizada', 'Taxa Selic — anualizada, base 252', 'Selic efetiva', '1178', 'Banco Central do Brasil',
   'https://www.bcb.gov.br/controleinflacao/taxaselic', 'juros', 'percentual-ano', NULL, 'diaria',
   'A taxa efetivamente praticada no mercado de reservas bancárias, que oscila em torno da meta.', 20),
  ('selic-acumulada-mes', 'Taxa Selic — acumulada no mês, anualizada, base 252', 'Selic no mês', '4189', 'Banco Central do Brasil',
   'https://www.bcb.gov.br/controleinflacao/taxaselic', 'juros', 'percentual-ano', NULL, 'mensal',
   'Fechamento mensal da taxa efetiva — a série que se usa para comparar períodos.', 30),
  ('poupanca', 'Depósitos de poupança — rentabilidade no período', 'Poupança', '195', 'Banco Central do Brasil',
   'https://www.bcb.gov.br/estatisticas/serieshistoricas', 'juros', 'percentual', 4, 'mensal',
   'Rendimento da poupança a partir da regra de maio de 2012, que a atrelou à Selic quando esta cai abaixo de 8,5% ao ano.', 40),
  ('dolar', 'Taxa de câmbio — livre, dólar americano (venda)', 'Dólar', '1', 'Banco Central do Brasil',
   'https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes', 'cambio', 'moeda', NULL, 'diaria',
   'Cotação de venda do dólar comercial no fechamento de cada dia útil.', 10),
  ('ibc-br', 'Índice de Atividade Econômica do Banco Central', 'IBC-Br', '24363', 'Banco Central do Brasil',
   'https://www.bcb.gov.br/estatisticas/indicadoresconsolidados', 'atividade', 'indice', NULL, 'mensal',
   'Proxy mensal do PIB calculada pelo Banco Central. Antecipa a atividade antes do resultado trimestral do IBGE.', 10),
  ('divida-bruta-pib', 'Dívida Bruta do Governo Geral (% do PIB)', 'DBGG', '13762', 'Banco Central do Brasil',
   'https://www.bcb.gov.br/estatisticas/estatisticasfiscais', 'fiscal', 'percentual-pib', NULL, 'mensal',
   'Estoque da dívida de União, estados e municípios como proporção do PIB, na metodologia vigente desde 2008.', 10),
  ('divida-liquida-pib', 'Dívida Líquida do Setor Público (% do PIB)', 'DLSP', '4513', 'Banco Central do Brasil',
   'https://www.bcb.gov.br/estatisticas/estatisticasfiscais', 'fiscal', 'percentual-pib', NULL, 'mensal',
   'A dívida bruta descontada dos ativos do setor público consolidado.', 20)
) AS v(slug, name, acronym, external_id, producer, methodology_url, category, unit, decimals, frequency, description, display_order)
WHERE s.slug = 'bcb-sgs'
ON CONFLICT (slug) DO NOTHING;
