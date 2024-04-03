'use client'
import React from "react";
import {
  Label,
} from "@/components/ui/index";
import { Cards } from "@/components/cardInfo/index";
import { constantsConsultancy } from "./_constants";

const ConsultancyPage = () => {
  return (
    <div className="flex flex-1 flex-col justify-start items-center">
        <Label className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mt-11 mb-2 lg:mb-16">NOSSAS CONSULTORIAS</Label>
        <div className="flex flex-col lg:flex-row gap-10 md:max-w-[80%] lg:max-w-[90%] pb-10">
          {constantsConsultancy.map((item, index) => {
            return (
              <Cards
                key={`publish-card-info-${index}`}
                title={item.title}
                description={item.description}
                image={item.image}
                path={item.path}
              />
            )
          })}
        </div>
    </div>
  );
};

export default ConsultancyPage;
