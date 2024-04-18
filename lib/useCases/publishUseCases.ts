import { publishRepository } from "@/components/providers/repositoriesProviders/publishProvider";

export class PublishUseCases {
  publishRepository;
  constructor() {
    this.publishRepository = publishRepository;
  }

  async getPaginatedPublishes({
    page,
    limit,
    category,
  }: {
    page: number;
    limit: number;
    category?: string;
  }) {
    try {
      return await this.publishRepository.getPaginatedPublishes(
        page,
        limit,
        category
      );
    } catch (error) {
      throw error;
    }
  }

  async getPublishById({ id }: { id: string }) {
    try {
      return await this.publishRepository.getPublishById(id);
    } catch (error) {
      throw error;
    }
  }
}
