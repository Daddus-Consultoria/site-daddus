'use client'
import {
    Button,
  } from "@/components/ui/index"

import Image from "next/image"
import { AiOutlineShareAlt } from "react-icons/ai";

interface TruncateTextProps {
    text: string;
    maxLength: number;
}

const TruncateText = ({text,maxLength}:TruncateTextProps) => {
    if (text.length <= maxLength) {
      return <span>{text}</span>;
    }
  
    const truncatedText = `${text.slice(0, maxLength)}...`;
  
    return <p className="text-[11px] text-justify">{truncatedText}</p>;
};

const CardPublication = () => {
    
    
    const text = "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos."

    return (
        <div className="flex items-start justify-start m-[4%] rounded-2xl bg-[#EEEEEE] text-black">
            <div className="flex h-full w-full items-start justify-between">
                <Image 
                    alt="Publication 1" 
                    width={1} 
                    height={1} 
                    src={"/images/report_card.svg"} 
                    className="-mt-[5%]  xl:ml-[3%] 3-xl:ml-[1%] h-[65%] lg:h-[105%] w-full" 
                />
                <div className="flex flex-col h-[85%] gap-3 mx-[5%] my-[4%] justify-between">
                    <div className="flex flex-col gap-3">
                        <h2 className="font-bold text-[#A90920] text-[13px] lg:text-[16px] text-justify ">Citologia: um estudo demográfico de duas ou três linhas</h2>
                        {/* <TruncateText maxLength={100} text={text} /> */}
                        <p className="text-[11px] text-justify">{text}</p>
                    </div>
                    <div className="flex flex-row justify-end items-center gap-[2%] mb-[3%] h-[10%] lg:h-[18%]">
                        <Button className="h-full rounded-2xl">VEJA MAIS</Button>
                        <Button className="flex flex-row justify-center items-center h-9 rounded-full bg-[#999999] p-1"><AiOutlineShareAlt size={30}/></Button>  
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export {CardPublication}