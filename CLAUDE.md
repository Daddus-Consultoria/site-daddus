# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Site institucional da Daddus (domínio `www.daddusconsultoria.com`). Next.js 14 com App Router,
TypeScript, Tailwind + shadcn/ui, TanStack Query. Conteúdo em **português do Brasil** — código,
comentários, rotas e textos de interface seguem o idioma do repositório.

## Comandos

```bash
yarn dev          # dev server em http://localhost:3000
yarn build        # build de produção
yarn start        # sobe o build
yarn lint         # next lint (eslint-config-next / core-web-vitals)
yarn ts-check     # tsc --noEmit — rode antes de considerar uma mudança pronta
yarn db:migrate   # aplica db/migrations no Postgres da Biblioteca
yarn harvest ipea # coleta metadados de uma fonte da Biblioteca (ver docs/BIBLIOTECA.md)
```

Não há suíte de testes automatizados no repositório. Verificação = `yarn ts-check` + `yarn lint`
+ conferir a tela no dev server.

## Diretrizes de conteúdo e UX — leia antes de mexer em qualquer tela

`docs/DIRETRIZES-UX.md` é o documento normativo do site (posicionamento, arquitetura da
informação, tom de voz, estrutura da home, regras dos sistemas). Qualquer decisão de layout,
texto ou navegação precisa caber nele. Vários arquivos de conteúdo (`app/constants.ts`,
`lib/constants/constants.ts`, componentes do acervo) trazem comentários que apontam para as
seções desse doc — mantenha essa prática ao criar conteúdo novo.

Pontos que mais impactam o código:

- A Daddus se apresenta em **três frentes** — conhecimento, consultoria, tecnologia. O menu
  (`lib/constants/constants.ts` → `headerItems`) e a IA do site refletem essa separação; não a
  achate de volta para "consultoria".
- **Não inventar números, clientes, integrações ou funcionalidades.** Números exibidos na home
  saem do acervo publicado no CMS, não de literais.
- CTAs nomeiam o destino ("Ver estudos", "Conhecer o Compasso"), nunca "Veja mais". Sem
  linguagem publicitária ("solução completa e inovadora", "transforme o futuro").

## Arquitetura

### Camadas de dados (interface → useCase → repository → service)

O acesso a dados segue uma cadeia fixa; siga-a ao adicionar um novo tipo de conteúdo:

```
componente/página
  → lib/useCases/*.ts            (PublishUseCases, PostsUseCases, ChartUseCases)
    → components/providers/repositoriesProviders/*.ts   (instancia o repositório concreto)
      → lib/repositories/*.tsx   (classe abstrata = contrato)
        → lib/services/*.ts      (implementação: Strapi via httpClient, Google Sheets)
          → lib/services/index.ts / lib/services/author  (mappers Strapi → model)
```

Os *providers* são singletons de módulo — é onde se troca a implementação real pelo mock
(`lib/mocks/mockPublishRepository.ts`, comentado em `publishProvider.ts`).

O Strapi devolve tudo em `{ id, attributes: { ... } }`, inclusive relações aninhadas
(`authors.data[].attributes`). **Nunca** consuma a resposta crua na UI: passe pelos mappers
(`mapperPublish`, `mapperAuthorPublish`, `postsMapper`), que achatam a estrutura e aplicam
fallbacks (capa ausente → imagem neutra, em vez de derrubar a listagem).

Filtros do Strapi são montados como query string manual (`buildFilterQuery` em
`lib/services/publishAPIService.ts`): `filters[campo][$eq]`, `$containsi`, `$gte`/`$lte`,
`filters[$or][n][...]`, `pagination[page]`, `sort[0]`. Só entra na query o filtro efetivamente
escolhido.

### Acervo de publicações

`components/publicationsLibrary` é o componente central do "Conhecimento": busca com debounce,
filtros por tipo/subtipo/tema/ano, paginação. Duas regras estruturais:

- **O estado vive na URL** (`?q=&tipo=&perfil=&tema=&ano=&pagina=`), para permitir voltar,
  recarregar e compartilhar um recorte. Por isso as páginas que o usam precisam envolvê-lo em
  `<Suspense>` (ele chama `useSearchParams`).
- **As opções de filtro saem do próprio acervo** via `getPublishIndex` (varredura paginada e
  limitada do CMS), para que nenhum filtro ofereça um recorte sem resultado.

As páginas por tipo (`estudos/`, `guias/`, `perfis-municipais/`) reutilizam o mesmo componente
passando `fixedCategory`. Categorias são o enum `PublishCategories`, com `publishCategoryLabels`
(rótulo exibido) e `transformCategory` (segmento de rota) em `lib/constants/constants.ts`.

### Biblioteca Daddus

`app/biblioteca/` é a área de descoberta sobre acervos **externos** (Ipea,
universidades, bases acadêmicas) — não confundir com o acervo de publicações da
Daddus, que é produção própria e vem do Strapi. A Biblioteca guarda apenas
metadados e leva o usuário ao documento na origem.

Ela não passa pelo Strapi: vive em um **Postgres dedicado** (`DATABASE_URL`),
porque precisa de busca por relevância, facetas e deduplicação sobre dezenas de
milhares de registros. `docs/BIBLIOTECA.md` é o documento da área — leia antes
de mexer em coleta, schema ou classificação temática.

- Coleta: `scripts/harvest.ts` + `lib/biblioteca/oai.ts` (OAI-PMH) e
  `normalize.ts` (Dublin Core → registro previsível). Roda por GitHub Actions.
- Consulta: `lib/biblioteca/queries.ts` (usado pelos server components e pelo
  route handler `app/api/biblioteca/documentos`).
- Interface: `components/libraryExplorer`, com o mesmo princípio do acervo — o
  estado vive na URL e as opções de filtro saem do próprio acervo.
- **Temas e regras de classificação ficam no banco**, não no código
  (`library_topics`, `library_topic_rules`): a equipe ajusta sem deploy.
- `lib/db/pool.ts` só pode ser importado do servidor.

### Autenticação e painel administrativo

Auth é do Strapi, guardada no `localStorage` (`daddus_auth_token`, `daddus_auth_user`) e exposta
por `lib/auth/auth-context.tsx` (`AuthProvider` embrulha a app inteira em `app/layout.tsx`).

- Chamadas autenticadas do cliente: `lib/services/strapiAuthenticatedFetch.ts`.
- Rotas `/painel/*` são client components que consomem o Strapi direto ou via proxy.
- `app/api/admin/*` são route handlers que agem como **proxy privilegiado**: `authorizeAdmin`
  (`lib/auth/adminProxy.ts`) revalida o token contra `/api/users/me` do Strapi e exige role
  privilegiada antes de repassar. Toda rota admin nova deve começar por essa checagem.
- `lib/auth/roles.ts` normaliza nomes de role (remove acento, caixa, espaço/hífen) porque o
  Strapi devolve a role em formatos diferentes conforme o endpoint e o populate — use
  `getRoleName`/`isPrivilegedRole`/`canEditRole` em vez de comparar strings na mão.

### Rotas

App Router em `app/`, agrupado por frente: `conteudos/` (publicações, indicadores),
`servicos/consultoria/`, `setores/`, `tecnologia/`, `institucional/`, `blog/`, `biblioteca/`,
`painel/`, `login/`. Cada rota tende a ter um `_constants.ts` (ou `_constants.tsx`) ao lado com
o conteúdo textual da página — conteúdo fica nesses arquivos, não inline no JSX.

`app/tecnologia/[sistema]/page.tsx` gera as quatro páginas do ecossistema (Compasso, Opus,
Prisma, Atlas) a partir de `app/tecnologia/_constants.ts` via `generateStaticParams`.

Ainda existe `pages/` (Pages Router) apenas para dois endpoints de Google Sheets:
`pages/api/state-graphic-charts.ts` e `pages/api/state-map-charts.ts`. Rotas de API novas vão em
`app/api/`.

Rotas legadas de topo (`app/indicadores`, `app/termos-de-uso`, `app/politica-de-privacidade`)
convivem com as versões atuais sob `conteudos/` e `institucional/`; `app/sitemap.ts` ainda lista
URLs antigas — confira antes de assumir que uma URL é canônica.

### Componentes

`components/` usa uma pasta por componente com `index.tsx`, reexportados pelo barrel
`components/index.ts` (que é `"use client"` — importar dele arrasta o componente para o cliente;
em páginas server-side importe direto da pasta). `components/ui/` é shadcn/ui (config em
`components.json`, alias `@/*`).

Tailwind: cores por CSS variables definidas em `app/globals.css`, container com máximo em
`max-w-screen-limit` (1200px) e padding `px-5percent`. Fonte: Poppins via `next/font`.

## Variáveis de ambiente

`.env.local` (não versionado) contém hoje apenas `NEXT_PUBLIC_STRAPI_URL`. Outras usadas no
código:

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | base do Strapi para auth, painel e proxy admin (paths incluem `/api`) |
| `NEXT_PUBLIC_STRAPI_API_URL` | baseURL do `httpClient` (axios) — publicações e posts |
| `NEXT_PUBLIC_SITE_API_URL` | base usada pelo `ChartAPIService` para chamar `/state-*-charts` |
| `NEXT_PUBLIC_BI_URL` | iframe de BI em `/indicadores` |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS` | GA (opcional) |
| `GOOGLE_SHEETS_*` | service account e IDs de planilha dos gráficos/mapas |
| `DATABASE_URL` | Postgres da Biblioteca Daddus (busca e coleta de metadados) |

Atenção: `NEXT_PUBLIC_STRAPI_URL` e `NEXT_PUBLIC_STRAPI_API_URL` são variáveis distintas e as
duas precisam estar configuradas — sem a segunda, o `httpClient` fica com baseURL vazia e o
acervo volta vazio silenciosamente (os services engolem o erro e retornam lista vazia).

Imagens remotas só são permitidas de `res.cloudinary.com` (`next.config.mjs`).
