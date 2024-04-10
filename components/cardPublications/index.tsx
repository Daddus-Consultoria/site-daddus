'use client'
import {
    Button,
  } from "@/components/ui/index"

import Image from "next/image"
import { AiOutlineShareAlt } from "react-icons/ai";

interface CardPublicationProps {
    title: string;
    description: string;
    image: string;
    path?: string;
}

const CardPublication: React.FC<CardPublicationProps> = ({title, description, image}) => {

    return (
        <div className="flex items-start justify-start m-[4%] rounded-2xl bg-[#EEEEEE] text-black">
            <div className="flex h-full w-full items-start justify-between">
                <Image 
                    alt="Publication 1" 
                    width={1} 
                    height={1} 
                    src={image} 
                    className="hidden md:flex -mt-[5%]  xl:ml-[3%] 3-xl:ml-[1%] h-[65%] lg:h-[105%] w-full" 
                />
                <div className="flex flex-col h-[85%] gap-3 mx-[5%] my-[4%] justify-between">
                    <div className="flex flex-col gap-3">
                        <h2 className="font-bold text-[#A90920] text-[13px] lg:text-[16px] text-justify ">{title}</h2>
                        <p className="text-[11px] text-justify">{description}</p>
                    </div>
                    <div className="flex flex-row justify-end items-center gap-[2%] mb-[3%] h-[14%] lg:h-[18%] ">
                        <Button className="h-full rounded-2xl">VEJA MAIS</Button>
                        <Button className="flex h-full flex-row justify-center items-center rounded-full bg-[#999999]" ><AiOutlineShareAlt size={20}/></Button>  
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export {CardPublication}