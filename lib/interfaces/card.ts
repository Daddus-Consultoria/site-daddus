export interface CardInfoProps {
    title: string;
    description: string;
    image: string;
    path: string;
    titleAlign?: "center" | "left" | "right";
}


export interface CardBlogProps {
    title: string;
    first: boolean;
    image: string;
    badgeTitle: string;
}
