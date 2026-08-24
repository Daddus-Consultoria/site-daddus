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
  copyLink,
  titleAlign = "center",
  ctaLabel = "Ver página",
}) => {
  return (
    <Card className="flex flex-1 flex-col rounded-3xl bg-[#EEEEEE] lg:m-0 overflow-hidden">
      <CardHeader className="w-full h-64 lg:h-64 xl:h-80 2xl:h-80  relative ">
        {/* A capa acompanha o titulo logo abaixo e nao acrescenta informacao
            propria: descrita, o leitor de tela repetiria o card duas vezes. */}
        <Image
          src={image}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover object-center"
        />
      </CardHeader>
      <CardContent className="flex flex-col flex-1 items-center mt-6 ">
        <div className="flex flex-col items-center gap-2">
          <h2
            className={`font-bold text-[24px] text-[#A90920] w-full text-${titleAlign}`}
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
          {ctaLabel}
        </DaddusLink>
        <SearchLink path={copyLink} />
      </CardFooter>
    </Card>
  );
};

export { CardInfo };
