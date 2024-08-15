import { AuthorModel } from "@/lib/interfaces/author";
import { type BlocksContent } from "@strapi/blocks-react-renderer";

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
  financas: "Economia", // Mudado de Finanças para Economia
  politicasPublicas: "Políticas Públicas",
  governanca: "Governança",
  logistica: "Mobilidade", // Mudado de Logística para Mobilidade
  inovacao: "Inovação",
  sustentabilidade: "Sustentabilidade",
  oportunidades: "Oportunidades",
};

export interface PostModel {
  title: string;
  authorComment?: string;
  slug: string;
  image: ImageProps;
  publishedDate: string;
  author: AuthorModel;
  category: PostCategory;
  firstContent: String;
  lastContent?: String;
  tags: string[];
}

export interface PostData {
  posts: Post[];
  totalItems: number;
}

export interface Post extends PostModel {
  relatedPosts:
    | Omit<PostModel, "firstContent" | "lastContent" | "author">[]
    | undefined;
}


