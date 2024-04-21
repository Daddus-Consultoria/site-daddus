import {
  PublishModel,
  PublishData,
  MunicipalProfileModel,
} from "../interfaces/publish";
import PublishRepository from "../repositories/PublishRepository";

class MockPublishRepository extends PublishRepository {
  async getPaginatedMunicipalProfiles(
    page: number,
    limit: number,
    category?: string
  ): Promise<PublishData> {
    // Implement your mock logic here
    return {
      items: [],
      totalItems: 0,
    };
  }

  async getMunicipalProfilePublishById(
    id: string
  ): Promise<MunicipalProfileModel | null> {
    // Implement your mock logic here
    return null;
  }

  async getPaginatedGuides(page: number, limit: number): Promise<PublishData> {
    // Implement your mock logic here
    return {
      items: [],
      totalItems: 0,
    };
  }

  async getGuidePublishById(id: string): Promise<PublishModel | null> {
    // Implement your mock logic here
    return null;
  }

  async getPaginatedStudys(page: number, limit: number): Promise<PublishData> {
    // Implement your mock logic here
    return {
      items: [],
      totalItems: 0,
    };
  }

  async getStudyPublishById(id: string): Promise<PublishModel | null> {
    // Implement your mock logic here
    return null;
  }
}

export { MockPublishRepository };
