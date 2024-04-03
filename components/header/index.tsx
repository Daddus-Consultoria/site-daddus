"use client";
import React from "react";
import { Dropdown, Label, Input } from "@/components/index";
import { headerItems } from "@/lib/constants/constants";
import { SubMenuItem } from "@/components/header/components/subMenuItem";
import { MenuDrawer } from "@/components/header/components/menuDrawer";

import { PiMagnifyingGlassThin } from "react-icons/pi";
import Image from "next/image";

export function Header() {
  return (
    <div className="flex flex-row justify-between items-center lg:justify-center gap-10 w-full h-24 lg:h-36 text-black bg-[#A90920]">
      <a href="/">
      <Image
        alt="Logo"
        src="/images/logos/daddusWhite.svg"
        width={150}
        height={50}
        className="p-5"
        
      />
      </a>
      <nav className="hidden lg:flex gap-10">
        {headerItems.map((item) => {
          return item.href ? (
            <div
              key={`navitem-${item.title.toLowerCase()}`}
              className="flex justify-center items-center"
            >
              <Label className="font-bold text-white">{item.title}</Label>
            </div>
          ) : (
            // <div></div>
            <Dropdown
              key={`navitem-${item.title.toLowerCase()}`}
              title={item.title}
              contentComponent={<SubMenuItem items={item.subtypes ?? []} />}
            />
          );
        })}
      </nav>
      <div className="lg:hidden text-[#A90920] p-3">
        <MenuDrawer />
      </div>
      <div className="hidden lg:flex flex-row justify-center items-center p-2">
        <div className="flex flex-row justify-center items-center rounded-xl border border-input p-1">
          <Input
            iconVariant={"trailingIcon"}
            type="text"
            placeholder={"Pesquisar"}
            className="bg-[#A90920] text-white placeholder:text-white"
            trailingIcon={
              <PiMagnifyingGlassThin
                size={30}
                className="fill-secondary"
                color="#2B2B2B"
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
