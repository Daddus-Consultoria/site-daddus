import { PublishModel } from "@/lib/interfaces/publish";
import { PublishInfo } from "./components/PublishInfo";
import React from "react";
import Image from "next/image";

interface PublishItemProps {
  publishData: PublishModel;
}

const Publish: React.FC<PublishItemProps> = ({
  publishData: {
    title,
    shortDescription,
    longDescription,
    category,
    authors,
    tags,
    imageUrl,
    documentUrl,
  },
}) => {
  return (
    <div className="w-full px-5percent mt-10 min-h-10">
      <div className="md:max-w-[80%] lg:max-w-[90%] mx-auto flex flex-col md:flex-row align-items-center gap-4 min-h-10">
        <div className="h-auto  w-3/4">
          <h1 className="text-3xl font-extrabold leading-10 text-red-800 max-md:max-w-full">
            {title}
          </h1>
          <p className="text-secondary text-xs">{longDescription}</p>
          <Image height={571} width={404} src={imageUrl} alt="" />
        </div>
        <div className="border-r border-label w-1 h-auto flex-none md:flex" />
        <div className="flex w-1/4 flex-col h-full">
          {/* <img src={imageUrl} alt={title} /> */}
          <PublishInfo
            documentUrl={documentUrl}
            category={category}
            authors={authors}
            createdAt={new Date().toLocaleDateString()}
            tags={tags}
          />
        </div>
      </div>
    </div>
  );
};

export { Publish };
