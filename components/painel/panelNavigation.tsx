"use client";

import { ChevronDown, FileText, Settings2, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PanelNavigationProps {
  contentType: "posts" | "publicacoes";
  onContentTypeChange: (contentType: "posts" | "publicacoes") => void;
  isPrivileged: boolean;
}

export function PanelNavigation({ contentType, onContentTypeChange, isPrivileged }: PanelNavigationProps) {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  return (
    <nav aria-label="Navegação do painel" className="mb-8 flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
      <button
        type="button"
        onClick={() => onContentTypeChange("posts")}
        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${contentType === "posts" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}
      >
        <FileText className="h-4 w-4" />
        Posts
      </button>
      <button
        type="button"
        onClick={() => onContentTypeChange("publicacoes")}
        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${contentType === "publicacoes" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}
      >
        <FileText className="h-4 w-4" />
        Publicações
      </button>

      {isPrivileged && (
        <div className="relative ml-auto">
          <button
            type="button"
            aria-expanded={adminMenuOpen}
            onClick={() => setAdminMenuOpen((open) => !open)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${adminMenuOpen ? "bg-[#0d0d0d] text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Settings2 className="h-4 w-4" />
            Administração
            <ChevronDown className={`h-4 w-4 transition ${adminMenuOpen ? "rotate-180" : ""}`} />
          </button>
          {adminMenuOpen && (
            <div className="absolute right-0 z-30 mt-2 w-60 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              <div className="border-b border-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Acessos e usuários
              </div>
              <Link href="/painel/usuarios/novo" onClick={() => setAdminMenuOpen(false)} className="mt-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-primary/10 hover:text-primary">
                <Users className="h-4 w-4" />
                Gerenciar usuários
              </Link>
              <div className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-400" title="O perfil será disponibilizado em uma próxima etapa">
                <UserRound className="h-4 w-4" />
                Meu perfil
                <span className="ml-auto text-[10px] font-normal uppercase">Em breve</span>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}