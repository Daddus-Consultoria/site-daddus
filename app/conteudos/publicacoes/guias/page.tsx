"use client";
import { InputGeneric, CardPublication } from "@/components/index";
import { PaginationGeneric } from "@/components/index";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QueryKeys } from "@/lib/constants/queryKeys";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";
import { useQuery } from "@tanstack/react-query";
import { PublishCategories } from "@/lib/constants/constants";

const Guides = () => {
  const usePublishUseCases = new PublishUseCases();
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKeys.guides],
    queryFn: async () => {
      return await usePublishUseCases.getPaginatedPublishes({
        limit: itemsPerPage,
        page: currentPage,
        category: PublishCategories.GUIDES,
      });
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
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
      <div className="grid md:grid-cols-1 lg:grid-cols-2 h-full w-full my-[10%] lg:mt-[70px] gap-[4%] lg:px-5">
        {currentPageItems?.map((item, index) => {
          return (
            <CardPublication
              path={`/conteudos/publicacoes/guias/${item.id}`}
              id={item.id}
              key={`card-publication-${index}`}
              image="/images/report_card.svg"
              description={item.shortDescription}
              title={item.title}
            />
          );
        })}
      </div>
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
