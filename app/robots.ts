import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/constants";

/**
 * robots.txt gerado pela aplicacao, e nao mais um arquivo estatico em
 * `public/`: o endereco do sitemap passa a sair da mesma constante do resto do
 * SEO, entao trocar o dominio nao deixa para tras um ponteiro errado.
 *
 * A busca da Biblioteca com `?q=` continua liberada de proposito. Bloquea-la
 * pareceria evitar conteudo duplicado, mas quem faz esse trabalho e a canonica
 * — e o bloqueio cortaria o caminho pelo qual o robo alcanca as fichas
 * seguindo os links da tela.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Area de sessao: nao ha o que indexar e o login ainda geraria uma
      // pagina de titulo duplicado em toda busca pela marca.
      disallow: ["/painel", "/login", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
