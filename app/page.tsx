"use client";
import { DaddusCarousel } from "@/components/daddusCarousel";
import { ListCards, CardPublication, CardSelectTypePublish, CircularProgressIndicator, Skeleton, BlogPostCard, PostList } from "@/components/index";
import { carouselItems } from "@/app/constants";
import {constantConsultancyListHome, constantPublishListHome} from "@/app/constants";
import { Divider } from "@/components/post/parts/Divider";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants/queryKeys";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";
import { PostsUseCases } from "@/lib/useCases/postsUseCases";
import { PublishData, PublishModel } from "@/lib/interfaces/publish";
import Image from "next/image"

import "@/styles/home.css";

export default function Home() {
  

  const getPostsHome = async ()=>{
    const usePublishUseCases = new PublishUseCases();
    const postsUseCases = new PostsUseCases();

    const getStudies = async ()  => {
      return await usePublishUseCases.getPaginatedStudies({
        limit: 3,
        page: 1,
      })
    }

    const getGuides = async ()  => {
      return await usePublishUseCases.getPaginatedGuides({
        limit: 3,
        page: 1,
      })
    }

    const getMuncipalProfile = async ()  => {
      return  await usePublishUseCases.getPaginatedMunicipalProfiles({
        limit: 3,
        page: 1,
        category: "Perfil",
      })
    }

    const promises = [
      getStudies(),
      getGuides(),
      getMuncipalProfile()
    ]

    var allPublish: PublishModel[] = [];
    await Promise.all(promises).
      then((values) => {
        return values.map((value) => {
          value.items.map((item) => {
            allPublish.push(item)
          })
        })
      });
    var lastPublishes = allPublish.sort((a, b) => new Date(b.createdAt!).getDate()- new Date(a.createdAt!).getDate())
    
    var allPosts = await postsUseCases.getPosts({})

    var lastPosts = allPosts.posts.sort((a, b) => {
      return (
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
      );
    });

    return {
      lastPublishes,
      lastPosts,
    }
  }

  const {data, isLoading} = useQuery({
    queryKey: [QueryKeys.allPublishs],
    queryFn: async () => {
      return await getPostsHome()
    },  
  });

  var postsHome = data
  var lastPublishes = postsHome?.lastPublishes
  var postsBlog = postsHome?.lastPosts

  console.log(lastPublishes)

  return (
    <>
      <section className="first-section relative">
        <div className="flex flex-col relative z-2 justify-center text-white title-container">
          <h1 className=" font-extrabold text-4xl">
            Soluções Estratégicas em Políticas Públicas, Gestão e Viabilidade
            Econômica
          </h1>
          <p className="text-lg font-semibold">
            Transforme seus desafios em oportunidades
            <br /> com a Daddus.
          </p>
        </div>
        <div className="absolute w-[100%] md:relative  left-0 md:left-auto mt-10 lg:absolute bg-primary rounded-2xl md:mt-[4rem] lg:mt-0 lg:w-[90%] py-5 px-[10%] lg:bottom-[-4rem]">
          <DaddusCarousel items={carouselItems} />
        </div>
      </section>
      <div className="px-5percent lg:mt-[100px]">
        <section className="flex flex-1 flex-col pt-5">
          <h2 className="text-primary font-extrabold text-xl">
            Últimas publicações
          </h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 w-full my-[10%] lg:mt-[70px] md:h-full lg:px-5 gap-[4%]">
            {isLoading ? <CircularProgressIndicator containerHeight="300px"/>: (
                  lastPublishes && lastPublishes?.map((item:PublishModel) => (
                    <CardPublication
                        id={item.id}
                        key={`card-publication-${item.title}`}
                        image={item.imageUrl}
                        description={"asdasd"}
                        title={item.title}
                        path={`/conteudos/publicacoes/estudos/`}
                    />
                  ))
              )}
            <CardSelectTypePublish/>
          </div>
        </section>
        <Divider>
            <Image src='/images/blog/logo.svg' width={100} height={10} alt="divider" />
        </Divider>
        <section>
          <div className="flex flex-col lg:flex-row h-full w-full lg:h-[500px] 2xl:h-[500px] items-center mt-4 lg:mt-5percent gap-10 px-5percent">
            <div className="w-full h-52 md:h-80 lg:w-[60%] xl:w-[66.66%] lg:h-full">
              {isLoading ? (
                <Skeleton>
                  <div className="bg-mediumGray rounded-lg w-full lg:h-[500px] 2xl:h-[500px] "></div>
                </Skeleton>
              ) : (
                postsBlog &&
                postsBlog?.length > 3 && (
                  <BlogPostCard
                    title={postsBlog![0].title}
                    image={postsBlog![0].image}
                    first={postsBlog![0].first}
                    href={postsBlog![0].slug}
                    badgeTitle={postsBlog![0].category}
                  />
                )
              )}
            </div>
            <div className="flex flex-col w-full lg:w-[34%] xl:w-[33.33%] h-full lg:justify-between items-center gap-10 lg:gap-0">
              <div className="w-full h-52 md:h-80 lg:w-full lg:h-60 rounded-xl">
                {isLoading ? (
                  <Skeleton>
                    <div className="bg-mediumGray rounded-lg w-full h-52 md:h-80 lg:h-60"></div>
                  </Skeleton>
                ) : (
                  postsBlog &&
                  postsBlog.length > 2 && (
                    <BlogPostCard
                      title={postsBlog![1].title}
                      image={postsBlog![1].image}
                      href={postsBlog![1].slug}
                      first={postsBlog![1].first}
                      badgeTitle={postsBlog![1].category}
                    />
                  )
                )}
              </div>
              <div className="w-full h-52 md:h-80  lg:w-full lg:h-60  rounded-xl">
                {isLoading ? (
                  <Skeleton>
                    <div className="bg-mediumGray rounded-lg w-full h-52 md:h-80 lg:h-60"></div>
                  </Skeleton>
                ) : (
                  postsBlog &&
                  postsBlog.length > 3 && (
                    <BlogPostCard
                      title={postsBlog![2].title}
                      href={postsBlog![2].slug}
                      image={postsBlog![2].image}
                      first={postsBlog![2].first}
                      badgeTitle={postsBlog![2].category}
                    />
                  )
                )}
              </div>
            </div>
            
          </div>
          <div className="flex flex-1 flex-col lg:flex-row w-full justify-end px-5percent mt-6 lg:gap-6">
            <div className="w-full lg:w-1/3">
              
            </div>
            <div className="w-full lg:w-1/3">
              <PostList title="Mais lidas" posts={[]} />
            </div>
            <div className="w-full lg:w-1/3">
              <PostList title="Últimas" posts={postsBlog ?? []} />
            </div>
          </div>
        </section>
        <Divider />
        <section className="flex flex-col pt-5">
          <ListCards  title={constantConsultancyListHome.title} cards={constantConsultancyListHome.cards}/>
        </section>
        <section className="flex flex-col pt-5">
          <ListCards  title={constantPublishListHome.title} cards={constantPublishListHome.cards}/>
        </section>
      </div>
    </>
  );
}

