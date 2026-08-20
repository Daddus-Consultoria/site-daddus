"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Check, LoaderCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

const supportedRoles = new Set(["superadm", "adm", "supervisor", "colaborador"]);

function roleLabel(roleName: string) {
  const labels: Record<string, string> = {
    superadm: "SuperAdm",
    adm: "Administrador",
    supervisor: "Supervisor",
    colaborador: "Colaborador",
  };
  return labels[roleName.toLowerCase()] || roleName;
}

export default function NewUserPage() {
  const router = useRouter();
  const { user, isLoading, isRoleLoading, isPrivileged, roles, getToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isRoleLoading && (!user || !isPrivileged())) {
      router.replace("/painel");
    }
  }, [isLoading, isRoleLoading, isPrivileged, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const token = getToken();
      if (!token) throw new Error("Sessão não autenticada.");

      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          password,
          email: email || undefined,
          roleId: Number(roleId),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Não foi possível criar o usuário.");

      setSuccess(true);
      setUsername("");
      setPassword("");
      setEmail("");
      setRoleId("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Não foi possível criar o usuário.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || isRoleLoading || !user) {
    return <div className="flex min-h-[calc(100vh-13rem)] items-center justify-center text-gray-500">Validando acesso...</div>;
  }

  if (!isPrivileged()) return null;

  const availableRoles = roles.filter((role) => supportedRoles.has(role.name.toLowerCase()));

  return (
    <section className="min-h-[calc(100vh-13rem)] bg-[#f5f7f9] px-5 py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Voltar ao painel
        </Link>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><ShieldCheck className="h-6 w-6" /></div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-primary">Administração</p>
            <h1 className="mt-1 text-3xl font-bold text-[#0d0d0d]">Gerenciar usuários</h1>
            <p className="mt-2 text-sm text-gray-500">Crie um acesso e defina o nível de permissão no sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-semibold text-gray-700">
              Nome de usuário *
              <input required minLength={3} value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" autoComplete="username" />
            </label>
            <label className="block text-sm font-semibold text-gray-700">
              Senha *
              <input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" autoComplete="new-password" />
            </label>
            <label className="block text-sm font-semibold text-gray-700">
              E-mail <span className="font-normal text-gray-400">(opcional)</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" autoComplete="email" />
            </label>
            <label className="block text-sm font-semibold text-gray-700">
              Nível de acesso *
              <select required value={roleId} onChange={(event) => setRoleId(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="">Selecione um nível</option>
                {availableRoles.map((role) => <option key={role.id} value={role.id}>{roleLabel(role.name)}</option>)}
              </select>
              {roles.length === 0 && <span className="mt-2 block text-xs font-normal text-amber-700">As roles não foram carregadas. Verifique a permissão de leitura de roles no Strapi.</span>}
            </label>

            {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {success && <p className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"><Check className="h-4 w-4" /> Usuário criado com sucesso.</p>}
            <button type="submit" disabled={isSubmitting || !roleId} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Criando usuário..." : "Criar usuário"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
