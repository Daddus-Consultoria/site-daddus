import { NextResponse } from "next/server";
import { apiError, authorizeAdmin, readJson, strapiAdminRequest } from "@/lib/auth/adminProxy";

export async function GET(request: Request) {
  const authorization = await authorizeAdmin(request);
  if (authorization.error) return authorization.error;

  const response = await strapiAdminRequest(
    "/api/users?populate=role,avatar&pagination[limit]=100&sort=createdAt:desc",
    authorization.token!
  );
  const payload = await readJson(response);
  if (!response.ok) return apiError(payload, "Não foi possível carregar os usuários.", response.status);
  return NextResponse.json(payload);
}
