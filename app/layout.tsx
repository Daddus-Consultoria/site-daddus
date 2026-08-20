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

const siteUrl = "https://www.daddusconsultoria.com";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Daddus - Consultoria em Projetos para o Setor Público e Corporativo",
  description:
    "Somos especialistas na elaboração de Políticas Públicas, no desenvolvimento de Estratégias de Gestão e na realização Estudos de Viabilidade Econômica para empresas públicas e privadas do Brasil. Conheça nossos serviços!",
  icons: {
    icon: "/images/favicon.ico",
  },
  keywords:['politicas publicas', 'estrategias de gestao', 'viabilidade economica', 'consultoria empresarial'],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Daddus Consultoria",
    title: "Daddus Consultoria | Projetos para o setor público e corporativo",
    description: "Consultoria em políticas públicas, gestão e viabilidade econômica.",
    images: [{ url: "/images/logos/daddus.svg", width: 230, height: 50, alt: "Daddus Consultoria" }],
  },
  twitter: {
    card: "summary",
    title: "Daddus Consultoria",
    description: "Consultoria em políticas públicas, gestão e viabilidade econômica.",
  },
  robots: { index: true, follow: true },
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
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8438265169368287"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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
