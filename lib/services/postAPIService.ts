import PostRepository from "@/lib/repositories/PostRepository";
import { PostData, PostModel } from "@/lib/interfaces/post";
import { httpClient } from "./httpClient";

export class PostsAPIService implements PostRepository{
    async getPosts(
        category?: string
    ): Promise<PostData> {
        try {
            const categoryQuery = category
                ? `&filters[category][$contains]=${category}`
                : '';
            const path = `/posts?populate[0]=coverImage&populate[1]=autor&${categoryQuery}`;
            const response:any = await httpClient.get(path);
            console.log("The response is: ", response);

            const { data } = response;

            console.log(data)

            let posts: PostModel[] = [];

            data.forEach((post:any) => {
                posts.push({
                    title: post.attributes.title,
                    category: post.attributes.category,
                    image: post.attributes.coverImage.data ? post.attributes.coverImage.data.attributes.url : "",
                    author: post.attributes.autor,
                    authorComment: post.attributes.comment,
                });
            });

            console.log("post")
            console.log(posts)

            const postData: PostData = {
                posts: posts
            };

            return postData
        }catch(error){
            console.error(error);
            return {posts: []};
        }
    }

   /*  async async getPostByCategory(category: Category): Promise<PostData> {
        
    } */
}