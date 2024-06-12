import {
  PublishData,
  PublishModel,
  MunicipalProfileModel,
} from "../interfaces/publish";

abstract class PublishRepository {
  abstract getMunicipalProfiles(title?: string): Promise<PublishData>;

  abstract getPaginatedMunicipalProfiles(
    page: number,
    limit: number,
    category?: string
  ): Promise<PublishData>;

  abstract getMunicipalProfilePublishById(
    id: string
  ): Promise<MunicipalProfileModel | null>;

  abstract getGuides(title?: string): Promise<PublishData>;

  abstract getPaginatedGuides(
    page: number,
    limit: number
  ): Promise<PublishData>;

  abstract getGuidePublishById(id: string): Promise<PublishModel | null>;

  abstract getStudys(title?: string): Promise<PublishData>;

  abstract getPaginatedStudys(
    page: number,
    limit: number
  ): Promise<PublishData>;

  abstract getStudyPublishById(id: string): Promise<PublishModel | null>;
}

export default PublishRepository;
