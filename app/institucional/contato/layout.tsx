import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contato",
  description:
    "Canais para falar com a Daddus sobre um projeto de consultoria ou a apresentação de um dos sistemas.",
  path: "/institucional/contato",
});

export default function ContactLayout({
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
  