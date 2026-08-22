import { CategoryModel, PublishModel } from "@/lib/interfaces/publish";
import React from "react";
import Image from "next/image";
import {
  AvatarNetwork,
  ButtonContact,
  PublishInfo,
  RelatedPublications,
} from "@/components/index";
import { RelatedPublicationModel } from "@/lib/interfaces/relatedPublications";
import { PublishCategories } from "@/lib/constants/constants";

interface PublishItemProps {
  publishData: PublishModel;
  category: PublishCategories;
}

const Publish: React.FC<PublishItemProps> = ({
  publishData: {
    title,
    longDescription,
    authors,
    tags,
    imageUrl,
    documentLink,
    publishDate,
    subCategory,
  },
  category,
}) => {
  let relatedPublicationsList: RelatedPublicationModel[] = [];
  return (
    <div className="w-full px-5percent my-10 min-h-10">
      <div className="md:max-w-[80%] lg:max-w-[90%] mx-auto flex flex-col lg:flex-row align-items-center gap-4 min-h-10">
        <div className="h-auto w-full lg:w-3/4">
          <h1 className="text-3xl font-extrabold leading-10 text-primary max-md:max-w-full mb-3">
            {title}
          </h1>
          <p className="text-secondary text-xs mb-6">{longDescription}</p>
          <Image height={571} width={404} src={imageUrl} alt="" />
        </div>
        <div className="border-r border-label w-1 h-auto flex-none md:flex" />
        <div className="flex w-full lg:w-1/4 flex-col h-full gap-10">
          {/* <img src={imageUrl} alt={title} /> */}
          <PublishInfo
            documentUrl={documentLink}
            category={category}
            authors={authors}
            publishDate={publishDate}
            subCategory={subCategory}
            tags={tags}
          />

          <div className="flex flex-col gap-10">
            <AvatarNetwork className="justify-center lg:justify-start" />

            <ButtonContact />
            {relatedPublicationsList.length > 0 && (
              <RelatedPublications
                publicationsRelated={relatedPublicationsList}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Publish };
