import Link from "next/link";
import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

/**
 * Pagina de endereco inexistente.
 *
 * Sem este arquivo o Next serve o proprio 404: um bloco em ingles ("This page
 * could not be found") no meio de um site em portugues, sem nenhum caminho de
 * volta. Isso passou a pesar depois que o sitemap comecou a anunciar dezenas de
 * milhares de fichas da Biblioteca — endereco que sai do acervo tambem pode
 * deixar de existir, e quem chega por busca cai justamente aqui.
 *
 * As saidas nao sao um menu repetido do cabecalho: sao as tres frentes, na
 * ordem em que o site as apresenta, para que a pagina resolva a visita em vez
 * de so informar o erro. Ver docs/DIRETRIZES-UX.md.
 */
export const metadata: Metadata = pageMetadata({
  title: "Página não encontrada",
  description: "O endereço buscado não existe ou saiu do ar.",
  path: "/404",
  index: false,
});

const saidas = [
  {
    titulo: "Biblioteca Daddus",
    descricao:
      "Busca em acervos públicos e acadêmicos, com filtro por tema, tipo e ano.",
    href: "/biblioteca",
  },
  {
    titulo: "Publicações",
    descricao: "Estudos, guias e perfis municipais produzidos pela Daddus.",
    href: "/conteudos/publicacoes",
  },
  {
    titulo: "Blog",
    descricao: "Análises sobre gestão, políticas públicas e infraestrutura.",
    href: "/blog",
  },
];

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-screen-limit px-5percent py-16 lg:py-24">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        Erro 404
      </p>

      <h1 className="mt-3 text-3xl font-bold text-secondary lg:text-4xl">
        Não encontramos esta página
      </h1>

      <p className="mt-4 max-w-2xl leading-7 text-gray-600">
        O endereço pode ter mudado, o documento pode ter saído do acervo de
        origem ou o link pode estar incompleto. Abaixo estão os caminhos mais
        prováveis para o que você procurava.
      </p>

      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {saidas.map((saida) => (
          <li key={saida.href}>
            <Link
              href={saida.href}
              className="flex h-full flex-col rounded-lg border border-gray-200 p-6 transition-colors hover:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="text-lg font-bold text-secondary">
                {saida.titulo}
              </span>
              <span className="mt-2 text-sm leading-6 text-gray-600">
                {saida.descricao}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-gray-600">
        Se você chegou aqui por um link do próprio site,{" "}
        <Link
          href="/institucional/contato"
          className="font-semibold text-primary underline"
        >
          avise a equipe
        </Link>{" "}
        — corrigimos o caminho.
      </p>
    </div>
  );
}
