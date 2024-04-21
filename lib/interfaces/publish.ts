import { PublishCategories } from "@/lib/constants/constants";
import { AuthorModel } from "@/lib/interfaces/author";

export interface PublishModel {
  title: string;
  shortDescription: string;
  longDescription: string;
  authors: AuthorModel[];
  tags: string[];
  imageUrl: string;
  documentUrl: string;
  id: number;
}

export interface PublishData {
  items: PublishModel[];
  totalItems: number;
}

export interface MunicipalProfileModel extends PublishModel {
  category: PublishCategories;
}

export interface StudyModel extends PublishModel {}

export interface GuideModel extends PublishModel {}
