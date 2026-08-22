import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quem somos | Daddus",
  description:
    "A Daddus produz estudos e indicadores sobre municípios, presta consultoria em políticas públicas e estruturação de projetos e desenvolve sistemas para a gestão pública.",
  keywords: ["daddus", "consultoria pública", "estudos econômicos", "gestão municipal"],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
