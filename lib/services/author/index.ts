import { AuthorModel } from "@/lib/interfaces/author";

export interface AuthorResponse{
    data:{
        id: number;
        attributes: {
            createdAt: string;
            email:string;
            name:string;
            profession:string;
            publishedAt:string;
            summary:string;
            updatedAt:string;
        }
    }
}

export function mapperAuthor(author:AuthorResponse):AuthorModel{
    return {
        id:author.data.id,
        name:author.data.attributes.name,
        role:author.data.attributes.profession,
        email:author.data.attributes.email,
        image:{
            src:"",
            alt:""
        },
        description:author.data.attributes.summary
    }
}