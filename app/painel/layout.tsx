import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

/**
 * Painel administrativo: fora do indice, em todas as subrotas. O robots.txt ja
 * pede para nao rastrear, mas uma URL descoberta por link ainda poderia ser
 * indexada sem ser lida — a diretiva `noindex` e o que fecha esse caminho.
 */
export const metadata: Metadata = pageMetadata({
  title: "Painel",
  description: "Área administrativa da Daddus.",
  path: "/painel",
  index: false,
});

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
