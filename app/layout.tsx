import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { DaddusBreadcrumb } from "@/components/daddusBreadcrumb";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daddus Consultoria",
  description: "Descubra o poder da excelência empresarial com a nossa consultoria especializada. Navegue por uma vasta gama de serviços estratégicos e soluções personalizadas projetadas para impulsionar o seu negócio para novos patamares de sucesso. ",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={poppins.className}>
        <Header />
        <main className="flex min-h-screen">
          <div className="flex w-full flex-col">
            <DaddusBreadcrumb />
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
