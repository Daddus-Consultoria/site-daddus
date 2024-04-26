"use client";
import React from "react";
import { Label } from "../ui/label";
import Image from "next/image";
import { headerItems } from "@/lib/constants/constants";
import { SubFooterItem } from "./subFooterItem";

import Link from "next/link";
import { constantFooter } from "@/components/footer/_constants"

import { Button } from "@/components/index";

export function Footer() {
  return (
    <div className="w-full lg:h-80 bg-[#2B2B2B]">
      <div className="flex flex-col lg:flex-row w-full lg:h-3/4 justify-center">
        <div className="flex bg-[#F5F7F9] w-full lg:w-[420px] h-[150px] lg:h-full justify-center items-center p-3">
          <Image
            alt="Logo"
            src="/images/logos/daddus.svg"
            width={230}
            height={50}
          />
        </div>
        <div className="flex pl-[3%] justify-start lg:justify-start items-start pt-4 lg:pt-[20px] ">
          <div className="grid grid-cols-2 lg:flex lg:flex-row gap-6 lg:gap-14 ">
            {headerItems.map((item, index) => {
              return (
                <div key={`footer-subtype-${index}`}>
                  {item.subtypes ? <Label className="font-semibold text-[#A90920]">{item.title}</Label> : null} 
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-[8%] lg:px-[15%] w-full lg:h-1/4 bg-[#A90920] gap-1 lg:gap-0 py-4 lg:py-0">
        <div>
          <Label className="font-medium text-white text-[14px]">
           {constantFooter.copyright}
          </Label> 
        </div>
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
