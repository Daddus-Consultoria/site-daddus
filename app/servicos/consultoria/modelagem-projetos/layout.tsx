import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Modelagem de projetos",
  description:
    "Estruturação técnica, jurídica e econômica do projeto, do desenho da solução ao formato de contratação.",
  path: "/servicos/consultoria/modelagem-projetos",
});

export default function ModelingLayout({
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
  