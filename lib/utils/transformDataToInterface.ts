import { AuthorModel } from "@/lib/interfaces/author";
import { mapperAuthor } from "@/lib/services/author/index";

export const getAuthorsList = (data: any[]): AuthorModel[] => {
  try {
    return data.map((author) => {
      return mapperAuthor(author);
    });
  } catch (error) {
    console.error(`Error getting authors list: ${error}`);
    return [];
  }
};
