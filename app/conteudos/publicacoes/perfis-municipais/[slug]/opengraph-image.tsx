import { publishOgImage } from "@/app/conteudos/publicacoes/_publishPage";
import { PublishCategories } from "@/lib/constants/constants";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/seo/ogImage";

export const alt = "Perfil municipal publicado pela Daddus";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function OpenGraphImage({ params }: { params: { slug: string } }) {
  return publishOgImage(PublishCategories.MUNICIPAL_PROFILE, params.slug);
}
