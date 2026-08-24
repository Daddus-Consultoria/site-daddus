import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

/** A pagina e client component; os metadados vivem aqui. */
export const metadata: Metadata = pageMetadata({
  title: "Transportes",
  description:
    "Índices e parâmetros do transporte urbano para reajuste de tarifas e planejamento orçamentário.",
  path: "/setores/mobilidade-urbana/transportes",
});

export default function TransportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
