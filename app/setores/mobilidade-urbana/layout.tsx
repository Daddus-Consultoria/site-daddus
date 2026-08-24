import { DaddusBreadcrumb } from "@/components/daddusBreadcrumb/index";
import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Mobilidade urbana",
  description:
    "Panorama do deslocamento urbano no Brasil e os dados que embasam decisões de planejamento.",
  path: "/setores/mobilidade-urbana",
});

export default function UrbanMobilityLayout({
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
