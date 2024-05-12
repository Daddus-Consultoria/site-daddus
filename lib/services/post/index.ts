import { PostCategory } from "@/lib/interfaces/post";
import { AuthorResponse } from "@/lib/services/author/index";

export interface RelationatedPost {
  attributes: {
    title: string;
    category: PostCategory;
    coverImage?: any;
    autor: AuthorResponse;
    comment?: string;
    slug: string;
    tags: string[];
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
    tags: string[];
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

export interface GetPostsArgs {
  category: string;
  limit?: number;
  order?: "asc" | "desc";
}
