import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE, ogImageResponse } from "@/lib/seo/ogImage";

/** Cartao do blog e das suas listagens. Cada post gera o proprio. */
export const alt = "Blog da Daddus";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return ogImageResponse({
    eyebrow: "Blog",
    title: "Análises e notas da equipe da Daddus",
    footer: "Políticas públicas, economia, governança, mobilidade e inovação",
  });
}
