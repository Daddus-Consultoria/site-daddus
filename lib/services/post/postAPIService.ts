import PostRepository from "@/lib/repositories/PostRepository";
import { PostData, Post, CategoryMap } from "@/lib/interfaces/post";
import { httpClient } from "../httpClient";
import { GetSinglePostArgs, PostResponse } from "./index";

export class PostsAPIService implements PostRepository {
  postsMapper(post: PostResponse): Post {
    return {
      title: post.title,
      category: CategoryMap[post.category],
      image: {
        src: post.image || "",
        alt: `${post.title}-image`,
      },
      author: post.author,
      authorComment: post.comment,
      firstContent: post.firstContent,
      publishedAt: new Date(post.publishAt),
      slug: post.slug,
      tags: post.tags,
      relatedPosts: post.relatedPost,
      lastContent: post.lastContent,
    };
  }
  async getPosts(category?: string): Promise<PostData> {
    try {
      const categoryQuery = category
        ? `&filters[category][$contains]=${category}`
        : "";
      const path = `/posts?${categoryQuery}`;
      const response: any = await httpClient.get(path);
      console.log("The response is: ", response);

      const { data } = response;
      let posts: Post[] = [];

      data.forEach((post: any) => {
        posts.push(this.postsMapper(post));
      });

      const postData: PostData = {
        posts: posts,
      };

      return postData;
    } catch (error) {
      console.error(error);
      return { posts: [] };
    }
  }

  /*  async async getPostByCategory(category: Category): Promise<PostData> {

    } */

  async getSinglePost({ category, slug }: GetSinglePostArgs): Promise<Post> {
    try {
      const query = `&filters[category][$eq]=${category}&filters[slug][$eq]=${slug}`;
      const path = `/posts?${query}`;
      const response: any = await httpClient.get(path);
      console.log("The response is: ", response);

      const { data } = response;

      const post = this.postsMapper(data);

      return post;
    } catch (error) {
      console.error(error);
      return {} as Post;
    }
  }
}
