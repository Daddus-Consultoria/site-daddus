import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { TanstackProvider } from "@/components/providers/TanstackProvider";
import Script from "next/script";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daddus Consultoria",
  description:
    "Descubra o poder da excelência empresarial com a nossa consultoria especializada. Navegue por uma vasta gama de serviços estratégicos e soluções personalizadas projetadas para impulsionar o seu negócio para novos patamares de sucesso. ",
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6219534447075409"
          crossOrigin="anonymous"
        ></Script>
      </head>

      <body className={poppins.className}>
        <TanstackProvider>
          <Header />
          <main className="flex min-h-screen">{children}</main>
          <Footer />
        </TanstackProvider>
      </body>
    </html>
  );
}
