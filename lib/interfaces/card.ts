import { ImageProps } from "next/image";

export interface CardInfoProps {
    title: string;
    description: string;
    image: string;
    path: string;
    copyLink: string;
    titleAlign?: "center" | "left" | "right";
    /** Texto do botao. Deve nomear o destino: "Ver estudos", nao "Veja mais". */
    ctaLabel?: string;
}


export interface CardBlogProps {
    title: string;
    first?: boolean;
    image: ImageProps;
    badgeTitle: string;
    href?: string;
}
