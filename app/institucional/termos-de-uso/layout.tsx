import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Termos de uso",
  description:
    "Termos e condições de uso do site e das ferramentas da Daddus.",
  path: "/institucional/termos-de-uso",
});

export default function TermsLayout({
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
  