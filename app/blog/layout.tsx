'use client'
import Image from "next/image";
import { constantCardBlog } from "./_constants";
import { DaddusLink } from "@/components/index";

function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col w-full h-full">
            <div className="h-[5rem] w-full bg-[#F5F7F9]">
                <div className="flex flex-row justify-center items-center h-full gap-[1rem]">
                    <div className="h-[55px] min-w-[150px] relative">
                        <Image 
                            src={constantCardBlog.logoBlog}
                            layout="fill"
                            objectFit="contain" // Mantém as proporções e faz a imagem se ajustar dentro do contêiner
                            objectPosition="center"
                            alt="Logo do blog"
                        />
                    </div>
                    {constantCardBlog.barItens.map((item, index) => (
                        <DaddusLink key={`item-menu-bar-blog-${index}`} href={item.link} variant={"ghost"} isTagAnchor>
                            <p>{item.title}</p>
                        </DaddusLink>
                    ))} 
                </div>
            </div>
            {children}
        </div>
  );
}

export default BlogLayout;
