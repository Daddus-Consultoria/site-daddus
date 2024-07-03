import {
  PublishData,
  PublishModel,
  CategoryModel
} from "../interfaces/publish";
import { PublishCategories } from "@/lib/constants/constants";

abstract class PublishRepository {
  /* abstract getMunicipalProfiles(title?: string): Promise<PublishData>;

  abstract getPaginatedMunicipalProfiles(
    page: number,
    limit: number,
    category?: string
  ): Promise<PublishData>; */

  abstract getPublish (title?: string, category?: PublishCategories): Promise<PublishData>;

  abstract getPublishById (slug:string, category:PublishCategories): Promise<PublishModel | null>;

  abstract getPaginatedPublish (page: number, limit: number, category?:string, order?:"asc" | "desc"): Promise<PublishData>;

  /* abstract getMunicipalProfilePublishById(
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

  abstract getStudyPublishById(id: string): Promise<PublishModel | null>; */
}

export default PublishRepository;
