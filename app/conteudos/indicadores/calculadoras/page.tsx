import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { pageMetadata } from "@/lib/seo/metadata";

import { Cabecalho, ChamadaFinal, Trilha } from "./_components";
import {
  BASE_CALCULADORAS,
  calculadoras,
  calculadorasContent,
} from "./_constants";

export const metadata: Metadata = pageMetadata({
  title: "Calculadoras de indicadores",
  description:
    "Correção de valores por índice, juros compostos com aporte mensal e comparação entre séries — contas feitas sobre os indicadores que a Daddus republica, com a memória de cálculo à vista.",
  path: BASE_CALCULADORAS,
});

/** Indice da area: texto fixo, sem consulta ao banco. */
export const revalidate = 86400;

export default function CalculadorasPage() {
  const { eyebrow, title, lead, metodo, cta } = calculadorasContent;

  return (
    <div className="mx-auto w-full max-w-screen-limit px-5percent py-16 lg:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Indicadores", path: "/conteudos/indicadores" },
          { name: "Calculadoras", path: BASE_CALCULADORAS },
        ])}
      />

      <Trilha />
      <Cabecalho eyebrow={eyebrow} title={title} lead={lead} />

      <ul className="mt-12 grid gap-6 lg:grid-cols-3">
        {calculadoras.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${BASE_CALCULADORAS}/${item.slug}`}
              className="flex h-full flex-col rounded-lg border border-gray-200 p-6 transition-colors hover:border-primary sm:p-8"
            >
              <h2 className="text-xl font-bold text-secondary">{item.title}</h2>
              <p className="mt-3 leading-7 text-gray-600">{item.resumo}</p>
              {/* O insumo separa o que le o painel do que e so aritmetica —
                  distincao que muda o quanto o resultado depende da coleta. */}
              <p className="mt-4 text-sm leading-6 text-gray-500">
                {item.insumo}
              </p>
              <span className="mt-6 text-sm font-semibold text-primary">
                Abrir a calculadora
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-20 border-t border-gray-200 pt-10">
        <h2 className="text-xl font-bold text-secondary">{metodo.title}</h2>
        {metodo.paragraphs.map((paragrafo) => (
          <p key={paragrafo} className="mt-4 max-w-3xl leading-7 text-gray-600">
            {paragrafo}
          </p>
        ))}
      </section>

      <ChamadaFinal {...cta} />
    </div>
  );
}
