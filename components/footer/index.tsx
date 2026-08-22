"use client";
import { Label } from "../ui/label";
import Image from "next/image";
import { SubFooterItem } from "./subFooterItem";

import { constantFooter, footerItens } from "@/components/footer/_constants";

/**
 * O rodape acompanha o menu, entao passou de tres para cinco colunas. A altura
 * deixou de ser fixa (`h-80`) e virou minima: se as colunas quebrarem de linha
 * em uma tela estreita, o conteudo empurra o rodape em vez de vazar por cima da
 * barra vermelha.
 */
export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <div className="w-full lg:min-h-80 bg-[#2B2B2B]">
      <div className="flex flex-col lg:flex-row w-full lg:min-h-[240px] justify-center">
        <div className="flex bg-mediumGray w-full lg:w-[320px] shrink-0 h-[150px] lg:h-auto lg:self-stretch justify-center items-center p-3">
          <Image
            alt="Logo"
            src="/images/logos/daddus.svg"
            width={230}
            height={50}
          />
        </div>
        <div className="flex px-[3%] justify-center lg:justify-start items-start py-4 lg:pt-[20px] lg:pb-8">
          <div className="flex flex-col flex-wrap lg:flex-row gap-6 lg:gap-10">
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
      <div className="flex flex-col lg:flex-row items-center lg:items-center lg:justify-between px-[8%] lg:px-[15%] w-full bg-[#A90920] gap-1 lg:gap-0 py-4 lg:py-5 ">
        <Label className="flex text-center lg:text-start font-medium text-white text-[14px]">
          © {ano} {constantFooter.copyright}
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
