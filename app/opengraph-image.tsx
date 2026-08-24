import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE, ogImageResponse } from "@/lib/seo/ogImage";
import { SITE_DESCRIPTION } from "@/lib/seo/constants";

/**
 * Cartao padrao do site. Vale para toda rota que nao gere o proprio — as
 * paginas de conteudo (ficha, estudo, post) geram, porque nelas o titulo e a
 * informacao que importa.
 */
export const alt = "Daddus — dados, conhecimento, consultoria e tecnologia";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return ogImageResponse({
    // Sem tarja: aqui a marca e o assunto, e ela ja assina o rodape.
    title: "Dados, conhecimento, consultoria e tecnologia",
    footer: SITE_DESCRIPTION,
  });
}
