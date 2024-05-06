import { postRepository } from "@/components/providers/repositoriesProviders/postProvider";

export class PostsUseCases{
    postRepository;
    constructor(){
        this.postRepository = postRepository;
    }

    async getPosts(){
        try{
            return await this.postRepository.getPosts();
        }catch(error){
            throw error;
        }
    }
}