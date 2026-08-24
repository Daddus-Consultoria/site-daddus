import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Soluções para municípios",
  description:
    "Demandas, projetos de PPP, compras públicas, informações de gestão, viabilidade econômica e dados municipais: por onde a prefeitura começa, conforme a necessidade.",
  path: "/solucoes",
});

export default function SolucoesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
