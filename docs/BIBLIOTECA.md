# Biblioteca Daddus

Área de descoberta de conhecimento técnico e acadêmico: indexa **metadados** de
documentos publicados por fontes externas (Ipea, universidades, bases
acadêmicas) e leva o usuário ao documento **no portal de origem**.

A Biblioteca não hospeda arquivos. O que ela acrescenta é a camada própria de
descoberta: busca por relevância, filtros combináveis, classificação temática,
consolidação de duplicados e curadoria.

Pertence ao eixo **Conhecimento** (ver `docs/DIRETRIZES-UX.md`), ao lado das
publicações da Daddus — que são coisa distinta: aquelas são produção própria e
vivem no Strapi; a Biblioteca é acervo de terceiros e vive em Postgres.

## Arquitetura

```
fonte externa (OAI-PMH / API)
  → scripts/harvest.ts            coleta, com retomada e coleta incremental
    → lib/biblioteca/oai.ts       cliente do protocolo
    → lib/biblioteca/normalize.ts Dublin Core → registro previsível
      → Postgres                  library_documents + relações
        → lib/biblioteca/queries.ts   busca, facetas, relacionados
          → app/api/biblioteca/documentos   (cliente)  e  server components (páginas)
            → components/libraryExplorer
```

O caminho no cliente segue a mesma cadeia do resto do site
(useCase → repository → service): `LibraryUseCases` → `LibraryRepository` →
`LibraryAPIService`, com o provider em
`components/providers/repositoriesProviders/libraryProvider.ts`.

## Banco

`DATABASE_URL` aponta para um Postgres dedicado. Tabelas:

| Tabela | Papel |
|---|---|
| `library_sources` | fontes, endpoint, periodicidade e ponto de parada da coleta |
| `library_documents` | o registro do documento, com `search_vector` para a busca |
| `library_document_origins` | o mesmo documento em várias fontes |
| `library_topics` / `library_topic_rules` | temas e as regras que classificam |
| `library_document_topics` | ligação documento ↔ tema |
| `library_harvests` | log de cada coleta |

Migrations em `db/migrations`, aplicadas em ordem por `yarn db:migrate`. Cada
arquivo precisa ser idempotente (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`) —
não há rollback.

### Busca

`search_vector` é coluna gerada, com pesos: título (A), subtítulo/autores/
palavras-chave (B), instituição (C) e resumo (D). A configuração de busca é
`portuguese_unaccent` — português com `unaccent`, para que "economia publica"
encontre "Economia Pública".

Quando a busca exata não devolve nada, a consulta tenta de novo por
similaridade (`pg_trgm`) e a interface avisa que o resultado é aproximado. É o
que evita que um erro de digitação zere o acervo.

### Deduplicação

Um mesmo estudo aparece em BDTD, no repositório da universidade e no OASISBR.
A chave de consolidação (`dedupe_key`) segue a ordem de confiança: **DOI** →
**handle do repositório** → **título + autor + ano**. O registro é único; cada
fonte onde ele foi encontrado entra em `library_document_origins`, e a ficha
mostra "Também disponível em".

### Temas

Ficam em `library_topics`, com as regras de classificação em
`library_topic_rules` — **no banco, não no código**, para a equipe ajustar sem
deploy. A coleta aplica as regras comparando o termo (sem acento, sem caixa,
com limite de palavra) contra título, subtítulo, palavras-chave e resumo.

Para criar um tema:

```sql
INSERT INTO library_topics (slug, name, position, system_slug)
VALUES ('saneamento', 'Saneamento', 230, 'opus');

INSERT INTO library_topic_rules (topic_id, term)
SELECT id, unnest(ARRAY['saneamento', 'esgoto', 'agua potavel'])
  FROM library_topics WHERE slug = 'saneamento';
```

A reclassificação vale para documentos coletados a partir daí; para aplicar ao
acervo já indexado, rode `yarn harvest <fonte> --full`.

## Coleta

```bash
yarn harvest ipea                 # incremental (só o que mudou desde a última)
yarn harvest ipea --full          # recomeça do zero
yarn harvest ipea --limit=200     # amostra, para conferir normalização
yarn harvest --frequency=semanal  # todas as fontes dessa periodicidade
```

Em produção quem dispara é o GitHub Actions
(`.github/workflows/biblioteca-coleta.yml`): três crons, um por periodicidade,
mais disparo manual. O segredo `DATABASE_URL` precisa estar configurado no
repositório.

A coleta é incremental por padrão: usa o `from` do OAI-PMH a partir do
`last_datestamp` da fonte. Uma coleta parcial (`--limit`) não avança esse ponto
— o resto do repositório ainda não foi lido.

### Fontes indexadas

| Fonte | Registros | Periodicidade |
|---|---|---|
| Repositório do Ipea | ~14,3 mil | semanal |
| Repositório da FGV | ~33,5 mil | semanal |
| Repositório Institucional da UFMG | ~74 mil | mensal |
| Repositório Digital da UFPR | ~82 mil | mensal |

### Fontes que não expõem OAI-PMH utilizável

Testadas e descartadas por ora — vale reavaliar, porque depende de decisão de
quem hospeda, não do nosso código:

| Fonte | O que responde |
|---|---|
| BDTD e OASISBR (IBICT) | HTTP 200 com página de verificação anti-bot, não XML |
| Repositório da UFSC | desafio Cloudflare Turnstile |
| SciELO Livros | HTTP 403 |
| Enap, Biblioteca do IBGE | HTTP 403 |
| UnB, UFPE | HTTP 503 |
| USP | sem resposta |

BDTD e OASISBR são agregadores: o conteúdo deles vem dos repositórios das
universidades, que **são** coletáveis diretamente. Indexar as universidades uma
a uma chega ao mesmo acervo sem depender do agregador — e a consolidação por
DOI e handle evita o documento repetido quando duas delas publicam o mesmo
trabalho.

Para incluir BDTD/OASISBR seria preciso acordo de acesso com o IBICT. O
coletor recusa explicitamente uma resposta que não seja OAI-PMH, em vez de
terminar "com sucesso" e zero registro.

### Adicionar uma fonte

1. Confirme o endpoint OAI-PMH (`?verb=Identify`, `?verb=ListMetadataFormats`).
2. Insira em `library_sources` (slug, nome, instituição, endpoint,
   `metadata_prefix`, periodicidade).
3. `yarn harvest <slug> --limit=200` e confira a normalização — sobretudo
   `document_type`, `year` e `abstract`.
4. Se o vocabulário de tipo da fonte trouxer termos novos, acrescente-os ao
   `TYPE_MAP` em `lib/biblioteca/normalize.ts`. O que não for mapeado vira
   "outro" — melhor sem tipo do que com o tipo errado.
5. `yarn harvest <slug> --full`.

Preferir sempre protocolo oficial (OAI-PMH, API) a scraping.

## Onde hospedar o banco

Qualquer Postgres gerenciado serve. O que muda entre provedores é a string de
conexão:

| Provedor | String de conexão |
|---|---|
| Railway | use a **`DATABASE_PUBLIC_URL`** (termina em `.proxy.rlwy.net:porta`). A `DATABASE_URL` que ele mostra é interna e só funciona dentro do Railway — o site roda na Vercel e a coleta no GitHub, ambos de fora. Se o banco recusar TLS, acrescente `?sslmode=disable` |
| Neon / Supabase | a string padrão, com TLS. Atenção ao limite de 0,5 GB dos planos gratuitos |
| Postgres local | `postgres://postgres:...@localhost:5433/daddus_biblioteca` |

O `sslmode` escrito na URL manda sobre o comportamento do pool
(`lib/db/pool.ts`); sem ele, TLS é ligado para qualquer host remoto.

### Espaço em disco

Medido no acervo real: **~5,2 KB por documento**, incluindo índices e o vetor
de busca. Serve para dimensionar antes de ativar uma fonte:

| Acervo | Espaço |
|---|---|
| Ipea (~14 mil) | ~75 MB |
| Ipea + FGV (~48 mil) | ~250 MB |
| As quatro fontes (~210 mil) | ~1 GB |

Para caber em plano gratuito de 0,5 GB, desative as fontes maiores:

```sql
UPDATE library_sources SET active = false WHERE slug IN ('ufmg', 'ufpr');
```

## Quando a Biblioteca aparece vazia

```bash
yarn biblioteca:status                              # o banco do .env.local
DATABASE_URL='postgres://...' yarn biblioteca:status # o banco de produção
```

O diagnóstico responde, em ordem: a variável existe? o banco responde? as
tabelas existem? há documento dentro? quando foi a última coleta de cada fonte?

A causa mais comum é migrar e coletar com o `.env.local` intacto — nesse caso
tudo foi para o Postgres local, e o banco de produção continua sem tabela. Os
dois comandos precisam rodar com a `DATABASE_URL` do banco gerenciado:

```bash
DATABASE_URL='postgres://...' yarn db:migrate
DATABASE_URL='postgres://...' yarn harvest ipea --full
```

Ou, sem passar variável na mão, pelo workflow **Biblioteca — coleta** no
GitHub (aba Actions → Run workflow), que já aplica as migrations com o secret
do repositório.

## Direitos

O padrão é metadados + resumo + classificação + URL de origem. O documento
integral continua na fonte, salvo licença explícita que permita outra coisa.
`license` e `open_access` são guardados sempre que a fonte informa, e a ficha
do documento exibe a proveniência.

## Ambiente local

```bash
docker run -d --name daddus-pg \
  -e POSTGRES_PASSWORD=daddus -e POSTGRES_DB=daddus_biblioteca \
  -p 5433:5432 postgres:16-alpine

# .env.local
DATABASE_URL=postgres://postgres:daddus@localhost:5433/daddus_biblioteca

yarn db:migrate
yarn harvest ipea --limit=200
yarn dev
```

## O que ainda não existe

Da spec, ficou fora desta primeira fase — e está registrado para não passar por
pronto:

- **Busca semântica** e perguntas em linguagem natural sobre o acervo (Fases 2 e
  3). A busca hoje é textual com peso e tolerância a erro de escrita.
- **"Mais acessados"**: exigiria contagem de acesso, que ainda não é coletada.
  Não há número inventado na página.
- **Estado e município** por documento: `dc:coverage` não é confiável o
  bastante para isso; hoje só país e a cobertura em texto livre.
- **Painel de curadoria**: as colunas (`curated`, `curator_note`,
  `curator_reason`) existem e a interface já exibe "Seleção Daddus", mas a
  marcação é feita por SQL até haver tela no `/painel`.
- **Demais fontes** (BDTD, OASISBR, SciELO, CAPES, repositórios universitários):
  a arquitetura está pronta para recebê-las; cada uma exige conferir o
  endpoint e o vocabulário de tipo.
