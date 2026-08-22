import Link from "next/link";

import { encontrarSistema } from "@/app/tecnologia/_constants";
import { contratacaoSolucoes, necessidades, solucoesHeader } from "./_constants";

/**
 * A pagina entra pela necessidade e so depois nomeia o produto ou o servico,
 * como pede a secao 10 das diretrizes. O estado de cada sistema vem do proprio
 * Ecossistema Daddus, para que "em desenvolvimento" nunca fique desatualizado
 * em duas listas diferentes.
 */
export default function SolucoesPage() {
  const frentes = Array.from(new Set(necessidades.map((item) => item.frente)));

  return (
    <main className="w-full">
      <header className="border-b border-gray-200 bg-mediumGray">
        <div className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {solucoesHeader.chapeu}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-secondary lg:text-4xl">
            {solucoesHeader.titulo}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#696984]">{solucoesHeader.texto}</p>
          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
            <div>
              <dt className="text-xs uppercase tracking-wider text-[#8b8b9a]">Necessidades atendidas</dt>
              <dd className="mt-1 text-2xl font-bold text-secondary">{necessidades.length}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[#8b8b9a]">Frentes envolvidas</dt>
              <dd className="mt-1 text-base font-semibold text-secondary">{frentes.join(" · ")}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[#8b8b9a]">Contratação</dt>
              <dd className="mt-1 text-base font-semibold text-secondary">Individual ou conjunta</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto w-full max-w-screen-limit px-5percent">
        {necessidades.map((item) => {
          const sistema = item.sistemaSlug ? encontrarSistema(item.sistemaSlug) : undefined;
          const emDesenvolvimento = sistema ? !sistema.emOperacao : false;

          return (
            <section
              key={item.necessidade}
              className="border-b border-gray-200 py-10 last:border-b-0 lg:py-12"
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8b9a]">
                    {item.frente}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-secondary lg:text-2xl">{item.necessidade}</h2>
                  <p className="mt-4 text-[17px] leading-relaxed text-[#696984]">{item.contexto}</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 lg:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8b9a]">
                      O que a Daddus faz
                    </h3>
                    {emDesenvolvimento && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-[#696984]">
                        Em desenvolvimento
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#696984]">{item.resposta}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href={item.destino.href}
                      className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-90"
                    >
                      {item.destino.rotulo}
                    </Link>
                    <Link
                      href={
                        item.sistemaSlug
                          ? `/institucional/contato?assunto=${item.sistemaSlug}`
                          : "/institucional/contato"
                      }
                      className="inline-flex rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-[#696984] transition hover:border-primary hover:text-primary"
                    >
                      {item.sistemaSlug && !emDesenvolvimento ? "Solicitar apresentação" : "Falar com a Daddus"}
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="border-t border-gray-200 bg-mediumGray">
        <div className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-14">
          <h2 className="text-xl font-bold text-secondary">{contratacaoSolucoes.titulo}</h2>
          <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#696984]">
            {contratacaoSolucoes.texto}
          </p>
          <Link
            href={contratacaoSolucoes.href}
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-90"
          >
            {contratacaoSolucoes.rotulo}
          </Link>
        </div>
      </section>
    </main>
  );
}
