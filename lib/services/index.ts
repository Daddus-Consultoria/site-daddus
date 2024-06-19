import { SubCategoryModel, CategoryModel, PublishModel} from "@/lib/interfaces/publish";
import { AuthorModel } from "@/lib/interfaces/author";
import { PublishCategories, PublishSubCategories } from "@/lib/constants/constants";

export interface PublishResponse {
    attributes: {
        id: number,
        title: string,
        shortDescription: string,
        longDescription: string,
        coverImage:{
            data:{
                attributes:{
                    url: string,
                    alt: string
                }
            }
        },
        subCategory: PublishSubCategories,
        authors: AuthorModel[],
        publishDate: Date,
        tags: string[],
        documentLink: string,
        slug: string,
        category: PublishCategories,
    }
}

export function mapperPublish(data:PublishResponse): PublishModel {
    return {
        authors: data.attributes.authors,
        category: data.attributes.category,
        documentLink: data.attributes.documentLink,
        id: data.attributes.id,
        imageUrl: data.attributes.coverImage.data.attributes.url,
        longDescription: data.attributes.longDescription,
        publishDate: data.attributes.publishDate,
        shortDescription: data.attributes.shortDescription,
        slug: data.attributes.slug,
        subCategory: data.attributes.subCategory,
        tags: data.attributes.tags,
        title: data.attributes.title,
    }
}