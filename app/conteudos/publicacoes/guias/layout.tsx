import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Guias",
  description:
    "Materiais de orientação prática para equipes municipais aplicarem na rotina da gestão.",
  path: "/conteudos/publicacoes/guias",
});

export default function GuidesPublicationsLayout({
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
  