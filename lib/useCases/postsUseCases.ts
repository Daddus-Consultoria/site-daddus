import { postRepository } from "@/components/providers/repositoriesProviders/postProvider";
import { GetSinglePostArgs } from "../services/post";

export class PostsUseCases {
  postRepository;
  constructor() {
    this.postRepository = postRepository;
  }

  async getPosts(category?: string, limit?: number) {
    try {
      return await this.postRepository.getPosts(category);
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
