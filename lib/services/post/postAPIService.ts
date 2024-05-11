import PostRepository from "@/lib/repositories/PostRepository";
import { PostData, Post, CategoryMap } from "@/lib/interfaces/post";
import { httpClient } from "../httpClient";
import { GetSinglePostArgs, PostResponse } from "./index";
import { mapperAuthor } from "@/lib/services/author/index";

export class PostsAPIService implements PostRepository {
  postsMapper(post: PostResponse): Post {
    return {
      title: post.title,
      category: post.category,
      image: {
        src: post.coverImage?.data ? post.coverImage?.data.attributes.url : "",
        alt: `${post.title}-image`,
      },
      author: mapperAuthor(post.autor),
      authorComment: post.comment,
      firstContent: post.firstContent,
      publishedDate: post.publishDate,
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
      const path = `/posts?populate[0]=coverImage${categoryQuery}&populate[1]=autor`;
      const response: any = await httpClient.get(path);
      console.log("The response is: ", response);

      const { data } = response;
      let posts: Post[] = [];

      data.forEach((post: any) => {
        posts.push(this.postsMapper(post.attributes));
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

  async getSinglePost({ category, slug }: GetSinglePostArgs): Promise<Post> {
    try {
      const query = `&filters[category][$eq]=${category}&filters[slug][$eq]=${slug}&populate[0]=autor`;
      const path = `/posts?${query}`;
      const response: any = await httpClient.get(path);
      console.log("The response is: ", response);

      const { data } = response;
      console.log(data);
      const post = this.postsMapper(data[0].attributes);
      console.log("The post is: ", post);
      return post;
    } catch (error) {
      console.error(error);
      return {} as Post;
    }
  }
}
