import { AuthorModel } from "@/lib/interfaces/author";
import { PostCategory, Tag } from "@/lib/interfaces/post";
import { AuthorResponse } from "@/lib/services/author/index";

export interface Post {
  title: string;
  category: PostCategory;
  coverImage?: any;
  autor: AuthorResponse;
  comment?: string;
  firstContent?: string;
  publishDate: string;
  slug: string;
  tags: Tag[];
  lastContent?: string;
}

export interface PostResponse extends Post {
  relatedPost: Post[];
}

export interface GetSinglePostArgs {
  category: string;
  slug: string;
}

export interface GetSinglePostResponse {
  data: PostResponse;
}
