import { SubCategoryModel, CategoryModel, PublishModel} from "@/lib/interfaces/publish";
import { mapperAuthorPublish } from "@/lib/services/author";
import { PublishCategories, PublishSubCategories } from "@/lib/constants/constants";

const FALLBACK_COVER_IMAGE = "/images/publications/publication1.svg";

export interface PublishResponse {
    id: number,
    attributes: {
        title: string,
        shortDescription: string,
        longDescription: string,
        coverImage?:{
            data?:{
                attributes?:{
                    url: string,
                    alt: string
                }
            }
        },
        subCategory: PublishSubCategories,
        authors?: {
            data?: any[],
        },
        publishDate: Date,
        tags?: string[],
        documentLink: string,
        slug: string,
        category: PublishCategories,
    }
}

export function mapperPublish(data:PublishResponse): PublishModel {
    return {
        id: data.id,
        // O Strapi devolve o autor como { id, attributes }; sem achatar aqui,
        // a lista de autores da publicacao aparece vazia na tela.
        authors: (data.attributes.authors?.data ?? []).map(mapperAuthorPublish),
        category: data.attributes.category,
        documentLink: data.attributes.documentLink,
        // Uma publicacao sem capa no CMS nao pode derrubar a listagem inteira:
        // o card cai numa imagem neutra em vez de quebrar o acervo.
        imageUrl: data.attributes.coverImage?.data?.attributes?.url ?? FALLBACK_COVER_IMAGE,
        longDescription: data.attributes.longDescription,
        publishDate: data.attributes.publishDate,
        shortDescription: data.attributes.shortDescription,
        slug: data.attributes.slug,
        subCategory: data.attributes.subCategory,
        tags: data.attributes.tags ?? [],
        title: data.attributes.title,
    }
}