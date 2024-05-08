'use client'
import { constantsFinancas, SPECIAL_CHARACTERS_WORDS_BLOG, CATEGORY_NAMES_BLOG } from "@/app/blog/[category]/_constants";
import { usePathname } from "next/navigation";
import { BlogPostCard, CardInfo } from "@/components/index";
import { PostsAPIService } from "@/lib/services/postAPIService";
import { useQuery } from "@tanstack/react-query";
import { PostsUseCases } from "@/lib/useCases/postsUseCases";
import {
    Publish,
    CircularProgressIndicator,
    ContentNotFoundWarning,
  } from "@/components/index";
import { useEffect } from "react";

const formatTitle = (title: string) => {
    if(SPECIAL_CHARACTERS_WORDS_BLOG[title]){
        return SPECIAL_CHARACTERS_WORDS_BLOG[title];
    }
}

const formatCategory = (category: string) => {
    if(CATEGORY_NAMES_BLOG[category]){
        return CATEGORY_NAMES_BLOG[category];
    }
}

const CategoryPage: React.FC = () => {
    const urlPath = usePathname();
    const categoryPath = urlPath.split("/").pop();
    const usePostUseCases = new PostsUseCases();

    const {data, isLoading} = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            return await usePostUseCases.getPosts(formatCategory(categoryPath!));
        }
    });

    var postsAux = data?.posts;

    console.log(postsAux)

    return (
        <div className="flex flex-1 flex-col justify-start items-start mt-6 lg:mt-0 ">
        {/* <div className="flex flex-1 flex-col justify-start items-start mt-6 lg:mt-0 px-8 sm:px-10 lg:px-32 xl:px-36 lg:py-10 ">*/}
            <div className="flex flex-1 flex-col w-full justify-center items-center">
                <div className="flex flex-col md:mt-5 lg:mt-5">
                    <h2 className="flex w-full font-bold text-[22px] lg:text-[26px] text-[#A90920] mt-4 lg:mt-1 mb-2 lg:mb-4">
                        {formatTitle(categoryPath!)}
                    </h2>
                    {isLoading ? (
                        <CircularProgressIndicator containerHeight="400px" />
                    ) : (
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 h-full xl:mt-0 gap-5 sm:gap-10 md:gap-10 xl:gap-5 md:mt-3 ">
                            {postsAux!.map((post, index) => {
                                if(index != 2){
                                    return (
                                        <div key={`card-financas-${index}`} className="w-full h-52 sm:w-80 sm:h-52 md:w-[20rem] md:h-64 lg:w-96 lg:h-72 rounded-xl">
                                            <BlogPostCard 
                                                title={post.title}
                                                image={post.image}
                                                badgeTitle={post.category}
                                            />
                                        </div>
                                    )
                                }else{
                                    return (
                                        <div key={`card-financas-${index}`} className=" w-64 h-52 sm:w-80 sm:h-52 md:w-[20rem] md:h-64  lg:w-96 lg:h-72 rounded-xl">
                                            {/*anuncio do google */}
                                        </div>
                                    ) 
                                }
                            })}
                            
                        </div>
                    )}
                    
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
    )
}

export default CategoryPage;