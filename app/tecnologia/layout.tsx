import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ecossistema Daddus | Sistemas para a gestão pública",
  description:
    "Compasso, Opus, Prisma e Atlas: os sistemas desenvolvidos pela Daddus para demandas, projetos de PPP, compras públicas e informações de gestão municipal.",
};

export default function TecnologiaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
