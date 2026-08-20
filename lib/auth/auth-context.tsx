"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { strapiAuthenticatedFetch } from "@/lib/services/strapiAuthenticatedFetch";

const TOKEN_KEY = "daddus_auth_token";
const USER_KEY = "daddus_auth_user";

export interface AuthUser {
  id: number;
  username?: string;
  email: string;
  firstname?: string;
  lastname?: string;
  avatar?: {
    url?: string;
    data?: { attributes?: { url?: string } };
  };
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  getToken: () => string | null;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isTokenValid(token: string | null) {
  if (!token) return false;

  try {
    const encodedPayload = token.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const payload = JSON.parse(atob(encodedPayload));
    return typeof payload.exp !== "number" || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    try {
      if (isTokenValid(token) && storedUser) {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        setUser(parsedUser);
        setIsLoading(false);
        void refreshUser(parsedUser);
        return;
      }
    } catch {
      // Remove dados inválidos e força um novo login.
    }

    {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    setIsLoading(false);
  }, []);

  async function refreshUser(currentUser: AuthUser) {
    try {
      const profile = await strapiAuthenticatedFetch<AuthUser>("/api/users/me?populate=avatar");
      const mergedUser = { ...currentUser, ...profile };
      localStorage.setItem(USER_KEY, JSON.stringify(mergedUser));
      setUser(mergedUser);
    } catch {
      // O avatar é opcional; a sessão continua válida se o perfil expandido não estiver disponível.
    }
  }

  async function login(identifier: string, password: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      }
    );

    const data = await response.json();
    if (!response.ok || !data.jwt || !data.user) {
      throw new Error(data?.error?.message || "Usuário ou senha inválidos.");
    }

    localStorage.setItem(TOKEN_KEY, data.jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    void refreshUser(data.user);
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    router.replace("/login");
  }

  function isAuthenticated() {
    return isTokenValid(getToken());
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, getToken, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}