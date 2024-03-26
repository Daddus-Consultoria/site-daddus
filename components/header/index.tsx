'use client'
import React from 'react'

import { Button } from "../ui/button";
import { NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport, } from "../ui/navigation-menu";
import { Label } from '../ui/label';
import { Input } from '../ui/input';

import { CiSearch } from "react-icons/ci";
import Image from "next/image";

export function Header(){

    return(
        <div className="flex flex-row justify-center w-full sm:gap-3 md:gap-10 sm:h-20 md:h-32  text-black bg-white">
            {/* <Image alt="Logo" src="/images/logos/daddus.svg" srcSet="/images/logos/daddusAux.svg 200w" width={150} height={50} className="p-5"/> */}
            <div className='flex flex-row items-center justify-center p-6 w-[80px] md:w-[200px]'>
                <img src="/images/logos/daddus.svg" width="100%" height="100%" srcSet='/images/logos/daddusAux.svg 700w, /images/logos/daddus.svg 2000w'/>
            </div>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="font-bold">SERVIÇOS</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            {/* <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="font-bold">SETORES</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="font-bold">CONTEUDOS</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu> */}
            <div className='flex sm:w-[40px] md:w-[100px] overflow-hidden overflow-ellipsis whitespace-nowrap justify-start items-center'>
                <Label className='font-bold'>SOBRE NÓS</Label>
            </div>
            <div className='flex flex-row justify-center items-center p-2'>
                <div className='flex flex-row justify-center items-center rounded-xl border border-input p-1 pr-3'>
                    <Input type="text" placeholder={"Pesquisar"}/>
                    <CiSearch size={20} color='#A90920'/>
                </div>
            </div>
        </div>
    )
}