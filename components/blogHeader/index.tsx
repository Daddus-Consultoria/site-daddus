"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { DaddusLink, CircularProgressIndicator } from "@/components/index";
import { ImageLinks, Breakpoints } from "@/lib/constants/constants";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface BlogHeaderProps {
  categorys: { title: string; link: string }[];
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ categorys }) => {
  const [isCalculated, setIsCalculated] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsCalculated(true);
    if (window.innerWidth >= Breakpoints.LAPTOP) {
      setIsDesktop(true);
    }
  }, []);

  if (!isCalculated)
    return (
      <div className="h-[5rem] w-full bg-mediumGray px-10 flex items-center justify-center">
        <CircularProgressIndicator />
      </div>
    );

  return isDesktop ? (
    <div className="w-full bg-mediumGray px-10">
      <div className="flex flex-row justify-center items-center h-full gap-[1rem]">
        <div className="h-[40px] xl:h-[55px] min-w-[50px] xl:min-w-[70px] relative">
          <DaddusLink href="/blog" variant={"ghost"} isTagAnchor>
            <Image
              src={ImageLinks.BLOG_LOGO}
              layout="fill"
              objectFit="contain" // Mantém as proporções e faz a imagem se ajustar dentro do contêiner
              objectPosition="center"
              alt="Logo do blog"
            />
          </DaddusLink>
        </div>
        {categorys.map((item, index) => (
          <DaddusLink
            className="p-2 xl:p-4"
            key={`item-menu-bar-blog-${index}`}
            href={item.link}
            variant={"ghost"}
            isTagAnchor
          >
            <p className="text-[12px]">{item.title}</p>
          </DaddusLink>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-10 bg-mediumGray px-5 py-2 justify-between">
      <div className="h-[40px] min-w-[100px] mt-3 max-w-[100px] items-start md:h-[30px] md:min-w-[50px] relative">
        <DaddusLink href={"/blog"} variant={"ghost"} isTagAnchor>
          <Image
            src={ImageLinks.BLOG_LOGO}
            layout="fill"
            objectFit="contain" // Mantém as proporções e faz a imagem se ajustar dentro do contêiner
            objectPosition="center"
            alt="Logo do blog"
          />
        </DaddusLink>
      </div>
      <div className="w-[70%] md:w-[60%]">
        <Carousel className=" items-center w-full ">
          <CarouselContent className="my-auto">
            {categorys.map((item, index) => (
              <CarouselItem
                className="basis-auto"
                key={`carousel-item-${index}`}
              >
                <DaddusLink href={item.link} variant={"ghost"} isTagAnchor>
                  <p>{item.title}</p>
                </DaddusLink>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant={"ghost"} size={"auto"} iconSize={30} />
          <CarouselNext variant={"ghost"} size={"auto"} iconSize={30} />
        </Carousel>
      </div>
      <div className="hidden md:block h-[30px] min-w-[50px]" />
    </div>
  );
};

export { BlogHeader };
