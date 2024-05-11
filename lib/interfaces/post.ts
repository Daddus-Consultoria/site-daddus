import { AuthorModel } from "@/lib/interfaces/author";
import { AuthorResponse } from "@/lib/services/author/index";
import { ImageProps } from "next/image";
import { ReactNode } from "react";

export type PostCategory =
  | "financas"
  | "politicasPublicas"
  | "governanca"
  | "logistica"
  | "inovacao"
  | "sustentabilidade"
  | "oportunidades";

export const CategoryMap: Record<PostCategory, string> = {
  financas: "Finanças",
  politicasPublicas: "Políticas Públicas",
  governanca: "Governança",
  logistica: "Logística",
  inovacao: "Inovação",
  sustentabilidade: "Sustentabilidade",
  oportunidades: "Oportunidades",
};

export interface Tag {
  label: string;
  slug: string;
}

export interface PostModel {
  title: string;
  authorComment?: string;
  slug: string;
  image: ImageProps;
  publishedDate: Date;
  author: AuthorModel;
  category: PostCategory;
  firstContent: ReactNode;
  lastContent?: ReactNode;
  tags: Tag[];
}

export interface Post extends PostModel {
  relatedPosts: PostModel[];
}

export interface PostData {
  posts: Post[];
}
