import { publishRepository } from "@/components/providers/repositoriesProviders/publishProvider";
import { PublishCategories } from "@/lib/constants/constants";

export class PublishUseCases {
  

  publishRepository;
  constructor() {
    this.publishRepository = publishRepository;
  }

  async getPublish({ title }: { title?: string}) {
    try {
      return await this.publishRepository.getPublish(title);
    } catch (error) {
      throw error;
    }
  }

  async getMunicipalProfiles({title}:{title?:string}) {
    try{
      return await this.publishRepository.getPublish(title, PublishCategories.MUNICIPAL_PROFILE);
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

  async getMunicipalProfileBySlug({ slug }: { slug: string}) {
    try {
      return await this.publishRepository.getPublishById(slug, PublishCategories.MUNICIPAL_PROFILE);
    } catch (error) {
      throw error;
    }
  }

  async getGuides({ title }: { title?: string }) {
    try {
      return await this.publishRepository.getPublish(title, PublishCategories.GUIDES);
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

  async getGuideBySlug({ slug }: { slug: string}) {
    try {
      return await this.publishRepository.getPublishById(slug, PublishCategories.GUIDES);
    } catch (error) {
      throw error;
    }
  }

  async getStudys({title}:{title?:string}){
    try{
      return await this.publishRepository.getPublish(title, PublishCategories.STUDIES);
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

  async getStudyBySlug({ slug }: { slug: string, }) {
    try {
      return await this.publishRepository.getPublishById(slug, PublishCategories.STUDIES);
    } catch (error) {
      throw error;
    }
  }
}
