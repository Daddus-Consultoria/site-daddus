import Image from "next/image";

import { BadgeBlog } from "@/components/index";
import { DaddusLink } from "@/components/index";
import { CardBlogProps } from "@/lib/interfaces/card";
import { CategoryMap, PostCategory } from "@/lib/interfaces/post";

const BlogPostCard: React.FC<CardBlogProps> = ({
  title,
  first = false,
  image,
  badgeTitle,
  href = "#",
}) => {
  const sizeText = first ? "text-3xl" : "text-xl";

  const path = `/blog/${href}`;

  return (
    <DaddusLink
      href={href}
      className="relative bg-cover bg-center h-full w-full rounded-lg overflow-hidden shadow-md"
      variant={"ghost"}
      isTagAnchor
    >
      <Image
        src={image.src}
        alt={image.alt}
        layout="fill"
        objectFit="cover" // Mantém as proporções e faz a imagem se ajustar dentro do contêiner
        objectPosition="center"
        className="z-0"
      />

      <div className=" absolute inset-0 bg-gradient-to-b from-transparent to-[#7C0213]"></div>

      <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-10 text-white">
        <div className="flex">
          <BadgeBlog
            title={CategoryMap[badgeTitle as PostCategory]}
            first={first}
          />
        </div>
        <h2
          className={`text-sm md:text-xl lg:${sizeText} font-bold whitespace-normal`}
        >
          {title}
        </h2>
      </div>
    </DaddusLink>
  );
};

export { BlogPostCard };

/* 
<DaddusLink href="#" className="relative bg-cover bg-center h-full w-full rounded-lg overflow-hidden shadow-md" variant={"ghost"} isTagAnchor>
            <Image
                src={image.src}
                alt={image.alt}
                layout="fill"
                objectFit="cover" // Mantém as proporções e faz a imagem se ajustar dentro do contêiner
                objectPosition="center"
                className="z-0"
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#7C0213]">
            </div>
            
            <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-10 text-white">
                <div className="flex">
                    <BadgeBlog title={badgeTitle} first={first}/>
                </div>
                <h2 className={`text-sm md:text-xl lg:${sizeText} font-bold bg-black`}>{title}</h2>
            </div>
        </DaddusLink> 
*/

{
  /* <div className="relative bg-cover bg-center h-full w-full rounded-lg overflow-hidden shadow-md" >
    <Image
        src={image.src}
        alt={image.alt}
        layout="fill"
        objectFit="cover" // Mantém as proporções e faz a imagem se ajustar dentro do contêiner
        objectPosition="center"
        className="z-0"
    />
    
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#7C0213]">
    </div>
    
    <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-10 text-white">
        <div className="flex">
            <BadgeBlog title={badgeTitle} first={first}/>
        </div>
        <h2 className={`text-sm md:text-xl lg:${sizeText} font-bold bg-black`}>{title}</h2>
    </div>
</div> */
}
