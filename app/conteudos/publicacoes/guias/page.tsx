"use client";
import {
  InputGeneric,
  CardPublication,
  CircularProgressIndicator,
  ContentNotFoundWarning,
} from "@/components/index";
import { PaginationGeneric } from "@/components/index";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QueryKeys } from "@/lib/constants/queryKeys";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";
import { useQuery } from "@tanstack/react-query";
import { PublishCategories } from "@/lib/constants/constants";

const Guides = () => {
  const usePublishUseCases = new PublishUseCases();

  const [currentPage, setCurrentPage] = useState(1);

  const getGuides = async (currentPage: number) => {
    return await usePublishUseCases.getPaginatedGuides({
      limit: itemsPerPage,
      page: currentPage,
    });
  }

  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKeys.guides, currentPage],
    queryFn: async () => {
      return await getGuides(currentPage);
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
        <div className="grid md:grid-cols-1 lg:grid-cols-2 w-full my-[10%] lg:mt-[70px] md:h-full lg:px-5 gap-[4%]">
          {currentPageItems?.map((item, index) => {
            return (
              <CardPublication
                id={item.id}
                key={`card-publication-${index}`}
                image={item.imageUrl}
                description={item.shortDescription}
                title={item.title}
                path={`/conteudos/publicacoes/guias/${item.id}`}
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

export default Guides;
