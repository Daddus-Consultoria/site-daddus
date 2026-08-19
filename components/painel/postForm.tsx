"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, LoaderCircle, X } from "lucide-react";
import { strapiAuthenticatedFetch } from "@/lib/services/strapiAuthenticatedFetch";

interface Author {
  id: number;
  attributes?: { name?: string };
  name?: string;
}

interface AuthorsResponse {
  data?: Author[];
}

interface PostFormProps {
  onCreated: () => void;
  onClose: () => void;
}

const categories = [
  ["financas", "Economia"],
  ["politicasPublicas", "Políticas Públicas"],
  ["governanca", "Governança"],
  ["logistica", "Mobilidade"],
  ["inovacao", "Inovação"],
  ["sustentabilidade", "Sustentabilidade"],
  ["oportunidades", "Oportunidades"],
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function PostForm({ onCreated, onClose }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(categories[0][0]);
  const [publishDate, setPublishDate] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState("");
  const [firstContent, setFirstContent] = useState("");
  const [lastContent, setLastContent] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorsError, setAuthorsError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadAuthors() {
      try {
        const response = await strapiAuthenticatedFetch<AuthorsResponse>(
          "/api/authors?pagination[limit]=100&sort=name:asc"
        );
        setAuthors(response.data ?? []);
      } catch {
        setAuthorsError("Não foi possível carregar os autores.");
      }
    }

    loadAuthors();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      let coverImageId: number | undefined;

      if (coverImage) {
        const uploadData = new FormData();
        uploadData.append("files", coverImage);
        const uploadResponse = await strapiAuthenticatedFetch<Array<{ id: number }>>(
          "/api/upload",
          { method: "POST", body: uploadData }
        );
        coverImageId = uploadResponse[0]?.id;
      }

      await strapiAuthenticatedFetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          data: {
            title,
            slug: slugify(slug || title),
            category,
            publishDate: publishDate || null,
            ...(coverImageId ? { coverImage: coverImageId } : {}),
            comment: comment || null,
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            firstContent,
            lastContent: lastContent || null,
            ...(authorId ? { autor: Number(authorId) } : {}),
            publishedAt: status === "published" ? new Date().toISOString() : null,
          },
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        onCreated();
        onClose();
      }, 700);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível criar a publicação."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const inputClassName =
    "mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
  const labelClassName = "block text-sm font-semibold text-gray-700";

  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Novo conteúdo</p>
          <h2 className="mt-1 text-2xl font-bold text-[#0d0d0d]">Criar publicação</h2>
          <p className="mt-2 text-sm text-gray-500">Preencha os campos para cadastrar um novo post.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar formulário" className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-primary">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClassName}>
            Título *
            <input required value={title} onChange={(event) => { setTitle(event.target.value); if (!slug) setSlug(slugify(event.target.value)); }} className={inputClassName} />
          </label>
          <label className={labelClassName}>
            Slug *
            <input required value={slug} onChange={(event) => setSlug(slugify(event.target.value))} className={inputClassName} />
          </label>
          <label className={labelClassName}>
            Categoria *
            <select required value={category} onChange={(event) => setCategory(event.target.value)} className={inputClassName}>
              {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className={labelClassName}>
            Data de publicação
            <input type="date" value={publishDate} onChange={(event) => setPublishDate(event.target.value)} className={inputClassName} />
          </label>
          <label className={labelClassName}>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value as "draft" | "published")} className={inputClassName}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </label>
          <label className={labelClassName}>
            Autor
            <select value={authorId} onChange={(event) => setAuthorId(event.target.value)} className={inputClassName}>
              <option value="">Selecionar autor</option>
              {authors.map((author) => <option key={author.id} value={author.id}>{author.attributes?.name || author.name || `Autor ${author.id}`}</option>)}
            </select>
            {authorsError && <span className="mt-1 block text-xs font-normal text-red-600">{authorsError}</span>}
          </label>
          <label className={labelClassName}>
            Etiquetas
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="gestão, políticas públicas" className={inputClassName} />
          </label>
          <label className={labelClassName}>
            Imagem de capa
            <input type="file" accept="image/*" onChange={(event) => setCoverImage(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white" />
          </label>
        </div>

        <label className={labelClassName}>
          Comentário do autor
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
        <label className={labelClassName}>
          Conteúdo principal *
          <textarea required value={firstContent} onChange={(event) => setFirstContent(event.target.value)} rows={8} className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
        <label className={labelClassName}>
          Continuação do conteúdo
          <textarea value={lastContent} onChange={(event) => setLastContent(event.target.value)} rows={6} className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>

        {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {success && <p className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"><Check className="h-4 w-4" /> Publicação criada com sucesso.</p>}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">Cancelar</button>
          <button type="submit" disabled={isLoading} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60">
            {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isLoading ? "Salvando..." : "Criar publicação"}
          </button>
        </div>
      </form>
    </div>
  );
}