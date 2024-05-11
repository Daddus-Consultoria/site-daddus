import { ImageProps } from "next/image";

export interface CardInfoProps {
    title: string;
    description: string;
    image: string;
    path: string;
    copyLink: string;
    titleAlign?: "center" | "left" | "right";
}


export interface CardBlogProps {
    title: string;
    first?: boolean;
    image: ImageProps;
    badgeTitle: string;
    href?: string;
}
