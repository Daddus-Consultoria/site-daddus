import { PostData, Post } from "@/lib/interfaces/post";
import { GetSinglePostArgs } from "../services/post";

abstract class PostRepository {
  abstract getPosts(category?: string): Promise<PostData>;

  /* abstract getPostByCategory(category: Category):Promise<PostData>; */
  abstract getSinglePost({ category, slug }: GetSinglePostArgs): Promise<Post>;
}

export default PostRepository;
