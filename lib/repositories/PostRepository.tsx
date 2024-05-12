import { PostData, Post } from "@/lib/interfaces/post";
import { GetPostsArgs, GetSinglePostArgs } from "../services/post";

abstract class PostRepository {
  abstract getPosts({
    category,
    limit,
    order,
  }: GetPostsArgs): Promise<PostData>;

  /* abstract getPostByCategory(category: Category):Promise<PostData>; */
  abstract getSinglePost({ category, slug }: GetSinglePostArgs): Promise<Post>;
}

export default PostRepository;
