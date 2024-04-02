'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Label,
    Button,
  } from "@/components/ui/index"
import Image from "next/image"
import { AiOutlineShareAlt } from "react-icons/ai";
 
interface CardInfoProps {
    title: string;
    description: string;
    image: string;
    path: string;
}

const CardInfo = () => {
    return (
        <Card className="flex flex-1 flex-col h-full bg-[#EEEEEE]">
            <CardHeader className="p-0">
                <Image alt="Publication 1" width={1000} height={300} src="/images/publications/publication1.svg"/>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 items-center mt-6">
                <div className="flex flex-col items-center gap-2">
                    <Label className="font-bold text-[24px] text-[#A90920]">ESTUDOS</Label>
                    <Label className="text-[11px] text-[#0B0C10] text-justify">Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.</Label>
                </div>
            </CardContent>
            <CardFooter className="flex flex-row justify-end mb-3 gap-2">
                <Button className="h-9 rounded-2xl">VEJA MAIS</Button>
                <Button className="flex flex-row justify-center items-center h-9 rounded-full bg-[#999999] p-1"><AiOutlineShareAlt size={30}/></Button>  
            </CardFooter>
        </Card>
    )
}

export {CardInfo as Cards}