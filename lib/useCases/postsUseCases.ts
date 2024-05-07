import { postRepository } from "@/components/providers/repositoriesProviders/postProvider";

export class PostsUseCases{
    postRepository;
    constructor(){
        this.postRepository = postRepository;
    }

    async getPosts(category?:string){
        try{
            return await this.postRepository.getPosts(category);
        }catch(error){
            throw error;
        }
    }
}