"use client";

import { useEffect } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

export default function PanelPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated()) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

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

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-xl font-bold text-[#0d0d0d]">Acesso autorizado</h2>
          <p className="mt-2 text-gray-600">Sua sessão está ativa e pronta para consumir os dados privados do Strapi.</p>
        </div>
      </div>
    </section>
  );
}