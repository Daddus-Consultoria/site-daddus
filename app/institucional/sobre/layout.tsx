import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Quem somos",
  description:
    "A Daddus produz estudos e indicadores sobre municípios, presta consultoria em políticas públicas e estruturação de projetos e desenvolve sistemas para a gestão pública.",
  path: "/institucional/sobre",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
