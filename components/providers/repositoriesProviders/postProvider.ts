import { PostsAPIService } from "@/lib/services/post/postAPIService";

import PostRepository from "@/lib/repositories/PostRepository";

let postRepository: PostRepository;

postRepository = new PostsAPIService();

export { postRepository };
