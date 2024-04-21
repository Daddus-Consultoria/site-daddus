"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/index";
import Image from "next/image";
import { CardInfoProps } from "@/lib/interfaces/card";
import { DaddusLink, SearchLink } from "@/components/index";

const CardInfo: React.FC<CardInfoProps> = ({
  title,
  description,
  image,
  path,
  titleAlign = "center",
}) => {
  return (
    <Card className="flex flex-1 flex-col h-full rounded-3xl bg-[#EEEEEE] lg:m-0 overflow-hidden">
      <CardHeader className="w-full h-64  lg:h-64 xl:h-80 2xl:h-80  relative ">
        <Image
          src={image}
          alt="Capa ilustrativa"
          layout="fill"
          objectFit="cover" // Mantém as proporções e faz a imagem se ajustar dentro do contêiner
          objectPosition="center"
        />
      </CardHeader>
      <CardContent className="flex flex-col flex-1 items-center mt-6P">
        <div className="flex flex-col items-center gap-2">
          <h2
            className={`font-bold text-[24px] text-[#A90920] mt-4 w-full text-${titleAlign}`}
          >
            {title}
          </h2>
          <p className="text-[11px] text-[#0B0C10] text-justify">
            {description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-end mb-3 gap-2">
        <DaddusLink href={path} className="h-9 rounded-2xl">
          VEJA MAIS
        </DaddusLink>
        <SearchLink path={path} />
      </CardFooter>
    </Card>
  );
};

export { CardInfo };
