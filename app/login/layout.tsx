import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

/**
 * Tela de sessao: fora do indice. Alem de nao ter o que indexar, indexada ela
 * apareceria em toda busca pela marca disputando com a home.
 */
export const metadata: Metadata = pageMetadata({
  title: "Entrar",
  description: "Acesso à área restrita da Daddus.",
  path: "/login",
  index: false,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
