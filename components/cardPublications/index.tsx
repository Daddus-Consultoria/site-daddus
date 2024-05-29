"use client";

import Image from "next/image";

import { SearchLink, DaddusLink } from "@/components/index";
import { Links } from "@/lib/constants/constants";

interface CardPublicationProps {
  title: string;
  description: string;
  image: string;
  path: string;
  id: number;
}

const CardPublication: React.FC<CardPublicationProps> = ({
  title,
  description,
  image,
  path,
  id,
}) => {
  const copyPath = `${Links.SITE_DOMAIN}${path}`;
  return (
    <div className="flex items-start justify-start mb-[4%] min-h-[250px] rounded-2xl bg-[#EEEEEE] px-[5%] py-[4%] text-black relative">
      <div className="flex h-full w-full items-start justify-between">
        <div className="hidden md:flex w-full max-w-[230px] none ">
          <Image
            alt="Capa da publicação"
            layout="fill"
            objectFit="cover" // Mantém as proporções e faz a imagem se ajustar dentro do contêiner
            src={image}
            className="xl:ml-[3%]  3-xl:ml-[1%] w-full md:max-w-[180px] !top-[-10%] !left-[30px]"
          />
        </div>

        <div className="flex flex-col h-[100%] gap-3 justify-between w-full">
          <div className="flex flex-col gap-3 w-full">
            <h2 className="font-bold text-[#A90920] text-[13px] lg:text-[16px] text-justify ">
              {title}
            </h2>
            <p className="text-[11px] text-justify">{description}</p>
            <div className="flex flex-row justify-end items-center gap-[2%] mb-[3%] h-[14%] lg:h-[18%]k">
              <DaddusLink href={path} className="rounded-2xl">
                <p className="text-[10px] sm:text-sm text-wrap">
                  VEJA MAIS SOBRE {title.toUpperCase()}
                </p>
              </DaddusLink>
              <SearchLink path={copyPath} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export { CardPublication };
