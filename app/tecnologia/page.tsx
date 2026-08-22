import Link from "next/link";
import { sistemas } from "./_constants";

export default function TecnologiaPage() {
  const emOperacao = sistemas.filter((sistema) => sistema.emOperacao).length;

  return (
    <main className="w-full">
      <header className="border-b border-gray-200 bg-mediumGray">
        <div className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Tecnologia</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-secondary lg:text-4xl">
            Ecossistema Daddus
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#696984]">
            Quatro sistemas desenvolvidos pela Daddus para a gestão pública. Cada um resolve uma
            frente do trabalho de uma prefeitura e pode ser contratado sozinho ou junto dos demais.
          </p>
          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
            <div>
              <dt className="text-xs uppercase tracking-wider text-[#8b8b9a]">Sistemas</dt>
              <dd className="mt-1 text-2xl font-bold text-secondary">{sistemas.length}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[#8b8b9a]">Em operação</dt>
              <dd className="mt-1 text-2xl font-bold text-secondary">{emOperacao}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[#8b8b9a]">Contratação</dt>
              <dd className="mt-1 text-base font-semibold text-secondary">Individual ou conjunta</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto w-full max-w-screen-limit px-5percent">
        {sistemas.map((sistema) => (
          <section
            key={sistema.slug}
            id={sistema.slug}
            className="scroll-mt-24 border-b border-gray-200 py-12 last:border-b-0 lg:py-16"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-primary lg:text-3xl">{sistema.nome}</h2>
                  {sistema.emOperacao ? (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Em operação
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-[#696984]">
                      Em desenvolvimento
                    </span>
                  )}
                </div>
                <p className="mt-2 text-base font-semibold text-secondary">{sistema.chamada}</p>
                <p className="mt-4 text-[17px] leading-relaxed text-[#696984]">{sistema.descricao}</p>
                <p className="mt-6 text-sm leading-relaxed text-[#8b8b9a]">
                  <span className="font-semibold text-[#696984]">Para quem: </span>
                  {sistema.publico}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 lg:p-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8b9a]">
                  O que o sistema faz
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {sistema.atividades.map((atividade) => (
                    <li key={atividade} className="flex gap-3 text-[15px] leading-relaxed text-[#696984]">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {atividade}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={`/tecnologia/${sistema.slug}`}
                    className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-90"
                  >
                    Conhecer o {sistema.nome}
                  </Link>
                  <Link
                    href={`/institucional/contato?assunto=${sistema.slug}`}
                    className="inline-flex rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-[#696984] transition hover:border-primary hover:text-primary"
                  >
                    {sistema.emOperacao ? "Solicitar apresentação" : "Falar sobre o sistema"}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="border-t border-gray-200 bg-mediumGray">
        <div className="mx-auto w-full max-w-screen-limit px-5percent py-12 lg:py-14">
          <h2 className="text-xl font-bold text-secondary">Como funciona a contratação</h2>
          <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#696984]">
            Cada sistema funciona por conta própria e resolve uma frente específica da gestão. A
            prefeitura pode começar por um e incluir os demais depois, conforme a necessidade — não
            é preciso adotar o conjunto para usar qualquer um deles.
          </p>
          <Link
            href="/institucional/contato"
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:brightness-90"
          >
            Falar com a Daddus
          </Link>
        </div>
      </section>
    </main>
  );
}
