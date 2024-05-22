"use client";
import { CardInfo } from "@/components/cardInfo/index";
import { constantsConsultancy } from "./_constants";

const ConsultancyPage = () => {
  return (
    <div className="flex flex-1 flex-col justify-start items-center">
      <h1 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mt-4 lg:mt-6 mb-2 lg:mb-4">
        NOSSAS CONSULTORIAS
      </h1>
      <div className="flex flex-col lg:flex-row gap-10 md:max-w-[70%] lg:max-w-[70%] mb-[15%] lg:mb-[5%]">
        {constantsConsultancy.map((item, index) => {
          return (
            <CardInfo
              key={`publish-card-info-${index}`}
              title={item.title}
              description={item.description}
              image={item.image}
              path={item.path}
              copyLink={item.copyLink}
              titleAlign={item.titleAlign}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConsultancyPage;
