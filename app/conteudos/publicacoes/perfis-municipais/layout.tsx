import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Perfis municipais",
  description:
    "Retratos social, econômico e eleitoral de municípios, organizados a partir de bases públicas.",
  path: "/conteudos/publicacoes/perfis-municipais",
});

export default function MunicipalProfileLayout({
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
  