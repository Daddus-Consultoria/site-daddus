import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Ecossistema Daddus — sistemas para a gestão pública",
  description:
    "Compasso, Opus, Prisma e Atlas: os sistemas desenvolvidos pela Daddus para demandas, projetos de PPP, compras públicas e informações de gestão municipal.",
  path: "/tecnologia",
  fullTitle: true,
});

export default function TecnologiaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
