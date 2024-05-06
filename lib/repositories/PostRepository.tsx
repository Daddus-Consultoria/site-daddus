import { PostData} from '@/lib/interfaces/post'

abstract class PostRepository{
    abstract getPosts(
        category?: string
    ):Promise<PostData>;

    /* abstract getPostByCategory(category: Category):Promise<PostData>; */
}

export default PostRepository;