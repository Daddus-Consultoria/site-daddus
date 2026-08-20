import { NextResponse } from "next/server";
import { isPrivilegedRole, normalizeRoleName } from "@/lib/auth/roles";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

interface StrapiRole {
  id: number;
  name?: string;
}

interface StrapiUser {
  role?: {
    id?: number;
    name?: string;
  };
}

async function strapiRequest(path: string, token: string, options: RequestInit = {}) {
  return fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

async function readJson(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  if (!STRAPI_URL) {
    return NextResponse.json({ error: "STRAPI_URL não configurada." }, { status: 500 });
  }

  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!token) {
    return NextResponse.json({ error: "Sessão não autenticada." }, { status: 401 });
  }

  const meResponse = await strapiRequest("/api/users/me?populate=role", token);
  const currentUser = (await readJson(meResponse)) as StrapiUser;
  const currentRole = normalizeRoleName(currentUser.role?.name);

  if (!meResponse.ok || !currentRole || !isPrivilegedRole(currentRole)) {
    return NextResponse.json({ error: "Apenas SuperAdm ou Administrador podem criar usuários." }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as {
    username?: string;
    password?: string;
    email?: string;
    roleId?: number;
  } | null;

  if (!body?.username || !body.password || !body.roleId) {
    return NextResponse.json({ error: "Usuário, senha e nível de acesso são obrigatórios." }, { status: 400 });
  }

  const rolesResponse = await strapiRequest("/api/users-permissions/roles", token);
  const rolesPayload = await readJson(rolesResponse) as { roles?: StrapiRole[]; data?: StrapiRole[] };
  const roles = rolesPayload.roles ?? rolesPayload.data ?? [];
  const targetRole = roles.find((role) => role.id === Number(body.roleId));

  const targetRoleName = normalizeRoleName(targetRole?.name);
  if (!rolesResponse.ok || !targetRole || !targetRoleName || !["superadm", "superadmin", "adm", "admin", "administrador", "supervisor", "colaborador"].includes(targetRoleName)) {
    return NextResponse.json({ error: "Nível de acesso inválido." }, { status: 400 });
  }

  const userPayload: { username: string; password: string; role: number; email?: string } = {
    username: body.username.trim(),
    password: body.password,
    role: Number(body.roleId),
  };
  if (body.email?.trim()) userPayload.email = body.email.trim();

  const createResponse = await strapiRequest("/api/users", token, {
    method: "POST",
    body: JSON.stringify(userPayload),
  });
  const createdUser = await readJson(createResponse);

  if (!createResponse.ok) {
    return NextResponse.json(
      { error: createdUser?.error?.message || "Não foi possível criar o usuário." },
      { status: createResponse.status }
    );
  }

  return NextResponse.json(createdUser, { status: 201 });
}
