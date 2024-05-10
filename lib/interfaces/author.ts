import { ImageProps } from "next/image";

export interface AuthorModel {
  id: number;
  name: string;
  role: string;
  email: string;
  image: ImageProps;
  description: string;
}
