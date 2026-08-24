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
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/seo/constants";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

/**
 * Metadados herdados por todo o site.
 *
 * O template do titulo e o que permite que cada rota declare so o proprio nome
 * ("Biblioteca Daddus", "Estudos") sem repetir a marca.
 *
 * A canonica e `"./"`, e nao um caminho fixo: o Next resolve o ponto contra o
 * pathname real da rota, entao cada pagina aponta para si mesma e nenhuma fica
 * sem canonica — inclusive as que sao client component e nao podem declarar
 * metadados. Como o pathname nao carrega query string, `?pagina=2` e `?q=` da
 * busca ja caem na canonica limpa. Paginas que precisam de outro alvo
 * sobrescrevem o campo.
 *
 * A imagem de compartilhamento tambem nao aparece aqui — quem a fornece e
 * `app/opengraph-image.tsx`, e declarar `openGraph.images` neste objeto
 * desligaria essa geracao.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "./" },
  icons: {
    icon: "/images/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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

        {/* Quem publica o site e qual e a busca que cobre um acervo. Ficam no
            layout porque valem para toda pagina, e os blocos das rotas
            (ficha, estudo, recorte) apenas se referem a eles por id. */}
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
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
