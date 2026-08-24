import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Publicações",
  description:
    "Estudos, guias e perfis municipais produzidos pela Daddus, cada um com fonte, período de referência e metodologia descritos.",
  path: "/conteudos/publicacoes",
});

export default function PublicationsLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div>
          {children}
      </div>
    );
  }
  