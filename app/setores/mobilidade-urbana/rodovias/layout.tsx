import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

/** A pagina e client component; os metadados vivem aqui. */
export const metadata: Metadata = pageMetadata({
  title: "Rodovias",
  description:
    "Índices e parâmetros do setor rodoviário para reajuste de contratos e planejamento orçamentário.",
  path: "/setores/mobilidade-urbana/rodovias",
});

export default function HighwaysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
