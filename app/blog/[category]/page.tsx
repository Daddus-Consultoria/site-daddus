import type { Metadata } from "next";

import { CATEGORY_LABELS_BLOG } from "./_constants";
import { CategoryList } from "./_categoryList";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * Listagem de uma categoria do blog. A rota virou server component so para
 * declarar o titulo e a descricao — a listagem em si continua no cliente,
 * porque a paginacao e interativa.
 */
interface PageProps {
  params: { category: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const label = CATEGORY_LABELS_BLOG[params.category];

  // Categoria fora da navegacao nao rende listagem: fica fora do indice em vez
  // de disputar a busca com uma pagina sem resultado.
  if (!label) {
    return pageMetadata({
      title: "Blog",
      description: "Análises e notas da equipe da Daddus.",
      path: `/blog/${params.category}`,
      index: false,
    });
  }

  return pageMetadata({
    title: `${label} — Blog`,
    description: `Análises e notas da equipe da Daddus sobre ${label.toLowerCase()}.`,
    path: `/blog/${params.category}`,
  });
}

export default function CategoryPage() {
  return <CategoryList />;
}
