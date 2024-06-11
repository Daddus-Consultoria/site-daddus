import { publishRepository } from "@/components/providers/repositoriesProviders/publishProvider";

export class PublishUseCases {
  publishRepository;
  constructor() {
    this.publishRepository = publishRepository;
  }

  async getMunicipalProfiles({title, category}:{category?:string,title?:string}) {
    try{
      return await this.publishRepository.getMunicipalProfiles(title);
    }catch(error){
      throw error;
    }
  }

  async getPaginatedMunicipalProfiles({
    page,
    limit,
    category,
  }: {
    page: number;
    limit: number;
    category?: string;
  }) {
    try {
      return await this.publishRepository.getPaginatedMunicipalProfiles(
        page,
        limit,
        category
      );
    } catch (error) {
      throw error;
    }
  }

  async getMunicipalProfileById({ id }: { id: string }) {
    try {
      return await this.publishRepository.getMunicipalProfilePublishById(id);
    } catch (error) {
      throw error;
    }
  }

  async getPaginatedGuides({ page, limit }: { page: number; limit: number }) {
    try {
      return await this.publishRepository.getPaginatedGuides(page, limit);
    } catch (error) {
      throw error;
    }
  }

  async getGuideById({ id }: { id: string }) {
    try {
      return await this.publishRepository.getGuidePublishById(id);
    } catch (error) {
      throw error;
    }
  }

  async getPaginatedStudies({ page, limit }: { page: number; limit: number }) {
    try {
      return await this.publishRepository.getPaginatedStudys(page, limit);
    } catch (error) {
      throw error;
    }
  }

  async getStudyById({ id }: { id: string }) {
    try {
      return await this.publishRepository.getStudyPublishById(id);
    } catch (error) {
      throw error;
    }
  }
}
