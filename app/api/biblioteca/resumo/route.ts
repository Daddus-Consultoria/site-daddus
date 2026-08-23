import { NextResponse } from "next/server";

import { getLibrarySummary } from "@/lib/biblioteca/queries";

/**
 * Retrato do acervo: numeros e temas com mais documentos.
 *
 * Existe porque a home e um client component e nao pode consultar o Postgres
 * direto (lib/db/pool.ts e so do servidor). As paginas server-side chamam
 * getLibrarySummary sem passar por aqui.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getLibrarySummary(), {
      // O acervo muda no ritmo da coleta, nao a cada visita a home.
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
    });
  } catch (error) {
    console.error("Falha ao resumir a Biblioteca:", error);

    return NextResponse.json(
      { message: "Não foi possível consultar a Biblioteca agora." },
      { status: 500 }
    );
  }
}
