"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, LoaderCircle, X } from "lucide-react";
import { strapiAuthenticatedFetch } from "@/lib/services/strapiAuthenticatedFetch";
import { RichTextEditor } from "@/components/painel/richTextEditor";

interface Author {
  id: number;
  attributes?: { name?: string };
  name?: string;
}

interface AuthorsResponse {
  data?: Author[];
}

interface MediaFile {
  id: number;
  name: string;
  url: string;
  alternativeText?: string;
  caption?: string;
  attributes?: {
    url?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
  };
}

interface MediaResponse {
  data?: MediaFile[];
}

export interface EditablePost {
  id: number;
  attributes?: {
    title?: string;
    slug?: string;
    category?: string;
    publishDate?: string;
    publishedAt?: string;
    comment?: string;
    tags?: string[];
    firstContent?: string;
    lastContent?: string;
    coverImage?: { data?: { id: number; url?: string; attributes?: MediaFile["attributes"] } };
    autor?: { data?: { id: number } };
  };
}

interface PostFormProps {
  onCreated: () => void;
  onClose: () => void;
  post?: EditablePost;
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

export function PostForm({ onCreated, onClose, post }: PostFormProps) {
  const attributes = post?.attributes;
  const [title, setTitle] = useState(attributes?.title ?? "");
  const [slug, setSlug] = useState(attributes?.slug ?? "");
  const [category, setCategory] = useState(attributes?.category ?? categories[0][0]);
  const [publishDate, setPublishDate] = useState(attributes?.publishDate?.slice(0, 10) ?? "");
  const [status, setStatus] = useState<"draft" | "published">(attributes?.publishedAt ? "published" : "draft");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageId, setCoverImageId] = useState<number | null>(attributes?.coverImage?.data?.id ?? null);
  const existingCoverUrl = attributes?.coverImage?.data?.url || attributes?.coverImage?.data?.attributes?.url || "";
  const [coverPreview, setCoverPreview] = useState(existingCoverUrl ? mediaUrl(existingCoverUrl) : "");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [mediaError, setMediaError] = useState("");
  const [comment, setComment] = useState(attributes?.comment ?? "");
  const [tags, setTags] = useState(attributes?.tags?.join(", ") ?? "");
  const [firstContent, setFirstContent] = useState(attributes?.firstContent ?? "");
  const [lastContent, setLastContent] = useState(attributes?.lastContent ?? "");
  const [authorId, setAuthorId] = useState(attributes?.autor?.data?.id?.toString() ?? "");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorsError, setAuthorsError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadAuthors() {
      try {
        const response = await strapiAuthenticatedFetch<AuthorsResponse>(
          "/api/autors?pagination[limit]=100&sort=name:asc"
        );
        setAuthors(response.data ?? []);
      } catch {
        setAuthorsError("Não foi possível carregar os autores.");
      }
    }

    loadAuthors();

    async function loadMedia() {
      try {
        const response = await strapiAuthenticatedFetch<MediaResponse | MediaFile[]>(
          "/api/upload/files?sort=createdAt:desc&pagination[limit]=100"
        );
        setMediaFiles(Array.isArray(response) ? response : response.data ?? []);
      } catch {
        setMediaError("Não foi possível carregar a biblioteca de imagens.");
      }
    }

    loadMedia();
  }, []);

  function mediaUrl(url: string) {
    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
  }

  function selectCover(media: MediaFile) {
    setCoverImage(null);
    setCoverImageId(media.id);
    setCoverPreview(mediaUrl(media.url));
  }

  function removeCover() {
    setCoverImage(null);
    setCoverImageId(null);
    setCoverPreview("");
  }

  function selectNewCover(file: File | undefined) {
    if (!file) return;
    setCoverImage(file);
    setCoverImageId(null);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    if (!firstContent.replace(/<[^>]*>/g, "").trim()) {
      setError("O conteúdo principal é obrigatório.");
      return;
    }
    setIsLoading(true);

    try {
      let uploadedCoverImageId: number | undefined;

      if (coverImage) {
        const uploadData = new FormData();
        uploadData.append("files", coverImage);
        const uploadResponse = await strapiAuthenticatedFetch<Array<{ id: number }>>(
          "/api/upload",
          { method: "POST", body: uploadData }
        );
        uploadedCoverImageId = uploadResponse[0]?.id;
      }

      await strapiAuthenticatedFetch(post ? `/api/posts/${post.id}` : "/api/posts", {
        method: post ? "PUT" : "POST",
        body: JSON.stringify({
          data: {
            title,
            slug: slugify(slug || title),
            category,
            publishDate: publishDate || null,
            coverImage: uploadedCoverImageId ?? coverImageId,
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
          ? submitError.message.includes("403")
            ? "O Strapi não autorizou a edição. Libere a permissão Post > update para a role Supervisor."
            : submitError.message
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
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{post ? "Editar post" : "Novo post"}</p>
          <h2 className="mt-1 text-2xl font-bold text-[#0d0d0d]">{post ? "Editar post" : "Criar post"}</h2>
          <p className="mt-2 text-sm text-gray-500">Preencha os campos para {post ? "atualizar" : "cadastrar"} este post.</p>
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
            URL *
            <input required value={slug} onChange={(event) => setSlug(slugify(event.target.value))} className={inputClassName} placeholder="nome-do-conteudo" />
            <span className="mt-1 block text-xs font-normal text-gray-500">/{slug || "nome-do-conteudo"}</span>
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
        </div>

        <div>
          <label className={labelClassName}>Imagem de capa</label>
          <div className="mt-2 grid gap-4 lg:grid-cols-[1fr_16rem]">
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-90">
                  Enviar nova imagem
                  <input type="file" accept="image/*" onChange={(event) => selectNewCover(event.target.files?.[0])} className="hidden" />
                </label>
                {coverPreview && <button type="button" onClick={removeCover} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Remover seleção</button>}
              </div>
              <p className="mt-3 text-xs text-gray-500">Selecione uma imagem existente ou envie uma nova.</p>
              {mediaError && <p className="mt-2 text-xs text-red-600">{mediaError}</p>}
              <select value={coverImageId ?? ""} onChange={(event) => { const media = mediaFiles.find((item) => item.id === Number(event.target.value)); if (media) selectCover(media); }} className={inputClassName}>
                <option value="">Selecionar imagem já cadastrada</option>
                {mediaFiles.map((media) => <option key={media.id} value={media.id}>{media.name}</option>)}
              </select>
            </div>
            <div className="flex min-h-32 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {coverPreview ? <img src={coverPreview} alt="Pré-visualização da capa" className="max-h-40 w-full object-contain" /> : <span className="px-4 text-center text-xs text-gray-400">Nenhuma imagem selecionada</span>}
            </div>
          </div>
        </div>

        <label className={labelClassName}>
          Comentário do autor
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
        <RichTextEditor label="Conteúdo principal" required value={firstContent} onChange={setFirstContent} rows={8} />
        <RichTextEditor label="Continuação do conteúdo" value={lastContent} onChange={setLastContent} rows={6} />

        {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {success && <p className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"><Check className="h-4 w-4" /> Publicação criada com sucesso.</p>}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">Cancelar</button>
          <button type="submit" disabled={isLoading} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60">
            {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isLoading ? "Salvando..." : post ? "Salvar alterações" : "Criar publicação"}
          </button>
        </div>
      </form>
    </div>
  );
}