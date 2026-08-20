"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CalendarDays, Edit3, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { strapiAuthenticatedFetch } from "@/lib/services/strapiAuthenticatedFetch";
import { EditablePost, PostForm } from "@/components/painel/postForm";
import { PanelNavigation } from "@/components/painel/panelNavigation";
import { PublicationEditForm } from "@/components/painel/publicationEditForm";

interface StrapiPost {
  id: number;
  attributes?: {
    title?: string;
    category?: string;
    publishDate?: string;
    publishedAt?: string;
    slug?: string;
    comment?: string;
    tags?: string[];
    firstContent?: string;
    lastContent?: string;
    coverImage?: { data?: { id: number; url?: string; name?: string; attributes?: { url?: string; name?: string } } };
    autor?: {
      data?: {
        id?: number;
        attributes?: {
          name?: string;
          username?: string;
        };
      };
    };
  };
  title?: string;
  category?: string;
  publishDate?: string;
  publishedAt?: string;
  slug?: string;
  comment?: string;
  tags?: string[];
  firstContent?: string;
  lastContent?: string;
}

interface StrapiPostsResponse {
  data?: StrapiPost[];
}

interface StrapiPublication {
  id: number;
  attributes?: {
    title?: string;
    shortDescription?: string;
    category?: string;
    subCategory?: string;
    publishDate?: string;
    publishedAt?: string;
    slug?: string;
    tags?: string[];
    documentLink?: string;
    authors?: {
      data?: Array<{ id: number; attributes?: { name?: string } }>;
    };
  };
}

interface StrapiPublicationsResponse {
  data?: StrapiPublication[];
}

function formatDate(date?: string) {
  if (!date) return "Data não informada";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Data não informada";

  return parsedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getPostAuthor(post: StrapiPost) {
  return (
    post.attributes?.autor?.data?.attributes?.name ||
    post.attributes?.autor?.data?.attributes?.username ||
    "Autor não informado"
  );
}

export default function PanelPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isPrivileged, canEditContent, canManageContent } = useAuth();
  const [posts, setPosts] = useState<StrapiPost[]>([]);
  const [publications, setPublications] = useState<StrapiPublication[]>([]);
  const [contentType, setContentType] = useState<"posts" | "publicacoes">("posts");
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<StrapiPost | null>(null);
  const [editingPublication, setEditingPublication] = useState<StrapiPublication | null>(null);
  const [actionError, setActionError] = useState("");
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [deletingPublicationId, setDeletingPublicationId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated()) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isLoading || !user || !isAuthenticated()) return;

    async function loadContents() {
      setPostsLoading(true);
      setPostsError("");

      try {
        const [postsResponse, publicationsResponse] = await Promise.allSettled([
          strapiAuthenticatedFetch<StrapiPostsResponse>(
            "/api/posts?sort=publishDate:desc&pagination[limit]=20&populate[0]=coverImage"
          ),
          strapiAuthenticatedFetch<StrapiPublicationsResponse>(
            "/api/publicacoes?sort=publishDate:desc&pagination[limit]=20"
          ),
        ]);

        if (postsResponse.status === "fulfilled") setPosts(postsResponse.value.data ?? []);
        if (publicationsResponse.status === "fulfilled") setPublications(publicationsResponse.value.data ?? []);

        const failedResponse = contentType === "posts" ? postsResponse : publicationsResponse;
        if (failedResponse.status === "rejected") throw failedResponse.reason;
      } catch (error) {
        setPostsError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os conteúdos."
        );
      } finally {
        setPostsLoading(false);
      }
    }

    loadContents();
  }, [contentType, isAuthenticated, isLoading, refreshKey, user]);

  async function deletePost(postId: number) {
    if (!window.confirm("Excluir esta publicação? Essa ação não pode ser desfeita.")) return;

    setDeletingPostId(postId);
    setActionError("");
    try {
      await strapiAuthenticatedFetch(`/api/posts/${postId}`, { method: "DELETE" });
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Não foi possível excluir a publicação.");
    } finally {
      setDeletingPostId(null);
    }
  }

  async function deletePublication(publicationId: number) {
    if (!window.confirm("Excluir esta publicação? Essa ação não pode ser desfeita.")) return;
    setDeletingPublicationId(publicationId);
    setActionError("");
    try {
      await strapiAuthenticatedFetch(`/api/publicacoes/${publicationId}`, { method: "DELETE" });
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Não foi possível excluir a publicação.");
    } finally {
      setDeletingPublicationId(null);
    }
  }

  if (isLoading || !user) {
    return <div className="flex min-h-[calc(100vh-13rem)] items-center justify-center text-gray-500">Carregando painel...</div>;
  }

  const displayName = user.firstname || user.username || user.email;

  return (
    <section className="min-h-[calc(100vh-13rem)] bg-[#f5f7f9] px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Painel</p>
            <h1 className="mt-2 text-3xl font-bold text-[#0d0d0d]">Olá, {displayName}.</h1>
            <p className="mt-2 text-gray-500">Bem-vindo à sua área exclusiva.</p>
          </div>
        </div>

        <PanelNavigation
          contentType={contentType}
          onContentTypeChange={(nextContentType) => {
            setContentType(nextContentType);
            setPostsError("");
          }}
          isPrivileged={isPrivileged()}
        />

        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0d0d0d]">Seus conteúdos</h2>
              <p className="mt-1 text-sm text-gray-500">Gerencie posts e publicações do seu site.</p>
            </div>
            <div className="flex items-center gap-4">
              {!postsLoading && !postsError && (
                <span className="hidden text-sm text-gray-500 sm:inline">
                  {(contentType === "posts" ? posts.length : publications.length)} {((contentType === "posts" ? posts.length : publications.length) === 1) ? "item" : "itens"}
                </span>
              )}
              {canManageContent() && (
                <button type="button" onClick={() => setIsCreateFormOpen((open) => !open)} className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-90">
                  <Plus className="h-4 w-4" />
                  Nova publicação
                </button>
              )}
            </div>
          </div>

          {isCreateFormOpen && (
            <PostForm
              onClose={() => setIsCreateFormOpen(false)}
              onCreated={() => setRefreshKey((key) => key + 1)}
            />
          )}

          {editingPost && (
            <PostForm
              key={`edit-post-${editingPost.id}`}
              post={editingPost as EditablePost}
              onClose={() => setEditingPost(null)}
              onCreated={() => setRefreshKey((key) => key + 1)}
            />
          )}

          {editingPublication && (
            <PublicationEditForm
              publication={editingPublication}
              onClose={() => setEditingPublication(null)}
              onSaved={() => setRefreshKey((key) => key + 1)}
            />
          )}

          {actionError && (
            <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{actionError}</p>
            </div>
          )}

          {postsLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Carregando conteúdos">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-40 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="mt-5 h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                  <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          )}

          {!postsLoading && postsError && (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Não foi possível carregar os conteúdos.</p>
                <p className="mt-1 text-sm">{postsError}</p>
              </div>
            </div>
          )}

          {!postsLoading && !postsError && contentType === "posts" && posts.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h3 className="font-semibold text-[#0d0d0d]">Nenhum conteúdo encontrado</h3>
              <p className="mt-2 text-sm text-gray-500">Novos conteúdos aparecerão aqui quando forem cadastrados.</p>
            </div>
          )}

          {!postsLoading && !postsError && contentType === "posts" && posts.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const attributes = post.attributes ?? post;
                const date = attributes.publishDate || attributes.publishedAt;

                return (
                  <article key={post.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                    <h3 className="line-clamp-2 min-h-12 text-lg font-bold text-[#0d0d0d]">
                      {attributes.title || "Conteúdo sem título"}
                    </h3>
                    <div className="mt-5 space-y-2 text-sm text-gray-500">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        {formatDate(date)}
                      </p>
                      <p>{attributes.category || "Categoria não informada"}</p>
                      <p>{getPostAuthor(post)}</p>
                    </div>
                    <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                      {canEditContent() && (
                        <button type="button" onClick={() => { setEditingPost(post); setIsCreateFormOpen(false); }} className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">
                          <Edit3 className="h-4 w-4" /> Editar
                        </button>
                      )}
                      {canManageContent() && (
                        <button type="button" disabled={deletingPostId === post.id} onClick={() => deletePost(post.id)} className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50">
                          <Trash2 className="h-4 w-4" />
                          {deletingPostId === post.id ? "Excluindo..." : "Excluir"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!postsLoading && !postsError && contentType === "publicacoes" && publications.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h3 className="font-semibold text-[#0d0d0d]">Nenhuma publicação encontrada</h3>
              <p className="mt-2 text-sm text-gray-500">Novas publicações aparecerão aqui quando forem cadastradas.</p>
            </div>
          )}

          {!postsLoading && !postsError && contentType === "publicacoes" && publications.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {publications.map((publication) => {
                const attributes = publication.attributes ?? {};
                return (
                  <article key={publication.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="line-clamp-2 min-h-12 text-lg font-bold text-[#0d0d0d]">{attributes.title || "Publicação sem título"}</h3>
                    <p className="mt-3 line-clamp-3 text-sm text-gray-600">{attributes.shortDescription || "Sem descrição curta"}</p>
                    <div className="mt-5 space-y-2 text-sm text-gray-500">
                      <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{formatDate(attributes.publishDate || attributes.publishedAt)}</p>
                      <p>{attributes.category || "Categoria não informada"}</p>
                      <p>{attributes.subCategory || "Subcategoria não informada"}</p>
                    </div>
                    <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                      {canEditContent() && (
                        <button type="button" onClick={() => setEditingPublication(publication)} className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">
                          <Edit3 className="h-4 w-4" /> Editar
                        </button>
                      )}
                      {canManageContent() && (
                        <button type="button" disabled={deletingPublicationId === publication.id} onClick={() => void deletePublication(publication.id)} className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50">
                          <Trash2 className="h-4 w-4" /> {deletingPublicationId === publication.id ? "Excluindo..." : "Excluir"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}