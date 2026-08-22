import PublishRepository from "@/lib/repositories/PublishRepository";
import {
  PublishModel,
  PublishData,
  PublishFilters,
  PublishIndexEntry,
  PublishQuery,
} from "@/lib/interfaces/publish";
import {PublishCategories} from '@/lib/constants/constants';
import { mapperPublish } from "@/lib/services/index";
import { httpClient } from "./httpClient";

const EMPTY_PUBLISH_DATA: PublishData = { items: [], totalItems: 0 };

/** Quantas paginas o indice de filtros percorre, para nao varrer o acervo inteiro sem limite. */
const INDEX_PAGE_SIZE = 100;
const INDEX_MAX_PAGES = 10;

/**
 * Monta os filtros no formato do Strapi. So entra na query o filtro que o
 * usuario realmente escolheu.
 */
const buildFilterQuery = (filters: PublishFilters): string => {
  const params: string[] = [];
  const add = (key: string, value: string | number) =>
    params.push(`${key}=${encodeURIComponent(String(value))}`);

  if (filters.category) add(`filters[category][$eq]`, filters.category);
  if (filters.subCategory) add(`filters[subCategory][$eq]`, filters.subCategory);
  if (filters.tag) add(`filters[tags][$containsi]`, filters.tag);
  if (filters.year) {
    add(`filters[publishDate][$gte]`, `${filters.year}-01-01`);
    add(`filters[publishDate][$lte]`, `${filters.year}-12-31`);
  }

  // A busca cobre titulo e resumo: e o que o card mostra, entao o usuario
  // consegue enxergar por que cada resultado apareceu.
  const search = filters.search?.trim();
  if (search) {
    add(`filters[$or][0][title][$containsi]`, search);
    add(`filters[$or][1][shortDescription][$containsi]`, search);
  }

  return params.length ? `&${params.join("&")}` : ``;
};

const toPublishData = (response: any): PublishData => {
  const items: PublishModel[] = (response?.data ?? []).map((publish: any) =>
    mapperPublish(publish)
  );

  return {
    items,
    totalItems: response?.meta?.pagination?.total ?? items.length,
  };
};

export class PublishAPIService implements PublishRepository {
  async getPublish(title?: string, category?: PublishCategories): Promise<PublishData> {
    try{
      const path = `/publicacoes?populate[0]=coverImage&populate[1]=authors${buildFilterQuery(
        { search: title, category }
      )}`;

      return toPublishData(await httpClient.get(path));
    }catch(error){
      console.log(error);
      return EMPTY_PUBLISH_DATA;
    }
  }

  async getPublishById(slug:string, category:PublishCategories): Promise<PublishModel | null> {
    try{
      const categoryQuery = category ? `&filters[category][$eq]=${category}` : ``;
      const slugQuery = slug ? `&filters[slug][$eq]=${encodeURIComponent(slug)}` : ``;
      const path = `/publicacoes?populate[0]=coverImage&populate[1]=authors${categoryQuery}${slugQuery}`;
      const response:any = await httpClient.get(path);

      const { data } = response;

      if (!data?.length) return null;

      return mapperPublish(data[0]);
    }catch(error){
      console.log(error);
      throw new Error(`Error while fetching publish with id: ${slug}: ${error}`);
    }
  }

  async searchPublish(query: PublishQuery): Promise<PublishData> {
    try{
      const { page, limit, order = "desc", ...filters } = query;

      // Ordena pela data da publicacao — o acervo abre pelo material mais
      // recente. O id desempata quando duas publicacoes sao do mesmo dia.
      const path =
        `/publicacoes?populate[0]=coverImage&populate[1]=authors` +
        `&pagination[page]=${page}&pagination[pageSize]=${limit}` +
        `&sort[0]=publishDate:${order}&sort[1]=id:${order}` +
        buildFilterQuery(filters);

      return toPublishData(await httpClient.get(path));
    }catch(error){
      console.log(error);
      return EMPTY_PUBLISH_DATA;
    }
  }

  async getPaginatedPublish(
    page: number,
    limit: number,
    category?: string,
    order?:  "asc" | "desc",
  ): Promise<PublishData> {
    return this.searchPublish({
      page,
      limit,
      order,
      category: category as PublishCategories | undefined,
    });
  }

  async getPublishIndex(category?: PublishCategories): Promise<PublishIndexEntry[]> {
    const entries: PublishIndexEntry[] = [];

    try{
      let page = 1;
      let pageCount = 1;

      while (page <= pageCount && page <= INDEX_MAX_PAGES) {
        const path =
          `/publicacoes?fields[0]=category&fields[1]=subCategory` +
          `&fields[2]=publishDate&fields[3]=tags` +
          `&pagination[page]=${page}&pagination[pageSize]=${INDEX_PAGE_SIZE}` +
          buildFilterQuery({ category });

        const response: any = await httpClient.get(path);

        (response?.data ?? []).forEach((item: any) => {
          entries.push({
            category: item.attributes?.category,
            subCategory: item.attributes?.subCategory ?? null,
            publishDate: item.attributes?.publishDate ?? null,
            tags: item.attributes?.tags ?? [],
          });
        });

        pageCount = response?.meta?.pagination?.pageCount ?? 1;
        page += 1;
      }

      return entries;
    }catch(error){
      console.log(error);
      return entries;
    }
  }
}
