import { PublishData, PublishModel } from "../interfaces/publish";

abstract class PublishRepository {
  abstract getPaginatedPublishes(
    page: number,
    limit: number,
    category?: string
  ): Promise<PublishData>;

  abstract getPublishById(id: string): Promise<PublishModel | null>;
}

export default PublishRepository;
