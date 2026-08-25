# Indicadores

Painel de séries econômicas em `/conteudos/indicadores`. A Daddus **não apura
indicador**: coleta a série na instituição que a produz e a republica com a
procedência preservada — quem apura, qual o período de referência do valor e
quando a série foi lida.

Pertence ao eixo **Conhecimento** (ver `docs/DIRETRIZES-UX.md`), ao lado da
Biblioteca e das publicações. As três são coisas distintas: publicações são
produção própria e vivem no Strapi; a Biblioteca indexa metadados de documentos
de terceiros; Indicadores guarda série temporal numérica.

## Arquitetura

```
origem (BCB/SGS · Ipeadata)
  → scripts/harvest-indicadores.ts   coleta incremental, com log por execução
    → lib/indicadores/sgs.ts         cliente do SGS, com janela e retentativa
    → lib/indicadores/ipeadata.ts    cliente OData, com metadados da série
      → Postgres                     indicators + indicator_values
        → lib/indicadores/queries.ts leitura em uma consulta só
          → app/conteudos/indicadores  (server component)
            → components/indicatorsPanel
```

`lib/indicadores/format.ts` fica fora dessa cadeia porque roda também no
cliente — `queries.ts` importa o pool do Postgres e não pode cruzar essa
fronteira.

## Banco

Mesmo Postgres da Biblioteca (mesma `DATABASE_URL`), em tabelas próprias. Não há
relação entre as duas áreas; compartilham a instância por economia, não por
modelagem.

| Tabela | Papel |
|---|---|
| `indicator_sources` | quem **distribui** a série por API, e por qual protocolo |
| `indicators` | um indicador: produtor, unidade, periodicidade, código na origem |
| `indicator_values` | a série: um valor por período de referência |
| `indicator_collections` | log de cada execução da coleta |

### Distribuidor não é produtor

É a distinção que mais importa aqui. O IGP-M é da **FGV** e o IPCA é do
**IBGE** — nenhum dos dois publica API aberta própria desses índices, e as duas
séries chegam redistribuídas. Por isso `producer` vive no indicador e não na
fonte, e a tela mostra o produtor, nunca o distribuidor.

São duas colunas de produtor:

- `producer` — o nome curto que cabe num card: `FGV`, `IBGE`.
- `producer_detail` — como a origem se declara: `FGV/Conj. Econ. - IGP`.

O coletor regrava `producer_detail` a cada execução a partir do Ipeadata, e
nunca toca `producer`.

## As duas origens, e por que duas

| | BCB/SGS | Ipeadata |
|---|---|---|
| Metadados da série | não expõe | nome, produtor, periodicidade, URL |
| Séries usadas | as que o **próprio BCB apura** | índices de preços (FGV, IBGE) |
| Janela de consulta | máx. 10 anos em série diária | série inteira |
| Coleta | incremental | relê tudo (série mensal é pequena) |

O SGS entrega só `{ data, valor }`. Se os índices de preços viessem dele, o
rótulo "IGP-M" e o produtor "FGV" teriam de ser escritos à mão no código, sem
como se corrigir. O Ipeadata declara os dois, então o site acompanha uma
correção na origem sem deploy.

Para as séries que o BCB apura (Selic, câmbio, dívida, IBC-Br) o SGS é a origem
certa: ele é o produtor e atualiza no mesmo dia.

### Como cada código foi conferido

Código errado não quebra nada — publica um número correto com o rótulo de outro
indicador, que é pior. Nenhum entrou por suposição:

- **BCB/SGS**: o nome oficial de cada série foi lido no portal de dados abertos
  do próprio BCB (`dadosabertos.bcb.gov.br/api/3/action/package_list`), que
  cataloga apenas as séries que ele apura.
- **Ipeadata**: a API declara o nome e o produtor, e cada série foi cruzada
  valor a valor com a série equivalente do SGS por seis meses.

**CDI, TR e euro ficaram de fora** por não constarem do catálogo do BCB: sem o
rótulo oficial, entrariam por suposição. O CDI ainda tem um segundo problema —
quem o apura é a B3, e redistribuir dado de mercado tem restrição própria.

## Comandos

```bash
yarn indicadores:coletar                    # todos os indicadores ativos
yarn indicadores:coletar ipca               # só um, pelo slug
yarn indicadores:coletar --frequency=diaria # os dessa periodicidade
yarn indicadores:coletar --full             # ignora o ponto de parada
yarn indicadores:setup                      # migrations + coleta completa
```

Em produção quem dispara é o GitHub Actions
(`.github/workflows/indicadores-coleta.yml`): cron diário às 09:20 UTC e cron
mensal no dia 10, este com `--full` para capturar revisão retroativa dos
índices de preços. O segredo `DATABASE_URL` precisa estar configurado no
repositório.

## Duas armadilhas do SGS

Ambas foram encontradas na prática e estão tratadas no código:

1. **Série mensal expande a janela para o mês inteiro.** Uma consulta iniciada
   em `04/01/2007` devolve o ponto de `01/01/2007`. Janelas consecutivas se
   sobrepõem e a mesma data chega duas vezes no mesmo lote — o `ON CONFLICT`
   recusa o comando inteiro. O coletor deduplica por data antes de gravar.
2. **Página de erro em HTML com status 200.** Sob rajada de requisições o SGS
   às vezes devolve HTML no lugar de JSON. É intermitente; o cliente tenta três
   vezes com espera crescente antes de desistir.

Série diária **exige** intervalo e recusa janela maior que 10 anos com HTTP
406. O cliente varre em fatias de 9 anos.

## Precisão

`indicator_values.value` é `NUMERIC`, não float: taxa de juros e câmbio somados
em ponto flutuante acumulam erro na terceira casa, que é onde o CDI vive. O
driver do Postgres devolve `NUMERIC` como string, e a conversão para número
acontece num lugar só, em `queries.ts`.

O banco guarda o valor **exatamente como a origem publicou** — não há conversão
em lugar nenhum da cadeia. A coluna `decimals` governa só a exibição, e existe
porque a unidade sozinha não basta: percentual sai com duas casas por padrão,
mas a rentabilidade da poupança é divulgada com quatro (`0,6446%`), e arredondar
para `0,64%` publicaria um número que a origem não publicou.

## O que ainda não está aqui

- **Recortes municipais e estaduais** (IBGE/SIDRA). É a etapa seguinte. A API
  v3 de agregados é pública e sem chave, mas precisa ser testada de dentro da
  Vercel: de IP de datacenter o WAF do IBGE rejeita a requisição.
- **Página por indicador**, com série histórica completa, tabela e download —
  `DIRETRIZES-UX.md` seção 6 pede isso e hoje o painel mostra só os 24 períodos
  recentes.
- **Calculadoras** (juros compostos, correção por índice, comparador). O cálculo
  é código nosso; os dados de entrada saem daqui.

## Ambiente local

```bash
docker start daddus-pg          # ou o docker run de docs/BIBLIOTECA.md
yarn db:migrate
yarn indicadores:coletar --full
yarn dev
```

A coleta completa leva de 30 s a 6 min, conforme a resposta do SGS. As séries
diárias (dólar desde 1984, Selic desde 1986) são as demoradas: ~10 mil pontos
cada.
