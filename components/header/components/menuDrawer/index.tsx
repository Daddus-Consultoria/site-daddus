import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  Input,
  Button,
  DaddusLink,
} from "@/components/index";

import { PiMagnifyingGlassThin } from "react-icons/pi";
import { IoIosMenu } from "react-icons/io";
import { CgClose } from "react-icons/cg";

import Link from "next/link";

import { AccordionMenuItem } from "@/components/header/components/accordionMenuItem";
import { headerItems } from "@/lib/constants/constants";

import { useState } from "react";
import Image from "next/image";
import { Url } from "next/dist/shared/lib/router/router";

const MenuDrawer = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer direction="right" snapPoints={[0.745]} open={open} onOpenChange={setOpen} >
      <DrawerTrigger>
        <IoIosMenu className="fill-white" size={35} />
      </DrawerTrigger>
      <DrawerContent className="h-full w-3/4 bg-white">
        <div className="p-1">
          <div className="flex flex-row justify-between items-center">
            <Image
              alt="Logo"
              src="/images/logos/daddus.svg"
              width={120}
              height={50}
              className="p-5"
            />
            <Button onClick={()=>setOpen(false)} className="p-2 bg-white mr-[4%]">
              <CgClose size={20} className="text-[#A90920]" />
            </Button>
          </div>
          <div className="px-2">
            <Input
              iconVariant={"trailingIcon"}
              type="text"
              placeholder={"Pesquisar"}
              trailingIcon={
                <PiMagnifyingGlassThin size={30} className="fill-primary" />
              }
            />
          </div>
        </div>
        <div className="px-[4%]">
          {headerItems.map((item) => {
              return (
                <div
                  key={`acorddionitem-${item.title.toLowerCase()}`}
                  className="p-3"
                >
                  {item.subtypes ? (
                    <AccordionMenuItem item={item} />
                  ): (
                    <Link href={item.href as Url}>{item.title}</Link>
                  )}
                </div>
              );
            })}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { MenuDrawer };
