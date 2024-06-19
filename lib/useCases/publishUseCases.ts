import { publishRepository } from "@/components/providers/repositoriesProviders/publishProvider";
import { CategoryModel } from "@/lib/interfaces/publish";
import {PublishCategories} from "@/lib/constants/constants";

export class PublishUseCases {
  

  publishRepository;
  constructor() {
    this.publishRepository = publishRepository;
  }

  async getMunicipalProfiles({title}:{title?:string}) {
    try{
      return await this.publishRepository.getPublish(title);
    }catch(error){
      throw error;
    }
  }

  async getPaginatedMunicipalProfiles({
    page,
    limit,
    order,
  }: {
    page: number;
    limit: number;
    order? : "asc" | "desc"
  }) {
    try {
      return await this.publishRepository.getPaginatedPublish(
        page,
        limit,
        PublishCategories.MUNICIPAL_PROFILE,
        order,
      );
    } catch (error) {
      throw error;
    }
  }

  async getMunicipalProfileById({ id }: { id: string}) {
    try {
      return await this.publishRepository.getPublishById(id, PublishCategories.MUNICIPAL_PROFILE);
    } catch (error) {
      throw error;
    }
  }

  async getGuides({ title }: { title?: string }) {
    try {
      return await this.publishRepository.getPublish(title);
    }catch(error){
      throw error;
    }
  }

  async getPaginatedGuides({ page, limit, order }: { page: number; limit: number,order? : "asc" | "desc" }) {
    try {
      return await this.publishRepository.getPaginatedPublish(page, limit, PublishCategories.GUIDES, order);
    } catch (error) {
      throw error;
    }
  }

  async getGuideById({ id, category }: { id: string, category: PublishCategories}) {
    try {
      return await this.publishRepository.getPublishById(id, category);
    } catch (error) {
      throw error;
    }
  }

  async getStudys({title}:{title?:string}){
    try{
      return await this.publishRepository.getPublish(title);
    }catch(error){
      throw error;
    }
  }

  async getPaginatedStudies({ page, limit,order }: { page: number; limit: number,order? : "asc" | "desc" }) {
    try {
      return await this.publishRepository.getPaginatedPublish(page, limit, PublishCategories.STUDIES, order);
    } catch (error) {
      throw error;
    }
  }

  async getStudyById({ id, category }: { id: string, category: PublishCategories }) {
    try {
      return await this.publishRepository.getPublishById(id, category);
    } catch (error) {
      throw error;
    }
  }
}
