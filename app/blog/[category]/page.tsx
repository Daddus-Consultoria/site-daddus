"use client";
import {
  constantsFinancas,
  SPECIAL_CHARACTERS_WORDS_BLOG,
  CATEGORY_NAMES_BLOG,
} from "@/app/blog/[category]/_constants";
import { usePathname } from "next/navigation";
import { BlogPostCard, CardInfo, PaginationGeneric } from "@/components/index";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PostsUseCases } from "@/lib/useCases/postsUseCases";
import { CircularProgressIndicator } from "@/components/index";
import { useState } from "react";

const formatTitle = (title: string) => {
  if (SPECIAL_CHARACTERS_WORDS_BLOG[title]) {
    return SPECIAL_CHARACTERS_WORDS_BLOG[title];
  }
};

const formatCategory = (category?: string) => {
  return category ? CATEGORY_NAMES_BLOG[category] : "";
};

const CategoryPage: React.FC = () => {
  const urlPath = usePathname();
  const categoryPath = urlPath?.split("/").pop();
  const usePostUseCases = new PostsUseCases();

  const itemsPerPage = 6;

  const [currentPage, setCurrentPage] = useState(1);

  const getPosts = async (currentPage: number) => {
    return await usePostUseCases.getPosts({
      limit: itemsPerPage,
      currentIndex: currentPage,
      category: formatCategory(categoryPath),
    });
  }

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: async () => {
      return getPosts(currentPage);
    },
    placeholderData: keepPreviousData,
  });

  var postsAux = data?.posts;

  var totalItems = data?.totalItems;

  return (
    <div className="flex flex-1 flex-col justify-start items-start mt-6 lg:mt-0 ">
      {/* <div className="flex flex-1 flex-col justify-start items-start mt-6 lg:mt-0 px-8 sm:px-10 lg:px-32 xl:px-36 lg:py-10 ">*/}
      <div className="flex flex-1 flex-col w-full justify-center items-center">
        <div className="flex flex-1 w-full px-12 2xl:px-40 flex-col md:mt-5 lg:mt-5">
          <div className="flex flex-1 w-full items-center justify-between">
            <h2 className="flex lg:w-full font-bold text-[22px] lg:text-[26px] text-[#A90920] mt-4 lg:mt-1 mb-2 lg:mb-4">
              {formatTitle(categoryPath!)}
            </h2>
            <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
              <PaginationGeneric
                totalItems={totalItems || 0}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
          
          {isLoading ? (
            <CircularProgressIndicator containerHeight="400px" />
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 h-full xl:mt-0 gap-5 sm:gap-10 md:gap-10 xl:gap-5 md:mt-3 ">
              {postsAux!.map((post:any, index:number) => {
                if (index != 2) {
                  return (
                    <div
                      key={`card-financas-${index}`}
                      className="w-full h-52 sm:w-80 sm:h-52 md:w-[20rem] md:h-64 lg:w-96 lg:h-72 rounded-xl"
                    >
                      <BlogPostCard
                        title={post.title}
                        image={post.image}
                        badgeTitle={post.category}
                        href={post.slug}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={`card-financas-${index}`}
                      className=" w-64 h-52 sm:w-80 sm:h-52 md:w-[20rem] md:h-64  lg:w-96 lg:h-72 rounded-xl"
                    >
                      {/*anuncio do google */}
                    </div>
                  );
                }
              })}
            </div>
          )}
          <div className="flex flex-1 w-full justify-end lg:justify-center">
            <div className="flex mt-8 justify-end ">
              <PaginationGeneric
                  totalItems={totalItems || 0}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
        
      </div>
      <div className="flex flex-1 w-full flex-col justify-start items-center">
        <h1 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mt-4 lg:mt-6 mb-2 lg:mb-4">
          {constantsFinancas.titlePublications}
        </h1>
        <div className="flex flex-col lg:flex-row gap-10 md:max-w-[70%] lg:max-w-[70rem] mb-4 px-12 lg:px-0 lg:mb-14">
          {constantsFinancas.cardsPublications.map((item, index) => {
            return (
              <CardInfo 
                key={`publish-card-info-${index}`}
                title={item.title}
                description={item.description}
                image={item.image}
                path={item.path}
                copyLink={item.copyLink}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
