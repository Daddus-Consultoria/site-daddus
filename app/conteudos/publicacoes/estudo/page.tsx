"use client";
import {
  InputGeneric,
  CardPublication,
  CircularProgressIndicator,
  ContentNotFoundWarning,
} from "@/components/index";
import { Label } from "@/components/ui/index";
import { PaginationGeneric } from "@/components/index";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";
import { QueryKeys } from "@/lib/constants/queryKeys";
import { PublishCategories } from "@/lib/constants/constants";

const Study = () => {
  const usePublishUseCases = new PublishUseCases();

  const [currentPage, setCurrentPage] = useState(1);

  const getStudy = async (currentPage: number) => {
    return await usePublishUseCases.getPaginatedStudies({
      limit: itemsPerPage,
      page: currentPage,
      
    });
  }

  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKeys.studies, currentPage],  
    queryFn: async () => {
      return await getStudy(currentPage);
    },
  });
  
  
  const itemsPerPage = 6;
  const currentPageItems = data?.items;
  const totalItems = data?.totalItems;

  return (
    <div className="flex flex-1 flex-col justify-start items-center mt-6 lg:mt-0 px-[2%] lg:px-[5%] xl:px-[5%] lg:py-10">
      <div className="flex w-full flex-row justify-end items-center gap-10 lg:px-5">
        <div className="flex flex-1 lg:flex-none h-full flex-col justify-end">
          <InputGeneric type="white" placeholder="Pesquisar" />
        </div>
      </div>
      {isLoading ? (
        <CircularProgressIndicator containerHeight="400px" />
      ) : (currentPageItems ?? []).length > 0 ? (
        <div className="grid lg:grid-cols-1 xl:grid-cols-2 w-full my-[10%] lg:mt-[70px] md:h-full lg:px-5 ">
          {currentPageItems?.map((item, index) => {
            return (
              <CardPublication
                id={item.id}
                key={`card-publication-${index}`}
                image={item.imageUrl}
                description={item.shortDescription}
                title={item.title}
                path={`/conteudos/publicacoes/estudo/${item.slug}`}
              />   
            );
          })}
        </div>
      ) : (
        <div className="h-[400px]">
          <ContentNotFoundWarning message="Nenhum item encontrado" />
        </div>
      )}
      <div className="flex flex-row w-full ">
        <PaginationGeneric
          totalItems={totalItems || 0}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Study;
