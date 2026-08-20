import { NextResponse } from "next/server";
import { getRoleName, isPrivilegedRole } from "@/lib/auth/roles";

export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export interface ProxyRole {
  id: number;
  name?: string;
}

export async function readJson(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
}

export async function strapiAdminRequest(path: string, token: string, options: RequestInit = {}) {
  return fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

export async function authorizeAdmin(request: Request) {
  if (!STRAPI_URL) {
    return { error: NextResponse.json({ error: "STRAPI_URL não configurada." }, { status: 500 }) };
  }

  const token = getBearerToken(request);
  if (!token) {
    return { error: NextResponse.json({ error: "Sessão não autenticada." }, { status: 401 }) };
  }

  let response = await strapiAdminRequest("/api/users/me?populate=role", token);
  let user = await readJson(response) as { role?: { name?: string; attributes?: { name?: string }; data?: { attributes?: { name?: string } } } };
  let roleName = getRoleName(user.role);

  if (response.ok && !roleName) {
    response = await strapiAdminRequest("/api/users/me?populate=*", token);
    user = await readJson(response) as typeof user;
    roleName = getRoleName(user.role);
  }

  if (!response.ok || !roleName || !isPrivilegedRole(roleName)) {
    return { error: NextResponse.json({ error: "Acesso não permitido ao usuário" }, { status: 403 }) };
  }

  return { token };
}

export function apiError(payload: { error?: { message?: string } }, fallback: string, status: number) {
  if (status === 403) return NextResponse.json({ error: "Acesso não permitido ao usuário" }, { status: 403 });
  return NextResponse.json({ error: payload?.error?.message || fallback }, { status });
}
