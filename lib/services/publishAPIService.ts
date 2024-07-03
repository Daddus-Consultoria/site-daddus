import PublishRepository from "@/lib/repositories/PublishRepository";
import {
  PublishModel,
  PublishData,
} from "@/lib/interfaces/publish";
import {PublishCategories} from '@/lib/constants/constants';
import { mapperPublish } from "@/lib/services/index";
import { httpClient } from "./httpClient";

export class PublishAPIService implements PublishRepository {
  async getPublish(title?: string, category?: PublishCategories): Promise<PublishData> {
    try{
      const categoryQuery = category ? `&filters[category][$contains]=${category}` : ``;
      const titleQuery = title ? `&filters[title][$containsi]=${title}` : ``;
      const path = `/publicacoes?populate[0]=coverImage&populate[1]=authors${titleQuery}${categoryQuery}`;

      const response:any = await httpClient.get(path);

      const { data } = response;

      let publishes: PublishModel[] = [];
      data.forEach((publish: any) => {
        publishes.push(mapperPublish(publish));
      });

      const { meta } = response;
      const totalItems = meta.pagination.total;
      
      const publishData: PublishData = {
        items:publishes,
        totalItems,
      }

      return publishData;
    }catch(error){
      console.log(error);
      return {
        items:[],
        totalItems:0
      }
    }
  }

  async getPublishById(slug:string, category:PublishCategories): Promise<PublishModel> {
    try{
      const categoryQuery = category ? `&filters[category][$contains]=${category}` : ``;
      const slugQuery = slug ? `&filters[slug][$eq]=${slug}` : ``;
      const path = `/publicacoes?populate[0]=coverImage&populate[1]=authors${categoryQuery}${slugQuery}`;
      const response:any = await httpClient.get(path);


      const { data } = response;

      const publish: PublishModel = mapperPublish(data[0]);

      return publish;
    }catch(error){
      console.log(error);
      throw new Error(`Error while fetching publish with id: ${slug}: ${error}`);
    }
  }

  async getPaginatedPublish(
    page: number,
    limit: number,
    category?: string,
    order?:  "asc" | "desc",
  ): Promise<PublishData> {
    try{
      const orderQuery = order ? `&sort=id:desc` : ""; // Adicionando ordenação decrescente por ID se o parâmetro 'order' estiver presente
      const categoryQuery = category ? `&filters[category][$contains]=${category}` : ``;
      const path = `/publicacoes?populate[0]=coverImage&populate[1]=authors&pagination[page]=${page}&pagination[pageSize]=${limit}${categoryQuery}${orderQuery}`;
      const response:any = await httpClient.get(path);

      const { data } = response;
      let publishes: PublishModel[] = [];
      data.forEach((publish: any) => {
        publishes.push(mapperPublish(publish));
      });

      const { meta } = response;
      const totalItems = meta.pagination.total;
      
      const publishData: PublishData = {
        items:publishes,
        totalItems,
      }

      return publishData;
    }catch(error){
      console.log(error);
      return {
        items:[],
        totalItems:0
      }
    }
  }
}
