/**
 * Base de SEO do site.
 *
 * Titulo, descricao e URL canonica saem daqui para que a mesma frase de
 * posicionamento apareca no resultado de busca, no cartao de compartilhamento e
 * nos dados estruturados. Ver docs/DIRETRIZES-UX.md, "Posicionamento resumido".
 */

export const SITE_URL = "https://www.daddusconsultoria.com";

export const SITE_NAME = "Daddus";

/** Titulo da home. As demais paginas entram no template `%s | Daddus`. */
export const SITE_TITLE = "Daddus — dados, conhecimento, consultoria e tecnologia";

/**
 * A descricao repete o posicionamento das tres frentes. Nao e a antiga frase de
 * consultoria: achatar a Daddus em "consultoria" contraria a diretriz 1.
 */
export const SITE_DESCRIPTION =
  "A Daddus combina dados, conhecimento, consultoria e tecnologia para apoiar decisões e gestão no setor público e no privado.";

export const SITE_LOCALE = "pt_BR";

/** Cores usadas nos cartoes de compartilhamento — as mesmas do tema. */
export const BRAND = {
  primary: "#A90920",
  secondary: "#0D0D0D",
  paper: "#FFFFFF",
  muted: "#767676",
};

/** Caminho relativo -> URL absoluta. O sitemap e o JSON-LD exigem absoluta. */
export const absoluteUrl = (path: string): string =>
  new URL(path, SITE_URL).toString();
