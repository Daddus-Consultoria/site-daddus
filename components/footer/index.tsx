"use client";
import { Label } from "../ui/label";
import Image from "next/image";
import { headerItems } from "@/lib/constants/constants";
import { SubFooterItem } from "./subFooterItem";

import { constantFooter, footerItens } from "@/components/footer/_constants";


export function Footer() {
  return (
    <div className="w-full lg:h-80 bg-[#2B2B2B]">
      <div className="flex flex-col lg:flex-row w-full lg:h-3/4 justify-center">
        <div className="flex bg-mediumGray w-full lg:w-[420px] h-[150px] lg:h-full justify-center items-center p-3">
          <Image
            alt="Logo"
            src="/images/logos/daddus.svg"
            width={230}
            height={50}
          />
        </div>
        <div className="flex px-[3%] justify-center lg:justify-start items-start py-4 lg:pt-[20px] ">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-14 ">
            {footerItens.map((item, index) => {
              return (
                <div key={`footer-subtype-${index}`}>
                  {item.subtypes ? (
                    <Label className="flex flex-row w-full font-semibold text-[#A90920] justify-center lg:justify-start">
                      {item.title}
                    </Label>
                  ) : null}
                  <SubFooterItem
                    key={`subfooter-item-${index}`}
                    items={item.subtypes ?? []}
                  />
                </div>  
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center lg:items-center lg:justify-between px-[8%] lg:px-[15%] w-full lg:h-1/4 bg-[#A90920] gap-1 lg:gap-0 py-4 lg:py-0 ">
        <Label className="flex text-center lg:text-start font-medium text-white text-[14px]">
          {constantFooter.copyright}
        </Label>
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-4">
          {constantFooter.information.map((item, index) => (
            <a
              key={`navitem-${item.title.toLowerCase()}`}
              href={item.href}
              className="flex justify-center items-center font-semibold text-[14px] text-white  py-1 px-2 rounded-lg "
            >
              {item.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
