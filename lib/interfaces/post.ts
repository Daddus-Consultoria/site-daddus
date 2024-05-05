import { AuthorModel } from "@/lib/interfaces/author";

export type PostCategory =
  | "financas"
  | "politicasPublicas"
  | "governanca"
  | "logistica"
  | "inovacao"
  | "sustentabilidade"
  | "oportunidades";

export interface Post {
  title: string;
  authorComment?: string;
  image: string;
  author: AuthorModel;
  category: PostCategory;
}
