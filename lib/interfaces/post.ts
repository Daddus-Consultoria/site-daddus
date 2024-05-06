
export interface PostModel{
    title: string;
    category: string;
    path: string;
}

export interface PostData {
    posts: PostModel[];
}
