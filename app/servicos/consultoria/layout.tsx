import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

/**
 * A pagina de consultoria e client component e nao pode declarar metadados.
 * Este layout existe para isso; as tres subrotas trazem os proprios.
 */
export const metadata: Metadata = pageMetadata({
  title: "Consultoria",
  description:
    "Elaboração de políticas públicas, estudos de viabilidade econômico-financeira e modelagem de projetos para o setor público e o privado.",
  path: "/servicos/consultoria",
});

export default function ConsultancyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
