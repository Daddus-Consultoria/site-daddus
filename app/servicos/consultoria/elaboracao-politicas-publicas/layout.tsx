import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Elaboração de políticas públicas",
  description:
    "Definição de objetivos, programas e metas da política, com escuta dos atores interessados e avaliação de alternativas até a formulação final.",
  path: "/servicos/consultoria/elaboracao-politicas-publicas",
});

export default function ElaborationLayout({
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
