"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Edit3, KeyRound, LoaderCircle, Plus, Trash2, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, AuthRole } from "@/lib/auth/auth-context";
import { strapiAuthenticatedFetch } from "@/lib/services/strapiAuthenticatedFetch";

interface AdminUser {
  id: number;
  username: string;
  email?: string;
  blocked?: boolean;
  role?: { id: number; name?: string };
  avatar?: { id: number; url?: string; attributes?: { url?: string } };
}

const roleLabels: Record<string, string> = {
  superadm: "SuperAdm",
  adm: "Administrador",
  supervisor: "Supervisor",
  colaborador: "Colaborador",
};

function roleLabel(name?: string) {
  return name ? roleLabels[name.toLowerCase()] || name : "Sem role";
}

function mediaUrl(url?: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
}

function avatarUrl(user: AdminUser) {
  return mediaUrl(user.avatar?.url || user.avatar?.attributes?.url);
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-[#0d0d0d]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-primary"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const { user, isLoading, isRoleLoading, canManageAdministration, roles, getToken } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<AdminUser | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
  }, [isLoading, isRoleLoading, canManageAdministration, router, user]);

  useEffect(() => {
    if (isLoading || isRoleLoading || !user || !canManageAdministration()) return;

    async function loadUsers() {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        if (!token) throw new Error("Sessão não autenticada.");
        const response = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
        const payload = await response.json();
        if (!response.ok) throw new Error(response.status === 403 ? "O Strapi bloqueou a listagem. Na role do usuário, habilite User > find e findOne em Users & Permissions > Roles." : payload?.error || "Não foi possível carregar os usuários.");
        setUsers(Array.isArray(payload) ? payload : payload.data ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar os usuários.");
      } finally {
        setLoading(false);
      }
    }

    void loadUsers();
  }, [canManageAdministration, getToken, isLoading, isRoleLoading, user]);

  async function deleteUser(target: AdminUser) {
    if (!window.confirm(`Tem certeza que deseja remover o usuário ${target.username}?`)) return;
    setDeletingId(target.id);
    setError("");
    try {
      const token = getToken();
      const response = await fetch(`/api/admin/users/${target.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Não foi possível excluir o usuário.");
      setUsers((current) => current.filter((item) => item.id !== target.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Não foi possível excluir o usuário.");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading || isRoleLoading || !user) return <div className="flex min-h-[calc(100vh-13rem)] items-center justify-center text-gray-500">Validando acesso...</div>;
  if (!canManageAdministration()) return <AccessDenied />;

  return (
    <section className="min-h-[calc(100vh-13rem)] bg-[#f5f7f9] px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Administração</p><h1 className="mt-2 text-3xl font-bold text-[#0d0d0d]">Usuários</h1><p className="mt-2 text-gray-500">Gerencie acessos e níveis de permissão.</p></div>
          <Link href="/painel/usuarios/novo" className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:brightness-90"><Plus className="h-4 w-4" /> Novo usuário</Link>
        </div>
        {error && <p role="alert" className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading ? <div className="p-10 text-center text-gray-500">Carregando usuários...</div> : users.length === 0 ? <div className="p-10 text-center text-gray-500">Nenhum usuário encontrado.</div> : (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500"><tr><th className="px-5 py-4">Avatar</th><th className="px-5 py-4">Usuário</th><th className="px-5 py-4">E-mail</th><th className="px-5 py-4">Nível de acesso</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Ações</th></tr></thead>
              <tbody className="divide-y divide-gray-100">{users.map((item) => { const image = avatarUrl(item); return <tr key={item.id} className="hover:bg-gray-50"><td className="px-5 py-4"><span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-white">{image ? <img src={image} alt={`Avatar de ${item.username}`} className="h-full w-full object-cover" /> : item.username.slice(0, 2).toUpperCase()}</span></td><td className="px-5 py-4 font-semibold text-[#0d0d0d]">{item.username}</td><td className="px-5 py-4 text-gray-500">{item.email || "Não informado"}</td><td className="px-5 py-4"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{roleLabel(item.role?.name)}</span></td><td className="px-5 py-4"><span className={`font-semibold ${item.blocked ? "text-red-600" : "text-green-600"}`}>{item.blocked ? "Bloqueado" : "Ativo"}</span></td><td className="px-5 py-4"><div className="flex gap-2"><button type="button" title="Editar" onClick={() => setEditingUser(item)} className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:border-primary hover:text-primary"><Edit3 className="h-4 w-4" /></button><button type="button" title="Alterar senha" onClick={() => setPasswordUser(item)} className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:border-primary hover:text-primary"><KeyRound className="h-4 w-4" /></button><button type="button" title="Excluir" disabled={deletingId === item.id} onClick={() => void deleteUser(item)} className="rounded-lg border border-red-200 p-2 text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button></div></td></tr>; })}</tbody>
            </table>
          )}
        </div>
      </div>
      {editingUser && <EditUserModal user={editingUser} roles={roles} token={getToken()} onClose={() => setEditingUser(null)} onSaved={(updated) => { setUsers((current) => current.map((item) => item.id === updated.id ? { ...item, ...updated } : item)); setEditingUser(null); }} />}
      {passwordUser && <PasswordModal user={passwordUser} token={getToken()} onClose={() => setPasswordUser(null)} />}
    </section>
  );
}

function AccessDenied() {
  return <section className="flex min-h-[calc(100vh-13rem)] items-center justify-center bg-[#f5f7f9] px-5"><div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-center text-red-700"><h1 className="font-bold">Acesso não permitido ao usuário</h1><p className="mt-1 text-sm">Seu nível de acesso não permite gerenciar usuários.</p></div></section>;
}

function EditUserModal({ user, roles, token, onClose, onSaved }: { user: AdminUser; roles: AuthRole[]; token: string | null; onClose: () => void; onSaved: (user: AdminUser) => void }) {
  const [username, setUsername] = useState(user.username);
  const [roleId, setRoleId] = useState(String(user.role?.id || ""));
  const [blocked, setBlocked] = useState(Boolean(user.blocked));
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(avatarUrl(user));
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      let avatarId: number | null | undefined;
      if (avatarFile) {
        const formData = new FormData(); formData.append("files", avatarFile);
        const uploaded = await strapiAuthenticatedFetch<Array<{ id: number }>>("/api/upload", { method: "POST", body: formData });
        avatarId = uploaded[0]?.id;
      } else if (removeAvatar) avatarId = null;
      const response = await fetch(`/api/admin/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ username, role: Number(roleId), blocked, ...(avatarId !== undefined ? { avatar: avatarId } : {}) }) });
      const payload = await response.json(); if (!response.ok) throw new Error(payload?.error || "Não foi possível atualizar o usuário.");
      onSaved(payload);
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Não foi possível atualizar o usuário."); } finally { setSaving(false); }
  }

  return <Modal title={`Editar ${user.username}`} onClose={onClose}><form onSubmit={submit} className="space-y-5"><label className="block text-sm font-semibold text-gray-700">Nome de usuário<input required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label><label className="block text-sm font-semibold text-gray-700">Nível de acesso<select required value={roleId} onChange={(event) => setRoleId(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3">{roles.map((role) => <option key={role.id} value={role.id}>{roleLabel(role.name)}</option>)}</select></label><label className="flex items-center gap-3 text-sm font-semibold text-gray-700"><input type="checkbox" checked={blocked} onChange={(event) => setBlocked(event.target.checked)} /> Usuário bloqueado</label><div><p className="text-sm font-semibold text-gray-700">Avatar</p><div className="mt-2 flex items-center gap-4"><span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-white">{preview ? <img src={preview} alt="Preview do avatar" className="h-full w-full object-cover" /> : <UserRound className="h-6 w-6" />}</span><label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary">Trocar avatar<input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setAvatarFile(file); setRemoveAvatar(false); setPreview(URL.createObjectURL(file)); } }} /></label>{preview && <button type="button" onClick={() => { setPreview(""); setAvatarFile(null); setRemoveAvatar(true); }} className="text-sm font-semibold text-red-700">Remover</button>}</div></div>{error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<button disabled={saving} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white disabled:opacity-60">{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}{saving ? "Salvando..." : "Salvar alterações"}</button></form></Modal>;
}

function PasswordModal({ user, token, onClose }: { user: AdminUser; token: string | null; onClose: () => void }) {
  const [password, setPassword] = useState(""); const [confirmation, setConfirmation] = useState(""); const [error, setError] = useState(""); const [saved, setSaved] = useState(false); const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setError(""); if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; } if (password !== confirmation) { setError("As senhas não conferem."); return; } setSaving(true); try { const response = await fetch(`/api/admin/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ password }) }); const payload = await response.json(); if (!response.ok) throw new Error(payload?.error || "Não foi possível alterar a senha."); setSaved(true); setTimeout(onClose, 700); } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Não foi possível alterar a senha."); } finally { setSaving(false); } }
  return <Modal title={`Alterar senha de ${user.username}`} onClose={onClose}><form onSubmit={submit} className="space-y-5"><label className="block text-sm font-semibold text-gray-700">Nova senha<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label><label className="block text-sm font-semibold text-gray-700">Confirmar nova senha<input required type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label>{error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{saved && <p className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"><Check className="h-4 w-4" /> Senha alterada.</p>}<button disabled={saving} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white disabled:opacity-60">{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}{saving ? "Salvando..." : "Alterar senha"}</button></form></Modal>;
}
