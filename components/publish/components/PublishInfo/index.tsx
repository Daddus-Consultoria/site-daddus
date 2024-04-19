import React from "react";
import { DaddusLink } from "@/components/daddusLink";
import { AuthorModel } from "@/lib/interfaces/author";

interface PublishInfoProps {
  category: string;
  authors: AuthorModel[];
  tags: string[];
  createdAt: string;
  documentUrl: string;
}

interface TitleDescriptionProps {
  title: string;
  value: string;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({
  title,
  value,
}) => {
  return (
    <div className="w-[50%] lg:w-auto">
      <h3 className="text-label text-base leading-24">{title}</h3>
      <p className="text-sm text-secondary font-semibold leading-21">{value}</p>
    </div>
  );
};

const PublishInfo: React.FC<PublishInfoProps> = ({
  category,
  authors,
  createdAt,
  tags,
  documentUrl,
}) => {
  return (
    <div>
      <h2 className="text-primary font-extrabold mb-2">
        INFORMAÇÕES DA PUBLICAÇÃO
      </h2>
      <div className="flex flex-row  lg:flex-col flex-wrap gap-4">
        <TitleDescription title="Categoria" value={category} />
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

        <TitleDescription  title="Publicação" value={createdAt} />

        <div>
          <h3 className="text-label text-base leading-24">Etiquetas</h3>
          <ul className="w-full flex gap-2 items-center">
            {tags.map((tag, index) => (
              <li key={`tags-item-${index}`}>
                <DaddusLink variant={"tag"} size={"link"} href={documentUrl}>
                  {tag}
                </DaddusLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <DaddusLink
        isTagAnchor
        target="_blank"
        href={documentUrl}
        size={"lg"}
        className="mt-6 w-full lg:max-w-[220px]"
      >
        Baixar documento
      </DaddusLink>
    </div>
  );
};

export { PublishInfo };
