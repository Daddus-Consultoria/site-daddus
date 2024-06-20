"use client";
import {
  InputGeneric,
  CardPublication,
  SelectGeneric,
  CircularProgressIndicator,
  ContentNotFoundWarning,
} from "@/components/index";
import { PaginationGeneric } from "@/components/index";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";
import { QueryKeys } from "@/lib/constants/queryKeys";

const Municipal_Profiles = () => {
  const items = [
    "Perfil Social dos Municípios",
    "Perfil Eleitoral dos Municípios",
    "Perfil Econômico dos Municípios",
  ];

  const [currentPage, setCurrentPage] = useState(1);

  const getMunicipalProfiles = async (currentPage: number)  => {
    return await usePublishUseCases.getPaginatedMunicipalProfiles({
      limit: itemsPerPage,
      page: currentPage,
    });
  }


  const usePublishUseCases = new PublishUseCases();
  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: [QueryKeys.municipalProfiles, currentPage],
    queryFn: async() => {
      return await getMunicipalProfiles(currentPage)
    },
    placeholderData: keepPreviousData,
  });

  
  const itemsPerPage = 10;
  const totalItems = data?.totalItems;

  const currentPageItems = data?.items;

  return (
    <div className="flex flex-1 flex-col justify-start items-center mt-6 lg:mt-0 px-[2%] lg:px-[5%] xl:px-[5%] lg:py-10">
      <div className="flex w-full flex-row justify-between items-center gap-10 lg:px-5">
        <div className="flex flex-1 flex-col gap-2 ">
          <p className="font-medium text-[13px] lg:text-[13px] text-black">
            Tópicos
          </p>
          <div className="w-[100%] lg:w-[30%]">
            <SelectGeneric placeholder="Selecionar" items={items} />
          </div>
        </div>
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
                path={`/conteudos/publicacoes/perfil-municipal/${item.slug}`}
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

export default Municipal_Profiles;
