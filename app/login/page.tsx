"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated()) router.replace("/painel");
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(identifier, password);
      router.replace("/painel");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível entrar. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-13rem)] items-center justify-center bg-[#f5f7f9] px-5 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-[#0d0d0d] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#e2a6ae]">
              Daddus Consultoria
            </p>
            <h1 className="text-4xl font-bold leading-tight">
              Conhecimento para decisões melhores.
            </h1>
          </div>
          <p className="max-w-xs text-sm leading-6 text-white/70">
            Acesse seus conteúdos e ferramentas em um ambiente exclusivo.
          </p>
        </div>

        <div className="p-8 sm:p-12">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Área restrita
            </p>
            <h2 className="text-3xl font-bold text-[#0d0d0d]">Entrar</h2>
            <p className="mt-2 text-sm text-gray-500">
              Use suas credenciais para acessar o painel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-semibold text-gray-700">
              Usuário ou e-mail
              <span className="relative mt-2 block">
                <UserRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-200 pl-11 pr-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="seu@email.com"
                  autoComplete="username"
                />
              </span>
            </label>

            <label className="block text-sm font-semibold text-gray-700">
              Senha
              <span className="relative mt-2 block">
                <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-200 pl-11 pr-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Entrando..." : "Acessar painel"}
              {!isSubmitting && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}