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
