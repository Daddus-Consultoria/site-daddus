import { PublishCategories, PublishSubCategories } from "@/lib/constants/constants";
import { AuthorModel } from "@/lib/interfaces/author";

export interface SubCategoryModel {
  subCategory: 'Perfil Social dos Municípios' | 'Perfil Eleitoral dos Municípios' | 'Perfil Econômico dos Municípios',
}

export interface CategoryModel {
  category: 'estudo' | 'guia' | 'perfil-municipal',
}

export interface PublishModel {
  id: number,
  title: string,
  shortDescription: string,
  longDescription: string,
  imageUrl: string,
  subCategory: PublishSubCategories,
  authors: AuthorModel[],
  publishDate: Date,
  tags: string[],
  documentLink: string,
  slug: string,
  category: PublishCategories,
}

export interface PublishData {
  items: PublishModel[];
  totalItems: number;
}

/**
 * Filtros do acervo. Cada campo vira um filtro do Strapi; campo vazio nao
 * entra na query, para que "sem filtro" signifique mesmo o acervo inteiro.
 */
export interface PublishFilters {
  search?: string;
  category?: PublishCategories;
  subCategory?: string;
  tag?: string;
  year?: number;
}

export interface PublishQuery extends PublishFilters {
  page: number;
  limit: number;
  order?: "asc" | "desc";
}

/**
 * Versao enxuta de uma publicacao, usada so para montar as opcoes de filtro.
 * As opcoes saem do que existe no acervo — nunca de uma lista fixa no codigo,
 * que envelheceria e ofereceria filtros sem resultado.
 */
export interface PublishIndexEntry {
  category: PublishCategories;
  subCategory: string | null;
  publishDate: string | null;
  tags: string[];
}
