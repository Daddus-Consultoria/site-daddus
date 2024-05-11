"use client";
import { DaddusCarousel } from "@/components/daddusCarousel";
import { ListCards } from "@/components/index";
import { carouselItems } from "@/app/constants";
import {constantConsultancyListHome, constantPublishListHome} from "@/app/constants";
import "@/styles/home.css";

export default function Home() {
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
        <section className="flex flex-col pt-5">
          <h2 className="text-primary font-extrabold text-xl">
            Últimas publicações
          </h2>
          <div></div>
        </section>
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
