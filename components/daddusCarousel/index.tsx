import { DaddusCarouselItem } from "@/lib/interfaces/daddusCarouselItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import React from "react";
import Image from "next/image";

interface DaddusCarouselProps {
  items: DaddusCarouselItem[];
  height?: string;
}

const DaddusCarousel: React.FC<DaddusCarouselProps> = ({ items }) => {
  return (
    <Carousel className="w-full items-center">
      <CarouselContent className="my-auto">
        {items.map((item, index) => (
          <CarouselItem className="" key={`carousel-item-${index}`}>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-[2rem] lg:gap-[5rem] h-full my-auto ">
              <div className=" w-[50%] h-[290px] relative">
                <Image
                  layout="fill"
                  objectFit="contain"
                  src={item.image.src}
                  alt={item.image.alt}
                />
              </div>
              <div className="flex flex-col w-[100%] mr-0 lg:w-[50%] lg:mr-[5rem]">
                <h2 className="text-3xl font-extrabold text-white leading-tight">
                  {item.title}
                </h2>
                <p className="text-lg text-white mt-4">{item.description}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant={"ghost"} size={"auto"} iconSize={50} />
      <CarouselNext variant={"ghost"} size={"auto"} iconSize={50} />
    </Carousel>
  );
};

export { DaddusCarousel };
