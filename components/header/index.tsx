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
        <div className="flex flex-row justify-center gap-10 w-full h-36 text-black bg-white">
            <Image alt="Logo" src="/images/logos/daddus.svg"  width={150} height={50} className="p-5"/>
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
            <NavigationMenu>
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
            </NavigationMenu>
            <div className='flex justify-center items-center'>
                <Label className='font-bold'>SOBRE NÓS</Label>
            </div>
            <div className='flex flex-row justify-center items-center p-2'>
                <div className='flex flex-row justify-center items-center rounded-xl border border-input p-1'>
                    <Input type="text" placeholder={"Pesquisar"}/>
                    <CiSearch size={20} color='#A90920'/>
                </div>
            </div>
        </div>
    )
}