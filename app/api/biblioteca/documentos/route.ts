import { NextResponse } from "next/server";

import { searchLibrary } from "@/lib/biblioteca/queries";
import { parseLibraryQuery } from "@/lib/biblioteca/searchParams";

/**
 * Busca da Biblioteca. Publica e somente leitura: expoe metadados de fontes
 * abertas, os mesmos que a pagina mostra.
 *
 * Roda no Node (o driver do Postgres nao funciona no edge) e nunca e
 * pre-renderizada, porque a resposta depende inteiramente da query string.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const result = await searchLibrary(parseLibraryQuery(searchParams));

    return NextResponse.json(result, {
      // O acervo muda no ritmo da coleta (semanal), nao a cada requisicao.
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
    });
  } catch (error) {
    // 42P01 = tabela inexistente. E o sintoma de migrations aplicadas em outro
    // banco (tipicamente o local), e sem esta dica o log so diz "relation does
    // not exist" — que nao aponta para a causa.
    if ((error as { code?: string })?.code === "42P01") {
      console.error(
        "Biblioteca: as tabelas nao existem no banco de DATABASE_URL. " +
          "Rode `yarn db:migrate` e `yarn harvest ipea --full` apontando para ele " +
          "(`yarn biblioteca:status` confirma)."
      );
    }

    console.error("Falha na busca da Biblioteca:", error);

    return NextResponse.json(
      { message: "Não foi possível consultar a Biblioteca agora." },
      { status: 500 }
    );
  }
}
