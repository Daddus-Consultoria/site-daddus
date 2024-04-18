import { PublishModel, PublishData } from "../interfaces/publish";
import PublishRepository from "../repositories/PublishRepository";

class MockPublishRepository extends PublishRepository {
  async getPaginatedPublishes(
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

  async getPublishById(id: string): Promise<PublishModel | null> {
    // Implement your mock logic here
    return null;
  }
}

export { MockPublishRepository };
