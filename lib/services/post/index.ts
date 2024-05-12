import { PostCategory, Tag } from "@/lib/interfaces/post";
import { AuthorResponse } from "@/lib/services/author/index";

export interface RelationatedPost {
  attributes: {
    title: string;
    category: PostCategory;
    coverImage?: any;
    autor: AuthorResponse;
    comment?: string;
    slug: string;
    tags: Tag[];
    publishDate: string;
  };
}
export interface PostResponse {
  attributes: {
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
    relationedPosts: {
      data: RelationatedPost[];
    };
  };
}

export interface GetSinglePostArgs {
  category: string;
  slug: string;
}

export interface GetSinglePostResponse {
  data: PostResponse;
}
