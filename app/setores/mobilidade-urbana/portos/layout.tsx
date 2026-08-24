import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

/** A pagina e client component; os metadados vivem aqui. */
export const metadata: Metadata = pageMetadata({
  title: "Portos",
  description:
    "Índices e parâmetros do setor portuário para reajuste de contratos e planejamento orçamentário.",
  path: "/setores/mobilidade-urbana/portos",
});

export default function PortsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
