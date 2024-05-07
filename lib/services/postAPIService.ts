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
            const path = `/posts?${categoryQuery}`;
            const response:any = await httpClient.get(path);
            console.log("The response is: ", response);

            const {data} = response;
            let posts: PostModel[] = [];

            data.forEach((post:any) => {
                posts.push({
                    title: post.title,
                    category: post.category,
                    image: post.image,
                    author: post.author,
                    authorComment: post.comment,
                });
            });

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