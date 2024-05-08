import Image from "next/image";

import { BadgeBlog } from "@/components/index";

import {CardBlogProps} from "@/lib/interfaces/card";

const BlogPostCard:React.FC<CardBlogProps> = ({title, first=false, image, badgeTitle}) => {
    const sizeText = first ? 'text-3xl' : 'text-xl';

    return (
        <div className="relative bg-cover bg-center h-full w-full rounded-lg overflow-hidden shadow-md">
            <Image
                    src={image}
                    alt="Capa ilustrativa"
                    layout="fill"
                    objectFit="cover" // Mantém as proporções e faz a imagem se ajustar dentro do contêiner
                    objectPosition="center"
                    className="z-0"
                />
            
            <div className="absolute inset-0 from-transparent to-[#7C0213]"></div>
            
            <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-10 text-white">
                <div className="flex">
                    <BadgeBlog title={badgeTitle} first={first}/>
                </div>
                <h2 className={`text-sm md:text-xl lg:${sizeText} font-bold`}>{title}</h2>
            </div>
        </div>
    )
}

export {BlogPostCard}