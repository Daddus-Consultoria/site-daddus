import { documentTypeLabels } from "@/lib/biblioteca/constants";
import { getDocumentBySlug } from "@/lib/biblioteca/queries";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE, ogImageResponse } from "@/lib/seo/ogImage";

/**
 * Cartao da ficha. Traz o titulo do documento e a procedencia — que e o que
 * decide se vale abrir um link colado num grupo de pesquisa.
 */
export const alt = "Ficha de documento na Biblioteca Daddus";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function OpenGraphImage({ params }: { params: { slug: string } }) {
  const document = await getDocumentBySlug(params.slug).catch(() => null);

  if (!document) {
    return ogImageResponse({
      eyebrow: "Biblioteca Daddus",
      title: "Documento não encontrado",
    });
  }

  return ogImageResponse({
    eyebrow: `Biblioteca · ${documentTypeLabels[document.documentType]}`,
    title: document.title,
    footer: [document.institution ?? document.source.name, document.year]
      .filter(Boolean)
      .join(" · "),
  });
}
