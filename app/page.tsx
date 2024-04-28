import { DaddusCarousel } from "@/components/daddusCarousel";
import { carouselItems } from "@/app/constants";
import "@/styles/home.css";

export default function Home() {
  return (
    <>
      <section className="first-section relative">
        <div className="flex flex-col justify-center text-white title-container">
          <h1 className=" font-extrabold text-4xl">
            Soluções Estratégicas em Políticas Públicas, Gestão e Viabilidade
            Econômica
          </h1>
          <p className="text-lg font-semibold">
            Transforme seus desafios em oportunidades
            <br /> com a Daddus.
          </p>
        </div>
        <div className="absolute bg-primary rounded-2xl w-[90%] py-5 px-[10%] bottom-[-100px]">
          <DaddusCarousel items={carouselItems} />
        </div>
      </section>
      <div className="px-5percent mt-[100px]">
        <section className="flex flex-col pt-5">
          <h2 className="text-primary font-extrabold text-xl">
            Últimas publicações
          </h2>
          <div></div>
        </section>
      </div>
    </>
  );
}
