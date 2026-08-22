"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { CardPublication, CircularProgressIndicator, BlogPostCard, Skeleton } from "@/components/index";
import { consultoriaHome, contatoHome, frentesHome, heroHome, institucionalHome } from "@/app/constants";
import { sistemas } from "@/app/tecnologia/_constants";
import { QueryKeys } from "@/lib/constants/queryKeys";
import { transformCategory } from "@/lib/constants/constants";
import { PublishModel } from "@/lib/interfaces/publish";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";
import { PostsUseCases } from "@/lib/useCases/postsUseCases";

import "@/styles/home.css";

/**
 * A home apresenta a Daddus e o que ela produz, na ordem da secao 5 das
 * diretrizes: quem somos, o que produzimos, as tres frentes, os sistemas, a
 * producao recente e o contato.
 *
 * Os numeros vem do acervo publicado no CMS — nao ha valor institucional
 * escrito a mao aqui, justamente para nao envelhecer nem afirmar o que nao se
 * pode conferir.
 */
async function carregarHome() {
  const publicacoes = new PublishUseCases();
  const posts = new PostsUseCases();

  const [estudos, guias, perfis, blog] = await Promise.all([
    publicacoes.getPaginatedStudies({ page: 1, limit: 3, order: "desc" }),
    publicacoes.getPaginatedGuides({ page: 1, limit: 3, order: "desc" }),
    publicacoes.getPaginatedMunicipalProfiles({ page: 1, limit: 3, order: "desc" }),
    posts.getPosts({}),
  ]);

  const ultimasPublicacoes = [...estudos.items, ...guias.items, ...perfis.items]
    .sort((a, b) => new Date(b.publishDate ?? 0).getTime() - new Date(a.publishDate ?? 0).getTime())
    .slice(0, 3);

  const ultimosPosts = [...blog.posts].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  return {
    ultimasPublicacoes,
    ultimosPosts,
    numeros: [
      { valor: estudos.totalItems, rotulo: "Estudos publicados", href: "/conteudos/publicacoes/estudos" },
      { valor: guias.totalItems, rotulo: "Guias técnicos", href: "/conteudos/publicacoes/guias" },
      { valor: perfis.totalItems, rotulo: "Perfis municipais", href: "/conteudos/publicacoes/perfis-municipais" },
      { valor: blog.totalItems, rotulo: "Análises no Insights", href: "/blog" },
    ],
  };
}

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QueryKeys.allPublishs, "home"],
    queryFn: carregarHome,
    // Uma nova tentativa basta: se o acervo nao responder, e melhor a home
    // seguir sem a secao de numeros do que deixar esqueleto girando na tela.
    retry: 1,
  });

  // Se o acervo nao responder, a secao de numeros nao aparece. Numero zerado ou
  // esqueleto eterno diz ao visitante algo que nao e verdade.
  const mostrarNumeros = !isError && (isLoading || Boolean(data?.numeros?.length));

  return (
    <main className="w-full">
      {/* 1. Hero institucional */}
      <section className="first-section relative">
        <div className="title-container relative z-2 flex flex-col justify-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.14em]">{heroHome.chapeu}</p>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight lg:text-4xl">{heroHome.titulo}</h1>
          <p className="mt-4 text-base leading-relaxed lg:text-lg">{heroHome.texto}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {heroHome.acoes.map((acao, indice) => (
              <Link
                key={acao.href}
                href={acao.href}
                className={
                  indice === 0
                    ? "rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
                    : "rounded-lg border border-white/70 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-primary"
                }
              >
                {acao.rotulo}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. O acervo em numeros, direto do CMS */}
      {mostrarNumeros && (
      <section className="border-b border-gray-200 bg-mediumGray">
        <div className="mx-auto w-full max-w-screen-limit px-5percent py-10 lg:py-12">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8b9a]">
            O acervo da Daddus
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {(data?.numeros ?? [1, 2, 3, 4].map(() => null)).map((numero, indice) =>
              numero ? (
                <Link key={numero.rotulo} href={numero.href} className="group">
                  <dt className="text-sm text-[#696984] group-hover:text-primary">{numero.rotulo}</dt>
                  <dd className="mt-1 text-3xl font-bold text-secondary lg:text-4xl">{numero.valor}</dd>
                </Link>
              ) : (
                <div key={`numero-vazio-${indice}`}>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="mt-3 h-8 w-12 animate-pulse rounded bg-gray-200" />
                </div>
              )
            )}
          </dl>
          <p className="mt-6 text-xs text-[#8b8b9a]">
            Contagem do que está publicado no site, atualizada a cada acesso.
          </p>
        </div>
      </section>
      )}

      {/* 3. As tres frentes */}
      <section className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-16">
        <h2 className="text-2xl font-bold text-secondary">Como a Daddus trabalha</h2>
        <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#696984]">
          Três frentes que se apoiam: o conhecimento sustenta a consultoria, e a consultoria mostra o
          que os sistemas precisam resolver.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {frentesHome.map((frente) => (
            <div key={frente.titulo} className="flex flex-col rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-bold text-primary">{frente.titulo}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#696984]">{frente.descricao}</p>
              <Link href={frente.href} className="mt-5 text-sm font-semibold text-primary hover:underline">
                {frente.rotulo} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Ecossistema Daddus */}
      <section className="border-y border-gray-200 bg-mediumGray">
        <div className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-16">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-secondary">Ecossistema Daddus</h2>
              <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-[#696984]">
                Quatro sistemas para a gestão pública. Cada um resolve uma frente do trabalho de uma
                prefeitura e pode ser contratado sozinho ou junto dos demais.
              </p>
            </div>
            <Link href="/tecnologia" className="mt-1 shrink-0 text-sm font-semibold text-primary hover:underline">
              Ver o ecossistema →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sistemas.map((sistema) => (
              <Link
                key={sistema.slug}
                href={`/tecnologia/${sistema.slug}`}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:border-primary/40"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{sistema.nome}</span>
                  {!sistema.emOperacao && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-[#696984]">
                      Em desenvolvimento
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold text-secondary">{sistema.chamada}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#696984]">{sistema.descricao}</p>
                <span className="mt-4 text-sm font-semibold text-primary">Conhecer o {sistema.nome} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Producao recente */}
      <section className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Publicado recentemente</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-[#696984]">
              Estudos, guias e perfis municipais com metodologia e fontes descritas.
            </p>
          </div>
          <Link href="/conteudos/publicacoes" className="text-sm font-semibold text-primary hover:underline">
            Ver todas as publicações →
          </Link>
        </div>

        {isLoading ? (
          <CircularProgressIndicator containerHeight="300px" />
        ) : data?.ultimasPublicacoes.length ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {data.ultimasPublicacoes.map((item: PublishModel) => (
              <CardPublication
                id={item.id}
                key={`publicacao-${item.slug}`}
                image={item.imageUrl}
                description={item.shortDescription}
                title={item.title}
                path={`/conteudos/publicacoes/${transformCategory[item.category]}/${item.slug}`}
              />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center text-[#696984]">
            Nenhuma publicação disponível no momento.
          </p>
        )}
      </section>

      {/* 6. Indicadores */}
      <section className="border-y border-gray-200 bg-mediumGray">
        <div className="mx-auto grid w-full max-w-screen-limit gap-8 px-5percent py-12 lg:grid-cols-2 lg:items-center lg:py-16">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Indicadores</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-[#696984]">
              Séries e mapas organizados pela Daddus a partir de bases públicas, para consulta por
              tema e por território.
            </p>
            <Link
              href="/conteudos/indicadores"
              className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-90"
            >
              Explorar indicadores
            </Link>
          </div>
          <div className="relative h-56 w-full overflow-hidden rounded-xl border border-gray-200 bg-white lg:h-64">
            <Image
              src="/images/publications/bus.svg"
              alt="Ilustração de indicadores de mobilidade urbana"
              fill
              className="object-contain p-8"
            />
          </div>
        </div>
      </section>

      {/* 7. Consultoria */}
      <section className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-16">
        <h2 className="text-2xl font-bold text-secondary">{consultoriaHome.titulo}</h2>
        <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#696984]">{consultoriaHome.texto}</p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {consultoriaHome.areas.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              className="flex flex-col rounded-xl border border-gray-200 p-6 transition hover:border-primary/40"
            >
              <h3 className="text-lg font-bold text-primary">{area.titulo}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#696984]">{area.descricao}</p>
              <span className="mt-5 text-sm font-semibold text-primary">Conhecer o serviço →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. Insights do blog */}
      {!isLoading && data?.ultimosPosts && data.ultimosPosts.length > 0 && (
        <section className="border-t border-gray-200">
          <div className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-secondary">Insights</h2>
              <Link href="/blog" className="text-sm font-semibold text-primary hover:underline">
                Ver todas as análises →
              </Link>
            </div>
            <div className="mt-8 flex flex-col gap-6 lg:h-[420px] lg:flex-row">
              <div className="h-56 w-full lg:h-full lg:w-[62%]">
                <BlogPostCard
                  title={data.ultimosPosts[0].title}
                  image={data.ultimosPosts[0].image}
                  first
                  href={data.ultimosPosts[0].slug}
                  badgeTitle={data.ultimosPosts[0].category}
                />
              </div>
              <div className="flex w-full flex-col gap-6 lg:w-[38%]">
                {data.ultimosPosts.slice(1, 3).map((post) => (
                  <div key={post.slug} className="h-52 w-full lg:h-1/2">
                    <BlogPostCard
                      title={post.title}
                      image={post.image}
                      href={post.slug}
                      badgeTitle={post.category}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9. Institucional e contato */}
      <section className="border-t border-gray-200 bg-mediumGray">
        <div className="mx-auto grid w-full max-w-screen-limit gap-10 px-5percent py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <h2 className="text-2xl font-bold text-secondary">{institucionalHome.titulo}</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-[#696984]">{institucionalHome.texto}</p>
            <Link href={institucionalHome.href} className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">
              {institucionalHome.rotulo} →
            </Link>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-7">
            <h2 className="text-xl font-bold text-secondary">{contatoHome.titulo}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#696984]">{contatoHome.texto}</p>
            <Link
              href={contatoHome.href}
              className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-90"
            >
              {contatoHome.rotulo}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
