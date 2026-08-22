import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soluções para municípios | Daddus",
  description:
    "Demandas, projetos de PPP, compras públicas, informações de gestão, viabilidade econômica e dados municipais: por onde a prefeitura começa, conforme a necessidade.",
};

export default function SolucoesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
