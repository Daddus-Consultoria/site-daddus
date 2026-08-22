import Link from "next/link";

import { frentesHome } from "@/app/constants";
import { UltimasPublicacoes } from "@/components/relatedPublications/ultimasPublicacoes";
import {
  comoTrabalhamos,
  compromissos,
  contatoSobre,
  missao,
  publicacoesSobre,
  sobreHeader,
} from "./_constants";

/**
 * A pagina segue o mesmo padrao institucional de /tecnologia: cabecalho com
 * chapeu e resumo, secoes separadas por borda e CTA que nomeia o destino.
 *
 * O que saiu daqui: os cards de consultoria que apontavam para "#", a caixa
 * cinza de placeholder e o bloco "Negociacao de Contratos", que era texto de
 * servico solto no meio da apresentacao institucional.
 */
export default function SobrePage() {
  return (
    <main className="w-full">
      <header className="border-b border-gray-200 bg-mediumGray">
        <div className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {sobreHeader.chapeu}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-secondary lg:text-4xl">
            {sobreHeader.titulo}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#696984]">{sobreHeader.texto}</p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-screen-limit px-5percent">
        {/* As tres frentes, com o mesmo texto da home para nao divergir */}
        <section className="border-b border-gray-200 py-12 lg:py-16">
          <h2 className="text-2xl font-bold text-secondary">O que a Daddus faz</h2>
          <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#696984]">
            Três frentes que se sustentam: o conhecimento embasa a consultoria, e a consultoria mostra
            o que os sistemas precisam resolver.
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

        {/* Metodologia/abordagem — prioridade 10 das diretrizes */}
        <section className="border-b border-gray-200 py-12 lg:py-16">
          <h2 className="text-2xl font-bold text-secondary">Como trabalhamos</h2>
          <ol className="mt-8 flex flex-col gap-8">
            {comoTrabalhamos.map((passo, indice) => (
              <li
                key={passo.titulo}
                className="grid gap-x-6 gap-y-3 border-l-2 border-primary/20 pl-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:pl-8"
              >
                <div className="flex items-baseline gap-3">
                  <span aria-hidden className="text-sm font-bold text-primary">
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-bold text-secondary">{passo.titulo}</h3>
                </div>
                <div>
                  <p className="text-[17px] leading-relaxed text-[#696984]">{passo.texto}</p>
                  <Link
                    href={passo.href}
                    className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                  >
                    {passo.rotulo} →
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-b border-gray-200 py-12 lg:py-16">
          <h2 className="text-2xl font-bold text-secondary">Compromissos com o que publicamos</h2>
          <dl className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {compromissos.map((compromisso) => (
              <div key={compromisso.titulo}>
                <dt className="text-base font-bold text-primary">{compromisso.titulo}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-[#696984]">{compromisso.texto}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-b border-gray-200 py-12 lg:py-16">
          <h2 className="text-2xl font-bold text-secondary">{missao.titulo}</h2>
          <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#696984]">{missao.texto}</p>
        </section>

        {/* Producao recente: prova do que a pagina afirma. Sem publicacao
            cadastrada, o componente nao renderiza nada. */}
        <section className="py-12 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-secondary">{publicacoesSobre.titulo}</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-[#696984]">{publicacoesSobre.texto}</p>
            </div>
            <Link href={publicacoesSobre.href} className="text-sm font-semibold text-primary hover:underline">
              {publicacoesSobre.rotulo} →
            </Link>
          </div>
          <div className="mt-8 max-w-2xl">
            <UltimasPublicacoes />
          </div>
        </section>
      </div>

      <section className="border-t border-gray-200 bg-mediumGray">
        <div className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-14">
          <h2 className="text-xl font-bold text-secondary">{contatoSobre.titulo}</h2>
          <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#696984]">{contatoSobre.texto}</p>
          <p className="mt-4 text-[15px] text-[#696984]">
            E-mail:{" "}
            <a href={`mailto:${contatoSobre.email}`} className="font-semibold text-primary hover:underline">
              {contatoSobre.email}
            </a>
          </p>
          <Link
            href={contatoSobre.href}
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-90"
          >
            {contatoSobre.rotulo}
          </Link>
        </div>
      </section>
    </main>
  );
}
