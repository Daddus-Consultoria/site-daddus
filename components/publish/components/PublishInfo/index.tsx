import React from "react";
import { DaddusLink } from "@/components/daddusLink";
import { AuthorModel } from "@/lib/interfaces/author";
import { PublishCategories, publishCategoryLabels } from "@/lib/constants/constants";
import { formatPublishDate } from "@/lib/utils";

interface PublishInfoProps {
  category: PublishCategories;
  authors: AuthorModel[];
  tags: string[];
  publishDate?: Date | string | null;
  subCategory?: string | null;
  documentUrl?: string;
}

interface TitleDescriptionProps {
  title: string;
  value: PublishCategories | string;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({
  title,
  value,
}) => {
  return (
    <div className="w-[50%] lg:w-auto">
      <h3 className="text-label text-base leading-24">{title}</h3>
      <p className="text-sm text-secondary font-semibold leading-21">{value.toString()}</p>
    </div>
  );
};

const PublishInfo: React.FC<PublishInfoProps> = ({
  category,
  authors,
  publishDate,
  subCategory,
  tags,
  documentUrl,
}) => {
  const formattedDate = formatPublishDate(publishDate);

  return (
    <div>
      <h2 className="text-primary font-extrabold mb-2">
        INFORMAÇÕES DA PUBLICAÇÃO
      </h2>
      <div className="flex flex-row  lg:flex-col flex-wrap gap-4">
        <TitleDescription
          title="Categoria"
          value={publishCategoryLabels[category] ?? category}
        />

        {subCategory && (
          <TitleDescription title="Tipo de perfil" value={subCategory} />
        )}

        {authors.length > 0 && (
          <div>
            <h3 className="text-label text-base leading-24">Autores</h3>
            <ul>
              {authors.map((author, index) => (
                <li
                  className="text-sm text-secondary font-semibold leading-21"
                  key={`authors-item-${index}`}
                >
                  {author.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* A data vem do CMS. Antes a tela mostrava a data de hoje, o que fazia
            toda publicacao parecer recem-publicada. */}
        {formattedDate && (
          <TitleDescription title="Publicação" value={formattedDate} />
        )}

        {tags.length > 0 && (
          <div>
            <h3 className="text-label text-base leading-24">Etiquetas</h3>
            <ul className="w-full flex gap-2 items-center flex-wrap">
              {tags.map((tag, index) => (
                <li key={`tags-item-${index}`}>
                  <p className="text-sm text-primary underline">{tag}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* O botao so aparece quando ha documento: um "Baixar" que nao baixa nada
          e uma funcionalidade prometida e nao entregue. */}
      {documentUrl && (
        <DaddusLink
          isTagAnchor
          target="_blank"
          href={documentUrl}
          size={"lg"}
          className="mt-6 w-full lg:max-w-[220px]"
        >
          Baixar publicação
        </DaddusLink>
      )}
    </div>
  );
};

export { PublishInfo };
