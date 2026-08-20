import { NextResponse } from "next/server";
import { apiError, authorizeAdmin, readJson, strapiAdminRequest } from "@/lib/auth/adminProxy";

interface RouteContext {
  params: { id: string };
}

export async function PUT(request: Request, context: RouteContext) {
  const authorization = await authorizeAdmin(request);
  if (authorization.error) return authorization.error;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const response = await strapiAdminRequest(`/api/users/${context.params.id}`, authorization.token!, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const payload = await readJson(response);
  if (!response.ok) return apiError(payload, "Não foi possível atualizar o usuário.", response.status);
  return NextResponse.json(payload);
}

export async function DELETE(request: Request, context: RouteContext) {
  const authorization = await authorizeAdmin(request);
  if (authorization.error) return authorization.error;

  const response = await strapiAdminRequest(`/api/users/${context.params.id}`, authorization.token!, {
    method: "DELETE",
  });
  const payload = await readJson(response);
  if (!response.ok) return apiError(payload, "Não foi possível excluir o usuário.", response.status);
  return NextResponse.json(payload);
}
