"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Fronteira de erro do site.
 *
 * Sem este arquivo, qualquer excecao no servidor chega ao visitante como a tela
 * crua do Next ("Application error"), sem cabecalho, sem rodape e sem acao.
 *
 * Este caminho e alcancavel de proposito, e nao so por acidente: a pagina de
 * publicacao deixa a falha de rede subir como erro em vez de virar 404, porque
 * 404 diria ao buscador que a publicacao deixou de existir (ver o comentario em
 * `app/conteudos/publicacoes/_publishPage.tsx`). O texto aqui acompanha essa
 * decisao — fala em indisponibilidade temporaria, nao em pagina inexistente.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // O digest e o que liga esta tela a linha correspondente no log do
    // servidor; sem ele, um relato de erro nao tem por onde ser investigado.
    console.error("Erro na página:", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-screen-limit px-5percent py-16 lg:py-24">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        Erro inesperado
      </p>

      <h1 className="mt-3 text-3xl font-bold text-secondary lg:text-4xl">
        Esta página não carregou
      </h1>

      <p className="mt-4 max-w-2xl leading-7 text-gray-600">
        A falha costuma ser temporária — em geral uma indisponibilidade de quem
        fornece o conteúdo. A página continua existindo; tente novamente em
        instantes.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Tentar novamente
        </button>

        <Link
          href="/"
          className="font-semibold text-primary underline underline-offset-4"
        >
          Ir para a página inicial
        </Link>
      </div>

      {error.digest ? (
        <p className="mt-10 text-sm text-gray-500">
          Se o erro persistir, informe este código à equipe:{" "}
          <code className="font-mono text-secondary">{error.digest}</code>
        </p>
      ) : null}
    </div>
  );
}
