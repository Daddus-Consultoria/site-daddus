import PublishRepository from "@/lib/repositories/PublishRepository";
import { PublishModel, PublishData } from "@/lib/interfaces/publish";
import { httpClient } from "./httpClient";

export class PublishAPIService implements PublishRepository {
  async getPaginatedPublishes(
    page: number,
    limit: number,
    category?: string
  ): Promise<PublishData> {
    try {
      const categoryQuery = category
        ? `&filters[category][$contains]=${category}`
        : "";
      const path = `/publicacoes?populate[0]=coverImage&pagination[page]=${page}&pagination[pageSize]=${limit}${categoryQuery}`;
      const response: any = await httpClient.get(path);
      console.log(" The response is: ", response);

      const { data } = response;
      let publishes: PublishModel[] = [];
      data.forEach((publish: any) => {
        publishes.push({
          id: publish.id,
          authors: publish.attributes.authors,
          category: publish.attributes.category,
          documentUrl: publish.attributes.documentUrl,
          imageUrl: publish.attributes.coverImage.data.attributes.url,
          longDescription: publish.attributes.longDescription,
          shortDescription: publish.attributes.shortDescription,
          tags: publish.attributes.tags,
          title: publish.attributes.title,
        });
      });

      const { meta } = response;
      const totalItems = meta.pagination.total;

      const publishData: PublishData = {
        items: publishes,
        totalItems,
      };

      return publishData;
    } catch (error) {
      console.error(error);
      return { items: [], totalItems: 0 };
    }
  }
  getPublishById(id: number): Promise<PublishModel> {
    try {
      const path = `/publishes/${id}`;
      return httpClient.get<PublishModel>(path);
    } catch (error) {
      console.error(error);
      throw new Error(`Error while fetching publish with id: ${id}: ${error}`);
    }
  }
}
