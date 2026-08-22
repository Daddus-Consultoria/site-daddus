"use client";

import Image from "next/image";

import { SearchLink, DaddusLink } from "@/components/index";
import { Links, PublishCategories, publishCategoryLabels } from "@/lib/constants/constants";
import { AuthorModel } from "@/lib/interfaces/author";
import { formatPublishDate } from "@/lib/utils";

interface CardPublicationProps {
  title: string;
  description: string;
  image: string;
  path: string;
  id: number;
  category?: PublishCategories;
  publishDate?: Date | string | null;
  authors?: AuthorModel[];
}

const getButtonLabel = (path: string): string => {
  if (path.includes('/perfis-municipais/')) {
    return 'PERFIL';
  } else if (path.includes('/guias/')) {
    return 'GUIA';
  } else if (path.includes('/estudos/')) {
    return 'ESTUDO';
  } else {
    return 'CONTEÚDO';
  }
};

const getAuthorNames = (authors?: AuthorModel[]): string =>
  (authors ?? [])
    .map((author) => author?.name)
    .filter(Boolean)
    .join(", ");

const CardPublication: React.FC<CardPublicationProps> = ({
  title,
  description,
  image,
  path,
  id,
  category,
  publishDate,
  authors,
}) => {
  const copyPath = `${Links.SITE_DOMAIN}${path}`;

  // Um item de acervo precisa dizer o que e e de quando e — sem isso o card
  // vira so um titulo solto. Cada dado so aparece quando o CMS o tem.
  const typeLabel = category ? publishCategoryLabels[category] : "";
  const dateLabel = formatPublishDate(publishDate);
  const authorNames = getAuthorNames(authors);
  const metadata = [typeLabel, dateLabel].filter(Boolean);

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
            {metadata.length > 0 && (
              <p className="text-[10px] uppercase tracking-wide text-[#555555]">
                {metadata.join(" · ")}
              </p>
            )}
            <h2 className="font-bold text-[#A90920] text-[13px] lg:text-[16px] text-justify ">
              {title}
            </h2>
            <p className="text-[11px] text-justify">{description}</p>
            {authorNames && (
              <p className="text-[10px] text-[#555555]">{authorNames}</p>
            )}
            <div className="flex flex-row justify-end items-center gap-[2%] mb-[3%] h-[14%] lg:h-[18%]k">
              <DaddusLink href={path} className="rounded-2xl">
                <p className="text-[10px] sm:text-sm text-wrap">
                  ACESSAR {getButtonLabel(path)}
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
