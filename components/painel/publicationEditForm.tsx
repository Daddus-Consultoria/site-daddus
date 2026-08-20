"use client";

import { FormEvent, useState } from "react";
import { Check, LoaderCircle, X } from "lucide-react";
import { strapiAuthenticatedFetch } from "@/lib/services/strapiAuthenticatedFetch";

interface PublicationEditFormProps {
  publication: {
    id: number;
    attributes?: {
      title?: string;
      shortDescription?: string;
      longDescription?: string;
      slug?: string;
      category?: string;
      subCategory?: string;
      publishDate?: string;
      tags?: string[];
      documentLink?: string;
    };
  };
  onClose: () => void;
  onSaved: () => void;
}

export function PublicationEditForm({ publication, onClose, onSaved }: PublicationEditFormProps) {
  const attributes = publication.attributes ?? {};
  const [title, setTitle] = useState(attributes.title ?? "");
  const [shortDescription, setShortDescription] = useState(attributes.shortDescription ?? "");
  const [longDescription, setLongDescription] = useState(attributes.longDescription ?? "");
  const [slug, setSlug] = useState(attributes.slug ?? "");
  const [category, setCategory] = useState(attributes.category ?? "");
  const [subCategory, setSubCategory] = useState(attributes.subCategory ?? "");
  const [publishDate, setPublishDate] = useState(attributes.publishDate?.slice(0, 10) ?? "");
  const [tags, setTags] = useState(attributes.tags?.join(", ") ?? "");
  const [documentLink, setDocumentLink] = useState(attributes.documentLink ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await strapiAuthenticatedFetch(`/api/publicacoes/${publication.id}`, {
        method: "PUT",
        body: JSON.stringify({
          data: {
            title,
            shortDescription,
            longDescription,
            slug,
            category,
            subCategory,
            publishDate: publishDate || null,
            tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
            documentLink: documentLink || null,
          },
        }),
      });
      onSaved();
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível editar a publicação.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-2 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
  const labelClass = "block text-sm font-semibold text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-start justify-between"><div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Publicação</p><h2 className="mt-1 text-2xl font-bold">Editar publicação</h2></div><button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5" /></button></div>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className={labelClass}>Título *<input required value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} /></label>
            <label className={labelClass}>URL<input value={slug} onChange={(event) => setSlug(event.target.value)} className={inputClass} /></label>
            <label className={labelClass}>Categoria<input value={category} onChange={(event) => setCategory(event.target.value)} className={inputClass} /></label>
            <label className={labelClass}>Subcategoria<input value={subCategory} onChange={(event) => setSubCategory(event.target.value)} className={inputClass} /></label>
            <label className={labelClass}>Data de publicação<input type="date" value={publishDate} onChange={(event) => setPublishDate(event.target.value)} className={inputClass} /></label>
            <label className={labelClass}>Link do documento<input type="url" value={documentLink} onChange={(event) => setDocumentLink(event.target.value)} className={inputClass} /></label>
          </div>
          <label className={labelClass}>Descrição curta<textarea required value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
          <label className={labelClass}>Descrição completa<textarea required value={longDescription} onChange={(event) => setLongDescription(event.target.value)} rows={7} className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
          <label className={labelClass}>Etiquetas<input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="gestão, políticas públicas" className={inputClass} /></label>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5"><button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold">Cancelar</button><button disabled={saving} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}{saving ? "Salvando..." : "Salvar alterações"}</button></div>
        </form>
      </div>
    </div>
  );
}
