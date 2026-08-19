"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CalendarDays, LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { strapiAuthenticatedFetch } from "@/lib/services/strapiAuthenticatedFetch";
import { PostForm } from "@/components/painel/postForm";

interface StrapiPost {
  id: number;
  attributes?: {
    title?: string;
    category?: string;
    publishDate?: string;
    publishedAt?: string;
    autor?: {
      data?: {
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
}

interface StrapiPostsResponse {
  data?: StrapiPost[];
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
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [posts, setPosts] = useState<StrapiPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated()) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isLoading || !user || !isAuthenticated()) return;

    async function loadPosts() {
      setPostsLoading(true);
      setPostsError("");

      try {
        const response = await strapiAuthenticatedFetch<StrapiPostsResponse>(
          "/api/posts?sort=publishDate:desc&pagination[limit]=20&populate[0]=autor"
        );
        setPosts(response.data ?? []);
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

    loadPosts();
  }, [isAuthenticated, isLoading, refreshKey, user]);

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
          <button onClick={logout} className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0d0d0d]">Seus conteúdos</h2>
              <p className="mt-1 text-sm text-gray-500">Conteúdos disponíveis na sua área.</p>
            </div>
            <div className="flex items-center gap-4">
              {!postsLoading && !postsError && (
                <span className="hidden text-sm text-gray-500 sm:inline">
                  {posts.length} {posts.length === 1 ? "item" : "itens"}
                </span>
              )}
              <button type="button" onClick={() => setIsCreateFormOpen((open) => !open)} className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-90">
                <Plus className="h-4 w-4" />
                Nova publicação
              </button>
            </div>
          </div>

          {isCreateFormOpen && (
            <PostForm
              onClose={() => setIsCreateFormOpen(false)}
              onCreated={() => setRefreshKey((key) => key + 1)}
            />
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

          {!postsLoading && !postsError && posts.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h3 className="font-semibold text-[#0d0d0d]">Nenhum conteúdo encontrado</h3>
              <p className="mt-2 text-sm text-gray-500">Novos conteúdos aparecerão aqui quando forem cadastrados.</p>
            </div>
          )}

          {!postsLoading && !postsError && posts.length > 0 && (
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