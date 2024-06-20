import PublishRepository from "@/lib/repositories/PublishRepository";
import {
  PublishModel,
  PublishData,
  CategoryModel,
  /* MunicipalProfileModel, */
} from "@/lib/interfaces/publish";
import {PublishCategories} from '@/lib/constants/constants';
import { PublishResponse, mapperPublish } from "@/lib/services/index";
import { httpClient } from "./httpClient";
import { getAuthorsList } from "@/lib/utils/transformDataToInterface";

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

  /* async getMunicipalProfiles(title?:string, category?:string): Promise<PublishData> {
    try{
      const categoryQuery = category
        ? `&filters[category][$contains]=${category}`
        : "";
      const titleQuery = title ? `&filters[title][$containsi]=${title}` : "";
      const path = `/publicacoes?populate[0]=coverImage${categoryQuery}${titleQuery}`;
      const response: any = await httpClient.get(path);

      const { data } = response;


      let publishes: MunicipalProfileModel[] = [];
      data.forEach((publish:any) => {
        publishes.push({
          id: publish.id,
          authors: getAuthorsList(publish.attributes.authors ? publish.attributes.authors.data : []),
          category: publish.attributes.category,
          documentUrl: publish.attributes.documentLink,
          imageUrl: publish.attributes.coverImage.data.attributes.url,
          longDescription: publish.attributes.longDescription,
          shortDescription: publish.attributes.shortDescription,
          tags: publish.attributes.tags,
          title: publish.attributes.title,
          createdAt: publish.attributes.createdAt,
        });
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
      return {items:[], totalItems:0}
    }
  }

  async getPaginatedMunicipalProfiles(
    page: number,
    limit: number,
    category?: string,
    order?:  "asc" | "desc",
  ): Promise<PublishData> {
    try {
      const categoryQuery = category
        ? `&filters[category][$contains]=${category}`
        : "";
      const orderQuery = order ? `&sort=id:desc` : ""; // Adicionando ordenação decrescente por ID se o parâmetro 'order' estiver presente
      const path = `/publicacoes?populate[0]=coverImage&pagination[page]=${page}&pagination[pageSize]=${limit}${categoryQuery}${orderQuery}`;
      const response: any = await httpClient.get(path);

      const { data } = response;
      let publishes: MunicipalProfileModel[] = [];
      data.forEach((publish: any) => {
        publishes.push({
          id: publish.id,
          authors: getAuthorsList(publish.attributes.authors ? publish.attributes.authors.data : []),
          category: publish.attributes.category,
          documentUrl: publish.attributes.documentLink,
          imageUrl: publish.attributes.coverImage.data.attributes.url,
          longDescription: publish.attributes.longDescription,
          shortDescription: publish.attributes.shortDescription,
          tags: publish.attributes.tags,
          title: publish.attributes.title,
          createdAt: publish.attributes.createdAt,
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

  async getGuides(title?: string ): Promise<PublishData> {
      const titleQuery = title ? `&filters[title][$containsi]=${title}` : ``;

      try{
        const path = `/guias?populate[0]=coverImage${titleQuery}`;

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
        return {items:[], totalItems:0}
      }
  }

  async getMunicipalProfilePublishById(
    id: string
  ): Promise<MunicipalProfileModel> {
    try {
      const path = `/publicacoes/${id}?populate[0]=coverImage&populate[1]=authors`;
      const response: any = await httpClient.get<PublishModel>(path);

      const { data } = response;
      const publish: MunicipalProfileModel = {
        authors: getAuthorsList(data.attributes.authors.data),
        category: data.attributes.category,
        documentUrl: data.attributes.documentLink,
        id: data.id,
        imageUrl: data.attributes.coverImage.data.attributes.url,
        longDescription: data.attributes.longDescription,
        shortDescription: data.attributes.shortDescription,
        tags: data.attributes.tags,
        title: data.attributes.title,
      };

      
      return publish;
    } catch (error) {
      console.error(error);
      throw new Error(`Error while fetching publish with id: ${id}: ${error}`);
    }
  }

  async getPaginatedGuides(page: number, limit: number, order?:  "asc" | "desc",): Promise<PublishData> {
    try {
      const orderQuery = order ? `&sort=id:desc` : ""; // Adicionando ordenação decrescente por ID se o parâmetro 'order' estiver presente
      const path = `/guias?populate[0]=coverImage&pagination[page]=${page}&pagination[pageSize]=${limit}${orderQuery}`;
      const response: any = await httpClient.get(path);

      const { data } = response;
      let publishes: PublishModel[] = [];
      data.forEach((publish: any) => {
        publishes.push(mapperPublish(publish));
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

  async getGuidePublishById(id: string): Promise<PublishModel> {
    try {
      const path = `/guias/${id}?populate[0]=coverImage&populate[1]=authors`;
      const response: any = await httpClient.get(path);

      const { data } = response;
      const publish: PublishModel = mapperPublish(data);
      return publish;
    } catch (error) {
      console.error(error);
      throw new Error(`Error while fetching publish with id: ${id}: ${error}`);
    }
  }

  async getStudys(title?: string): Promise<PublishData> {
    try{
      const titleQuery = title ? `&filters[title][$containsi]=${title}` : ``;
      const path = `/estudos?populate[0]=coverImage${titleQuery}`;

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
      return {items:[], totalItems:0}
    }
  }

  async getPaginatedStudys(page: number, limit: number, order?:  "asc" | "desc",): Promise<PublishData> {
    try {
      const orderQuery = order ? `&sort=id:desc` : ""; // Adicionando ordenação decrescente por ID se o parâmetro 'order' estiver presente
      const path = `/estudos?populate[0]=coverImage&pagination[page]=${page}&pagination[pageSize]=${limit}${orderQuery}`;
      const response: any = await httpClient.get(path);

      const { data } = response;
      let publishes: PublishModel[] = [];
      data.forEach((publish: any) => {
        publishes.push(mapperPublish(publish));
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

  async getStudyPublishById(id: string): Promise<PublishModel> {
    try {
      const path = `/estudos/${id}?populate[0]=coverImage&populate[1]=authors`;
      const response: any = await httpClient.get(path);

      const { data } = response;
      const publish: PublishModel = mapperPublish(data);
      return publish;
    } catch (error) {
      console.error(error);
      throw new Error(`Error while fetching publish with id: ${id}: ${error}`);
    }
  } */
}
