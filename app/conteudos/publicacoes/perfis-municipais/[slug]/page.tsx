"use client";
import React, { use } from "react";
import { Publish } from "@/components/publish";
import { PublishModel } from "@/lib/interfaces/publish";
import { PublishCategories, TimeConstants } from "@/lib/constants/constants";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";

const mockPublish: PublishModel = {
  title: "Mock Title",
  shortDescription: "This is a short description of the mock publish.",
  longDescription:
    "This is a long description of the mock publish. It contains more detailed information about the publish.",
  category: PublishCategories.COUNTIES_ELECTORAL_PROFILE,
  authors: ["Mock Author 1", "Mock Author 2"],
  tags: ["mock", "test"],
  imageUrl: "/mock-image.jpg",
  documentUrl: "https://www.bity.com.br/assets/doc/Termo-PEP.pdf",
  id: 1,
};

const MunicipalProfile: React.FC = () => {
  const urlPath = usePathname();
  const publishId = urlPath.split("/").pop();
  const usePublishUseCases = new PublishUseCases();



  const { data, isLoading, error } = useQuery({
    queryKey: [`municipal-profile-${publishId}`],
    staleTime: TimeConstants.ONE_HOUR,

    queryFn: async () => {
      return await usePublishUseCases.getPublishById({ id: publishId ?? "" });
    },
  });


  return (
    <div>
      <Publish publishData={mockPublish} />
    </div>
  );
};

export default MunicipalProfile;
