import { AuthorModel } from "@/lib/interfaces/author";

export interface AuthorResponse {
  data: {
    id: number;
    attributes: {
      createdAt: string;
      email: string;
      name: string;
      profession: string;
      publishedDate: string;
      summary: string;
      updatedAt: string;
    };
  };
}

export function mapperAuthor(author: AuthorResponse): AuthorModel {
  return {
    id: author.data.id,
    name: author.data.attributes.name,
    role: author.data.attributes.profession,
    email: author.data.attributes.email,
    image: {
      src: author.data.attributes.avatar.data.attributes.url,
      alt: `${author.data.attributes.name}-author`,
    },
    description: author.data.attributes.summary,
  };
}
