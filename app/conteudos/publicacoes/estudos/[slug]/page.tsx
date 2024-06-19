"use client";
import React from "react";
import {
  Publish,
  CircularProgressIndicator,
  ContentNotFoundWarning,
} from "@/components/index";
import { PublishCategories, TimeConstants } from "@/lib/constants/constants";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";

const StudiesPublish: React.FC = () => {
  const urlPath = usePathname();
  const publishId = urlPath.split("/").pop();
  const usePublishUseCases = new PublishUseCases();

  console.log(urlPath)

  const { data, isLoading } = useQuery({
    queryKey: [`study-${publishId}`],
    staleTime: TimeConstants.ONE_HOUR,

    queryFn: async () => {
      return await usePublishUseCases.getStudyById({ id: publishId ?? "", category: PublishCategories.STUDIES});
    },
  });

  if (isLoading)
    return (
      <div className="h-screen">
        <CircularProgressIndicator
          size={55}
          color="secondary"
          containerHeight="100%"
        />
      </div>
    );

  return data ? (
    <div>
      <Publish publishData={data} category={PublishCategories.STUDIES} />
    </div>
  ) : (
    <div className="h-screen">
      <ContentNotFoundWarning message="Publicação não encontrada" />
    </div>
  );
};

export default StudiesPublish;
