import { resolveRecorte } from "../_recorte";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE, ogImageResponse } from "@/lib/seo/ogImage";

export const alt = "Recorte da Biblioteca Daddus";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function OpenGraphImage({
  params,
}: {
  params: { recorte: string };
}) {
  const recorte = await resolveRecorte(params.recorte).catch(() => null);

  return ogImageResponse({
    eyebrow: "Biblioteca Daddus",
    title: recorte?.title ?? "Biblioteca Daddus",
    footer: recorte?.description,
  });
}
