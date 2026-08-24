import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE, ogImageResponse } from "@/lib/seo/ogImage";

/**
 * Cartao da Biblioteca. Sem numeros: o cartao e cacheado pela rede social que o
 * consumiu, e um total que envelhece no cache vira informacao errada.
 */
export const alt = "Biblioteca Daddus";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return ogImageResponse({
    eyebrow: "Biblioteca Daddus",
    title: "Pesquisa em acervos acadêmicos e institucionais",
    footer: "Metadados de acervos públicos, com link para o documento na origem",
  });
}
