"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Edit3, LoaderCircle, Plus, Trash2, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { strapiAuthenticatedFetch } from "@/lib/services/strapiAuthenticatedFetch";

interface Author {
  id: number;
  attributes?: {
    name?: string;
    email?: string;
    profession?: string;
    publishedDate?: string;
    summary?: string;
    avatar?: { data?: { attributes?: { url?: string } } };
  };
}

function imageUrl(url?: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
}

export default function AuthorsPage() {
  const router = useRouter();
  const { user, isLoading, isRoleLoading, canManageContent, getToken } = useAuth();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [summary, setSummary] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (!isLoading && !isRoleLoading && (!user || !canManageContent())) router.replace("/painel");
  }, [canManageContent, isLoading, isRoleLoading, router, user]);

  useEffect(() => {
    if (isLoading || isRoleLoading || !user || !canManageContent()) return;

    async function loadAuthors() {
      try {
        const response = await fetch("/api/admin/authors", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || "Não foi possível carregar os autores.");
        setAuthors(Array.isArray(payload) ? payload : payload.data ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar os autores.");
      } finally {
        setLoading(false);
      }
    }

    void loadAuthors();
  }, [canManageContent, getToken, isLoading, isRoleLoading, user]);

  function openCreate() {
    setEditingAuthor(null);
    setName("");
    setEmail("");
    setProfession("");
    setPublishedDate("");
    setSummary("");
    setAvatar(null);
    setFormOpen(true);
  }

  function openEdit(author: Author) {
    const data = author.attributes ?? {};
    setEditingAuthor(author);
    setName(data.name ?? "");
    setEmail(data.email ?? "");
    setProfession(data.profession ?? "");
    setPublishedDate(data.publishedDate?.slice(0, 10) ?? "");
    setSummary(data.summary ?? "");
    setAvatar(null);
    setFormOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      let avatarId: number | undefined;
      if (avatar) {
        const formData = new FormData();
        formData.append("files", avatar);
        const uploaded = await strapiAuthenticatedFetch<Array<{ id: number }>>("/api/upload", {
          method: "POST",
          body: formData,
        });
        avatarId = uploaded[0]?.id;
      }

      const body = {
        name,
        email: email || undefined,
        profession: profession || undefined,
        publishedDate: publishedDate || undefined,
        summary: summary || undefined,
        ...(avatarId ? { avatar: avatarId } : {}),
      };
      const path = editingAuthor ? `/api/admin/authors/${editingAuthor.id}` : "/api/admin/authors";
      const response = await fetch(path, {
        method: editingAuthor ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Não foi possível salvar o autor.");

      const saved = payload.data ?? payload;
      setAuthors((current) => editingAuthor ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
      setFormOpen(false);
      setEditingAuthor(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível salvar o autor.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAuthor(author: Author) {
    if (!window.confirm(`Excluir o autor ${author.attributes?.name || "selecionado"}?`)) return;
    setDeletingId(author.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/authors/${author.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Não foi possível excluir o autor.");
      setAuthors((current) => current.filter((item) => item.id !== author.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Não foi possível excluir o autor.");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading || isRoleLoading || !user) return <div className="flex min-h-[calc(100vh-13rem)] items-center justify-center text-gray-500">Validando acesso...</div>;
  if (!canManageContent()) return null;

  const inputClass = "mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <section className="min-h-[calc(100vh-13rem)] bg-[#f5f7f9] px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/painel" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary"><ArrowLeft className="h-4 w-4" /> Voltar ao painel</Link>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Administração</p><h1 className="mt-2 text-3xl font-bold">Autores</h1><p className="mt-2 text-gray-500">Cadastre, edite e remova autores do sistema.</p></div><button type="button" onClick={openCreate} className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:brightness-90"><Plus className="h-4 w-4" /> Novo autor</button></div>
        {error && <p role="alert" className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {formOpen && <form onSubmit={submit} className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold">{editingAuthor ? "Editar autor" : "Novo autor"}</h2><button type="button" onClick={() => setFormOpen(false)} aria-label="Fechar" className="text-gray-500 hover:text-primary"><X className="h-5 w-5" /></button></div><div className="grid gap-5 md:grid-cols-2"><label className="block text-sm font-semibold">Nome *<input required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} /></label><label className="block text-sm font-semibold">E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} /></label><label className="block text-sm font-semibold">Profissão<input value={profession} onChange={(event) => setProfession(event.target.value)} className={inputClass} /></label><label className="block text-sm font-semibold">Data de publicação<input type="date" value={publishedDate} onChange={(event) => setPublishedDate(event.target.value)} className={inputClass} /></label><label className="block text-sm font-semibold md:col-span-2">Resumo<textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><label className="block text-sm font-semibold md:col-span-2">{editingAuthor ? "Novo avatar (opcional)" : "Avatar"}<input type="file" accept="image/*" onChange={(event) => setAvatar(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold">Cancelar</button><button disabled={saving} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}{saving ? "Salvando..." : editingAuthor ? "Salvar alterações" : "Criar autor"}</button></div></form>}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{loading ? <div className="rounded-xl bg-white p-8 text-gray-500">Carregando autores...</div> : authors.map((author) => { const data = author.attributes ?? {}; const image = imageUrl(data.avatar?.data?.attributes?.url); return <article key={author.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-white">{image ? <img src={image} alt={data.name || "Autor"} className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5" />}</span><div><h2 className="font-bold">{data.name || "Autor sem nome"}</h2><p className="text-sm text-gray-500">{data.profession || "Profissão não informada"}</p></div></div><p className="mt-4 text-sm text-gray-600">{data.email || "E-mail não informado"}</p><p className="mt-2 line-clamp-3 text-sm text-gray-500">{data.summary || "Sem resumo"}</p><div className="mt-5 flex gap-2 border-t border-gray-100 pt-4"><button type="button" onClick={() => openEdit(author)} className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary"><Edit3 className="h-4 w-4" /> Editar</button><button type="button" disabled={deletingId === author.id} onClick={() => void deleteAuthor(author)} className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-4 w-4" />{deletingId === author.id ? "Excluindo..." : "Excluir"}</button></div></article>; })}</div>
      </div>
    </section>
  );
}
