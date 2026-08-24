import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Estudo de viabilidade",
  description:
    "Avaliação da sustentação financeira do projeto: análise de mercado, projeção de fluxo de caixa e indicadores como TIR, VPL e payback.",
  path: "/servicos/consultoria/estudo-de-viabilidade",
});

export default function StudyLayout({
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
  