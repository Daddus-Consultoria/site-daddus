"use client";
import { DaddusCarousel } from "@/components/daddusCarousel";
import { ListCards, CardPublication, CardSelectTypePublish } from "@/components/index";
import { carouselItems } from "@/app/constants";
import {constantConsultancyListHome, constantPublishListHome} from "@/app/constants";
import { Divider } from "@/components/post/parts/Divider";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants/queryKeys";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";
import { PublishData } from "@/lib/interfaces/publish";

import "@/styles/home.css";

export default function Home() {
  var allData: PublishData[] ;
  const usePublishUseCases = new PublishUseCases();
  const {data, isLoading} = useQuery({
    queryKey: [QueryKeys.allPublishs],
    queryFn: async () => {
      allData.concat(
        await usePublishUseCases.getPaginatedStudies({
          limit: 3,
          page: 1,
        })
      )
      allData.concat(
        await usePublishUseCases.getPaginatedGuides({
          limit: 3,
          page: 1,
        })
      )
      allData.concat(
        await usePublishUseCases.getPaginatedMunicipalProfiles({
          limit: 3,
          page: 1,
          category: "Perfil",
        })
      )
      return allData;
    },  
  });

  console.log(data)

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
            <CardPublication
                id={3}
                key={`card-publication`}
                image={"/images/study/study_image.svg"}
                description={"asdasd"}
                title={"title aux"}
                path={`/conteudos/publicacoes/estudos/`}
            />
            <CardPublication
                id={3}
                key={`card-publication`}
                image={"/images/study/study_image.svg"}
                description={"asdasd"}
                title={"title aux"}
                path={`/conteudos/publicacoes/estudos/`}
            />
            <CardPublication
                id={3}
                key={`card-publication`}
                image={"/images/study/study_image.svg"}
                description={"asdasd"}
                title={"title aux"}
                path={`/conteudos/publicacoes/estudos/`}
            />
            <CardSelectTypePublish/>
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
