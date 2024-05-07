import { DaddusBreadcrumb } from "@/components/daddusBreadcrumb/index";
import type { Metadata } from "next";

export const metadata: Metadata = {
   
}

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
