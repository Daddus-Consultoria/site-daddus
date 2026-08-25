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
          → app/conteudos/indicadores          painel (server component)
            → components/indicatorsPanel
          → app/conteudos/indicadores/[slug]   série de um indicador
            → components/indicatorSeriesChart  (client — só pelo cursor)
          → app/conteudos/indicadores/[slug]/serie.csv   download
```

`lib/indicadores/format.ts` e `lib/indicadores/axis.ts` ficam fora dessa cadeia
porque rodam também no cliente — `queries.ts` importa o pool do Postgres e não
pode cruzar essa fronteira. Os dois separam propósitos diferentes: `format.ts`
escreve o número como a origem o publica (`R$ 5,1512`), que é o que o card e o
cursor mostram; `axis.ts` encurta para caber numa marca de eixo, e decide as
casas decimais **do eixo inteiro** a partir do passo entre as marcas — decidir
por marca produziria `0,00` ao lado de `20,0` na mesma coluna.

A página do indicador é server component; só o gráfico é cliente, porque uma
série de trinta anos reduzida a 900px não permite ler um período específico sem
um cursor. O tooltip nunca é o único caminho para um valor: a tabela abaixo
traz os períodos recentes em texto e o CSV leva a série inteira.

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

## A troca de moeda, e o que ela quebra

A série do dólar no SGS é contínua desde 1984, mas o Brasil trocou de moeda
cinco vezes nesse intervalo. O valor de `04/01/1993` é 12.531,50 — **cruzeiros**.
O de hoje é 5,15 — **reais**. Os dois estão corretos como a origem os publicou, e
são números de unidades diferentes.

Desenhar os dois no mesmo eixo rotulado `R$` publica "R$ 71.153" como preço do
dólar, que é falso. É o mesmo erro do rótulo trocado descrito acima, só que na
unidade em vez do nome.

A coluna `indicators.comparable_from` (migration `009`) resolve declarando a
partir de quando os valores da série são comparáveis entre si — `1994-07-01`
para o dólar, `NULL` para todo o resto. O que ela governa:

| Onde | Respeita a janela? |
|---|---|
| Gráfico da página do indicador | sim — começa em `comparable_from` |
| Maior e menor valor da série | sim — senão o "maior valor" seria cruzeiro |
| Períodos guardados, primeira e última data | **não** — descrevem o que está no banco |
| CSV (`/conteudos/indicadores/<slug>/serie.csv`) | **não** — entrega a série inteira |

Nada é apagado nem convertido: a regra do banco continua sendo guardar o valor
como a origem publicou. `comparable_from` é uma decisão de **exibição**, e a
página diz na tela por que o gráfico começa depois do início da série.

Taxa de juros e índice de preço não precisam disso: são adimensionais e
atravessam a troca de moeda sem problema — a Selic de 1986 em % ao ano é
comparável à de hoje.

## O que ainda não está aqui

- **Recortes municipais e estaduais** (IBGE/SIDRA). É a etapa seguinte. A API
  v3 de agregados é pública e sem chave, mas precisa ser testada de dentro da
  Vercel: de IP de datacenter o WAF do IBGE rejeita a requisição.
- **Calculadora de correção por índice** encadeando períodos. O cálculo é código
  nosso; hoje a página entrega a série e o CSV, e a conta fica com quem lê.
- **Calculadoras** de juros compostos e comparador de séries.

## Ambiente local

```bash
docker start daddus-pg          # ou o docker run de docs/BIBLIOTECA.md
yarn db:migrate
yarn indicadores:coletar --full
yarn dev
```

Se o `docker start` falhar ou o container morrer logo depois, confira se há outro
Postgres ocupando a 5433 — `docker ps -a --filter publish=5433`. O container
`pg-compras`, do projeto `compras-daddus`, usa a mesma porta, e os dois não sobem
juntos. O sintoma na tela não é erro: a página de indicadores carrega vazia, porque
ela tolera falha do banco de propósito (ver o comentário em
`app/conteudos/indicadores/page.tsx`).

A coleta completa leva de 30 s a 6 min, conforme a resposta do SGS. As séries
diárias (dólar desde 1984, Selic desde 1986) são as demoradas: ~10 mil pontos
cada.
