'use client'
import {
    Card,
    CardContent, CardFooter,
    CardHeader, Button
} from "@/components/ui/index";
import Image from "next/image";
import { AiOutlineShareAlt } from "react-icons/ai";
 
interface CardInfoProps {
    title: string;
    description: string;
    image: string;
    path: string;
}

const CardInfo: React.FC<CardInfoProps> = ({title,description,image,path}) => {
    return (
        <Card className="flex flex-1 flex-col h-full rounded-3xl bg-[#EEEEEE] m-10 lg:m-0 overflow-hidden">
            {/* <div className="w-full h-64 relative ">
                <Image
                    src={image}
                    alt="Descrição da imagem"
                    layout="fill"
                    objectFit="cover" // Mantém as proporções e faz a imagem se ajustar dentro do contêiner
                    objectPosition="center"
                />
            </div> */}
            <CardHeader className="w-full h-64  lg:h-64 xl:h-80 2xl:h-80  relative ">
                <Image
                    src={image}
                    alt="Descrição da imagem"
                    layout="fill"
                    objectFit="cover" // Mantém as proporções e faz a imagem se ajustar dentro do contêiner
                    objectPosition="center"
                />
            </CardHeader>
            <CardContent className="flex flex-col flex-1 items-center mt-6P">
                <div className="flex flex-col items-center gap-2">
                    <h2 className="font-bold text-[24px] text-[#A90920]">{title}</h2>
                    <p className="text-[11px] text-[#0B0C10] text-justify">{description}</p>
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