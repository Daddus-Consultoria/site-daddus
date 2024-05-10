import { AuthorModel } from "@/lib/interfaces/author";
import { PostCategory, Tag } from "@/lib/interfaces/post";

export interface PostResponse {
  title: string;
  category: PostCategory;
  image?: string;
  author: AuthorModel;
  comment?: string;
  firstContent?: string;
  publishAt: string;
  slug: string;
  tags: Tag[];
  relatedPost?: any;
  lastContent?: string;
}

export interface GetSinglePostArgs {
  category: string;
  slug: string;
}

export interface GetSinglePostResponse {
  data: PostResponse;
}
