import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Estudos",
  description:
    "Análises técnicas sobre políticas públicas, economia e gestão, com metodologia e fontes descritas.",
  path: "/conteudos/publicacoes/estudos",
});

export default function StudyPublicationsLayout({
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
  