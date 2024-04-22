import { AuthorModel } from "@/lib/interfaces/author";

export const getAuthorsList = (data: any[]): AuthorModel[]  => {
    try {
        console.log("The data is: ", data)
        return data.map((author) => {
            return {
              id: author.id,
              name: author.attributes.name,
            };
          });
    } catch (error) {
        console.error(`Error getting authors list: ${error}`);
        return [];
    }
}