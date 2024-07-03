"use client";
import { Dropdown, InputGeneric, SearchItems } from "@/components/index";
import { headerItems } from "@/lib/constants/constants";
import { SubMenuItem } from "@/components/header/components/subMenuItem";
import { MenuDrawer } from "@/components/header/components/menuDrawer";

import Image from "next/image";

export function Header() {
  return (
    <div className="flex flex-row justify-between items-center lg:justify-center gap-10 w-full h-20 lg:h-24 text-black bg-[#A90920]">
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
            <a
              key={`navitem-${item.title.toLowerCase()}`}
              href={item.href}
              className="flex justify-center items-center font-semibold text-[14px] text-white hover:bg-white hover:text-black py-1 px-2 rounded-lg "
              >
              {item.title}
            </a>
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
        {/* <InputGeneric type="red" placeholder="Pesquisar"/> */}
        <SearchItems />
      </div>
    </div>
  );
}
