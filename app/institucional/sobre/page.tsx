"use client";
import { constantsAbout } from "./_constants";
import Image from "next/image";
import { Contact, CardInfo } from "@/components/index";
import { title } from "process";
import { UltimasPublicacoes } from "@/components/relatedPublications/ultimasPublicacoes";

const TransportPage = () => {

  return (
    <div className="flex flex-1 flex-col">
      <div
        id="about-page"
        className="flex flex-col lg:flex-row w-full h-full py-[2%] px-[9%] mb-[2%] gap-[2%] lg:gap-[10%] "
      >
        <div id="left" className="flex lg:w-1/2 flex-col">
          {constantsAbout.text.map((item, index) => (
            <div
              key={`transport-page-${index}`}
              className="flex flex-col mb-[8%]"
            >
              <h2 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mb-[2%] ">
                {item.title}
              </h2>
              <p className="flex text-justify text-[17px] text-[#696984] leading-loose whitespace-pre-line ">
                {item.text}
              </p>
            </div>
          ))}
          {constantsAbout.values.listValues.length > 0 && (
            <ol className="mb-[8%] list-decimal ">
              <h2 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mb-[2%] ">
                {constantsAbout.values.title}
              </h2>
              {constantsAbout.values.listValues.map((item, index) => (
                <li
                  key={`values-about-page-${index}`}
                  className="text-justify text-[17px] text-[#696984] leading-loose whitespace-pre-line ml-[3%]"
                >
                  {item}
                </li>
              ))}

              {/* <p className="flex text-justify text-[17px] text-[#696984] leading-loose whitespace-pre-line ">{item.text}</p> */}
            </ol>
          )}
        </div>
        <div className="lg:hidden w-full px-[10px] bg-[#D6D6D6] py-[0.5px]"></div>
        <div
          id="right"
          className="flex lg:w-1/2 flex-col justify-start items-end gap-[7%] "
        >
          <Image
            src={constantsAbout.image}
            width={450}
            height={300}
            alt="bus"
          />
          <div className="flex justify-center items-center bg-[#D9D9D9] h-[300px] w-[300px]">
            <p className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mb-[2%]">
              GOOGLE
            </p>
          </div>
          <div className="flex flex-row w-full justify-end">
            <div className="flex lg:w-[72%] flex-col gap-10 mb-[35%] md:mb-[15%]">
              <Contact />
              <UltimasPublicacoes />
            </div>
          </div>
        </div>
      </div>
      <div id="bottom-transport-page" className="px-[7%]">
        <h2 className=" px-[2%] font-bold text-[26px] lg:text-[32px] text-[#A90920] mb-[2%] ">
          {constantsAbout.footer.title}
        </h2>
        <div className="w-full bg-[#999999] h-[1.5px]"></div>
        <div className="flex flex-col lg:flex-row gap-10 lg:h-[70%] md:justify-center md:items-center lg:justify-start lg:items-start">
          {constantsAbout.footer.cards.map((item, index) => (
            <div
              key={`card-about-page-${index}`}
              className="flex flex-col lg:flex-row gap-10  md:max-w-[70%] lg:max-w-[33%] mb-4 lg:mb-14 mt-[3%] rounded-3xl shadow-xl"
            >
              <CardInfo
                title={item.title}
                description={item.description}
                image={item.image}
                path={item.path}
                copyLink={item.copyLink}
                titleAlign={item.titleAlign}
                        ctaLabel={item.ctaLabel}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransportPage;
