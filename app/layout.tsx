import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { GoogleAnalytics } from "@/components/index";
import { TanstackProvider } from "@/components/providers/TanstackProvider";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/lib/auth/auth-context";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daddus - Consultoria em Projetos para o Setor Público e Corporativo",
  description:
    "Somos especialistas na elaboração de Políticas Públicas, no desenvolvimento de Estratégias de Gestão e na realização Estudos de Viabilidade Econômica para empresas públicas e privadas do Brasil. Conheça nossos serviços!",
  icons: {
    icon: "/images/favicon.ico",
  },
  keywords:['politicas publicas', 'estrategias de gestao', 'viabilidade economica', 'consultoria empresarial'],
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8438265169368287"
          crossOrigin="anonymous"
        ></Script>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        )}
        <link rel="preload" href="/images/home/first_section_background.webp" as="image" type="image/webp"/>
      </head>

      <body className={poppins.className}>
        <TanstackProvider>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Analytics />
            <Footer />
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
