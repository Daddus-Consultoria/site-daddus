import {
  PublishModel,
  PublishData,
  PublishIndexEntry,
} from "../interfaces/publish";
import PublishRepository from "../repositories/PublishRepository";

class MockPublishRepository extends PublishRepository {
  async getPublish(title?: string | undefined): Promise<PublishData> {
    return {
      items: [],
      totalItems: 0,
    }
  }

  async getPublishById(id: string): Promise<PublishModel | null> {
    return null
  }

  async getPaginatedPublish(page: number, limit: number, category?: string): Promise<PublishData> {
    return {
      items: [],
      totalItems: 0,
    }
  }

  async searchPublish(): Promise<PublishData> {
    return {
      items: [],
      totalItems: 0,
    }
  }

  async getPublishIndex(): Promise<PublishIndexEntry[]> {
    return [];
  }
}

export { MockPublishRepository };
