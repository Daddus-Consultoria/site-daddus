import { postOgImage } from "@/app/blog/_postPage";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/seo/ogImage";

export const alt = "Post do blog da Daddus";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function OpenGraphImage({
  params,
}: {
  params: { category: string; post: string };
}) {
  return postOgImage(params.category, params.post);
}
