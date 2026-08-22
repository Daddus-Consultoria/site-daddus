import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contratacao, encontrarSistema, sistemas } from "../_constants";

export function generateStaticParams() {
  return sistemas.map((sistema) => ({ sistema: sistema.slug }));
}

export function generateMetadata({ params }: { params: { sistema: string } }): Metadata {
  const sistema = encontrarSistema(params.sistema);
  if (!sistema) return {};
  return {
    title: `${sistema.nome} | ${sistema.chamada} | Daddus`,
    description: sistema.descricao,
  };
}

export default function SistemaPage({ params }: { params: { sistema: string } }) {
  const sistema = encontrarSistema(params.sistema);
  if (!sistema) notFound();

  const outros = sistemas.filter((item) => item.slug !== sistema.slug);

  return (
    <main className="w-full">
      <header className="border-b border-gray-200 bg-mediumGray">
        <div className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-16">
          <nav aria-label="Você está em" className="text-sm text-[#8b8b9a]">
            <Link href="/tecnologia" className="hover:text-primary">
              Ecossistema Daddus
            </Link>
            <span className="mx-2" aria-hidden>
              ›
            </span>
            <span className="text-[#696984]">{sistema.nome}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-secondary lg:text-4xl">{sistema.nome}</h1>
            {sistema.emOperacao ? (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Em operação
              </span>
            ) : (
              <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-[#696984]">
                Em desenvolvimento
              </span>
            )}
          </div>
          <p className="mt-2 text-lg font-semibold text-primary">{sistema.chamada}</p>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[#696984]">{sistema.descricao}</p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-screen-limit px-5percent">
        <section className="border-b border-gray-200 py-12 lg:py-14">
          <h2 className="text-xl font-bold text-secondary">O problema que resolve</h2>
          <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-[#696984]">{sistema.problema}</p>
          <p className="mt-6 text-sm leading-relaxed text-[#8b8b9a]">
            <span className="font-semibold text-[#696984]">Indicado para: </span>
            {sistema.publico}
          </p>
        </section>

        <section className="border-b border-gray-200 py-12 lg:py-14">
          <h2 className="text-xl font-bold text-secondary">O que o sistema faz</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {sistema.atividades.map((atividade) => (
              <li
                key={atividade}
                className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 text-[15px] leading-relaxed text-[#696984]"
              >
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {atividade}
              </li>
            ))}
          </ul>
        </section>

        {sistema.imagem && (
          <section className="border-b border-gray-200 py-12 lg:py-14">
            <h2 className="text-xl font-bold text-secondary">A interface</h2>
            <figure className="mt-6">
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <Image
                  src={sistema.imagem.src}
                  alt={sistema.imagem.alt}
                  width={1440}
                  height={620}
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-sm text-[#8b8b9a]">{sistema.imagem.legenda}</figcaption>
            </figure>
          </section>
        )}

        <section className="border-b border-gray-200 py-12 lg:py-14">
          <h2 className="text-xl font-bold text-secondary">O que muda na rotina</h2>
          <ul className="mt-6 flex flex-col gap-4">
            {sistema.beneficios.map((beneficio) => (
              <li key={beneficio} className="flex gap-3 text-[17px] leading-relaxed text-[#696984]">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {beneficio}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-b border-gray-200 py-12 lg:py-14">
          <h2 className="text-xl font-bold text-secondary">Contratação</h2>
          <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-[#696984]">{contratacao}</p>
          <Link
            href={`/institucional/contato?assunto=${sistema.slug}`}
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-90"
          >
            {sistema.emOperacao ? `Solicitar apresentação do ${sistema.nome}` : `Falar sobre o ${sistema.nome}`}
          </Link>
        </section>

        <section className="py-12 lg:py-14">
          <h2 className="text-xl font-bold text-secondary">Outros sistemas do ecossistema</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {outros.map((item) => (
              <Link
                key={item.slug}
                href={`/tecnologia/${item.slug}`}
                className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-primary/40"
              >
                <p className="text-lg font-bold text-primary">{item.nome}</p>
                <p className="mt-1 text-sm font-semibold text-secondary">{item.chamada}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#696984]">{item.descricao}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-primary">
                  Conhecer o {item.nome}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
