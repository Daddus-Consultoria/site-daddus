import { PostsAPIService } from "@/lib/services/postAPIService";

import PostRepository from "@/lib/repositories/PostRepository";

let postRepository: PostRepository;

postRepository = new PostsAPIService();

export { postRepository };