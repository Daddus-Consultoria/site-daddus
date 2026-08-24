import type { Metadata } from "next";

import {
  PUBLISH_REVALIDATE,
  publishMetadata,
  renderPublishPage,
} from "@/app/conteudos/publicacoes/_publishPage";
import { PublishCategories } from "@/lib/constants/constants";

/**
 * Estudo do acervo da Daddus. A montagem e os metadados vivem em
 * `_publishPage.tsx`, compartilhado pelos tres tipos de publicacao.
 */
export const revalidate = PUBLISH_REVALIDATE;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return publishMetadata(PublishCategories.STUDIES, params.slug);
}

export default async function Page({ params }: PageProps) {
  return renderPublishPage(PublishCategories.STUDIES, params.slug);
}
