"use client";

import { useState } from "react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { AuthUser } from "@/lib/auth/auth-context";

interface UserMenuProps {
  user: AuthUser;
  onLogout: () => void;
}

function avatarUrl(user: AuthUser) {
  const url = user.avatar?.url || user.avatar?.data?.attributes?.url;
  if (!url) return "";
  return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const name = user.firstname || user.username || user.email;
  const initials = name.slice(0, 2).toUpperCase();
  const image = avatarUrl(user);

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((visible) => !visible)} aria-expanded={open} aria-label="Abrir menu do usuário" className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-2 shadow-sm transition hover:border-primary">
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-white">
          {image ? <img src={image} alt={`Avatar de ${name}`} className="h-full w-full object-cover" /> : initials || <UserRound className="h-4 w-4" />}
        </span>
        <ChevronDown className={`hidden h-4 w-4 text-gray-500 transition sm:block ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <div className="border-b border-gray-100 px-3 py-2">
            <p className="truncate text-sm font-semibold text-[#0d0d0d]">{name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
            {user.role && <p className="mt-1 text-xs font-semibold text-primary">{"data" in user.role ? user.role.data?.attributes?.name : (user.role as { name?: string }).name}</p>}
          </div>
          <Link href="https://www.daddusconsultoria.com/painel" className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-primary/10 hover:text-primary">
            <UserRound className="h-4 w-4" /> Meu painel
          </Link>
          <button type="button" onClick={onLogout} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      )}
    </div>
  );
}
