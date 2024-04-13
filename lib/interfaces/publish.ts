import { PublishCategories } from "../constants/constants";

export interface PublishModel {
  title: string;
  shortDescription: string;
  longDescription: string;
  category: PublishCategories;
  authors: string[];
  tags: string[];
  imageUrl: string;
  documentUrl: string;
}
