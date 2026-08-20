import { NextResponse } from "next/server";
import { apiError, authorizeAdmin, readJson, strapiAdminRequest } from "@/lib/auth/adminProxy";

export async function GET(request: Request) {
  const authorization = await authorizeAdmin(request);
  if (authorization.error) return authorization.error;
  const response = await strapiAdminRequest("/api/autors?populate=avatar&sort=name:asc&pagination[limit]=100", authorization.token!);
  const payload = await readJson(response);
  if (!response.ok) return apiError(payload, "Não foi possível carregar os autores.", response.status);
  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const authorization = await authorizeAdmin(request);
  if (authorization.error) return authorization.error;
  const body = await request.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: "O nome do autor é obrigatório." }, { status: 400 });

  const response = await strapiAdminRequest("/api/autors", authorization.token!, {
    method: "POST",
    body: JSON.stringify({ data: body }),
  });
  const payload = await readJson(response);
  if (!response.ok) return apiError(payload, "Não foi possível criar o autor.", response.status);
  return NextResponse.json(payload, { status: 201 });
}
