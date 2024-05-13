import PostRepository from "@/lib/repositories/PostRepository";
import { httpClient } from "../httpClient";
import {
  GetPostsArgs,
  GetSinglePostArgs,
  PostResponse,
  RelationatedPost,
} from "./index";
import { mapperAuthor } from "@/lib/services/author/index";
import { Post, PostData, PostModel } from "@/lib/interfaces/post";

export class PostsAPIService implements PostRepository {
  relatedPostMapper(
    posts?: RelationatedPost[]
  ): Omit<PostModel, "author" | "firstContent" | "lastContent">[] | undefined {
    return posts?.map((post) => {
      console.log(post);
      return {
        title: post.attributes.title,
        authorComment: post.attributes.comment,
        image: {
          src: post.attributes.coverImage?.data
            ? post.attributes.coverImage?.data.attributes.url
            : "",
          alt: `${post.attributes.title}-image`,
        },
        slug: post.attributes.slug,
        category: post.attributes.category,
        publishedDate: post.attributes.publishDate,
        tags: post.attributes.tags,
      };
    });
  }
  postsMapper(post: PostResponse): Post {
    return {
      title: post.attributes.title,
      category: post.attributes.category,
      image: {
        src: post.attributes.coverImage?.data
          ? post.attributes.coverImage?.data.attributes.url
          : "",
        alt: `${post.attributes.title}-image`,
      },
      relatedPosts: this.relatedPostMapper(
        post?.attributes.relationedPosts?.data
      ),
      author: mapperAuthor(post.attributes.autor),
      authorComment: post.attributes.comment,
      firstContent: post.attributes.firstContent,
      publishedDate: post.attributes.publishDate,
      slug: post.attributes.slug,
      tags: post.attributes.tags,
      lastContent: post.attributes.lastContent,
    };
  }
  async getPosts({ category, limit, order }: GetPostsArgs): Promise<PostData> {
    try {
      const categoryQuery = category
        ? `&filters[category][$contains]=${category}`
        : "";
      const limitQuery = limit ? `&pagination[limit]=${limit}` : "";
      const orderQuery = order ? `&sort=id:desc` : ""; // Adicionando ordenação decrescente por ID se o parâmetro 'order' estiver presente
      const path = `/posts?populate[0]=coverImage${categoryQuery}${limitQuery}&populate[1]=autor${orderQuery}`;

      const response: any = await httpClient.get(path);

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

  async getSinglePost({ category, slug }: GetSinglePostArgs): Promise<Post> {
    try {
      const query = `&filters[category][$eq]=${category}&filters[slug][$eq]=${slug}&populate[0]=autor&populate[1]=autor.avatar&populate[2]=relationedPosts&populate[3]=relationedPosts.coverImage`;
      const path = `/posts?${query}`;
      const response: any = await httpClient.get(path);

      const { data } = response;
      const post = this.postsMapper(data[0]);

      return post;
    } catch (error) {
      console.error(error);
      return {} as Post;
    }
  }
}
