import { postRepository } from "@/components/providers/repositoriesProviders/postProvider";
import { GetPostsArgs, GetSinglePostArgs } from "../services/post";

export class PostsUseCases {
  postRepository;
  constructor() {
    this.postRepository = postRepository;
  }

  async getPosts(args: GetPostsArgs) {
    try {
      return await this.postRepository.getPosts(args);
    } catch (error) {
      throw error;
    }
  }
  async getSinglePost(args: GetSinglePostArgs) {
    try {
      return await this.postRepository.getSinglePost(args);
    } catch (error) {
      throw error;
    }
  }
}
