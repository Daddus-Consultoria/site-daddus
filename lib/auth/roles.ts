export type RoleLike = {
  id?: number;
  name?: string;
  type?: string;
  attributes?: { name?: string };
  data?: { id?: number; attributes?: { name?: string } };
};

export function normalizeRoleName(name?: string) {
  return (name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
    .trim();
}

export function getRoleName(role?: RoleLike) {
  if (!role) return "";
  if (role.data?.attributes?.name) return normalizeRoleName(role.data.attributes.name);
  if (role.attributes?.name) return normalizeRoleName(role.attributes.name);
  return normalizeRoleName(role.name || role.type);
}

export function getRoleId(role?: RoleLike) {
  return role?.data?.id ?? role?.id;
}

export function isPrivilegedRole(name?: string) {
  const normalized = normalizeRoleName(name);
  return normalized === "superadm" || normalized === "superadmin" || normalized.includes("superadm") || normalized.includes("superadmin") || normalized === "adm" || normalized === "admin" || normalized === "administrator" || normalized.includes("administrador") || normalized.includes("administrator") || normalized.endsWith("admin");
}

export function canEditRole(name?: string) {
  const normalized = normalizeRoleName(name);
  return isPrivilegedRole(normalized) || normalized === "supervisor" || normalized.includes("supervisor");
}
