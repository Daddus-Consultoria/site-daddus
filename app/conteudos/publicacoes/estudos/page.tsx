'use client'
import { InputGeneric, CardPublication } from "@/components/index";
import {
    Label,
} from "@/components/ui/index";
import {PaginationGeneric} from "@/components/index"
import { useState } from "react";
import { useRouter } from 'next/navigation';

const title = "Citologia: um estudo demográfico de duas ou três linhas"
const description = "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos."

const data = [
    {id: 1, content: <CardPublication image="/images/report_card.svg" description={description} title={title}/>},
    {id: 2, content: <CardPublication image="/images/report_card.svg" description={description} title={title}/>},
    {id: 3, content: <CardPublication image="/images/report_card.svg" description={description} title={title}/>},
    {id: 4, content: <CardPublication image="/images/report_card.svg" description={description} title={title}/>},
    {id: 5, content:<CardPublication image="/images/report_card.svg" description={description} title={title}/>},
    {id: 6, content: <CardPublication image="/images/report_card.svg" description={description} title={title}/>},
    {id: 7, content: <CardPublication image="/images/report_card.svg" description={description} title={title}/>},
    {id: 8, content: <CardPublication image="/images/report_card.svg" description={description} title={title}/>},
    {id: 9, content: <CardPublication image="/images/report_card.svg" description={description} title={title}/>},
    {id: 10, content: <CardPublication image="/images/report_card.svg" description={description} title={title}/>},
    {id: 11, content: <CardPublication image="/images/report_card.svg" description={description} title={title}/>}
]


const Guides = () => {
    const items = ['Perfil Social dos Municípios', 'Perfil Eleitoral dos Municípios', 'Perfil Econômico dos Municípios'];

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6;
    const startIndex = (currentPage -1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentPageItems = data.slice(startIndex, endIndex)
    
    const router = useRouter();

    return(
        <div className="flex flex-1 flex-col justify-start items-center mt-6 lg:mt-0 px-[2%] lg:px-[5%] xl:px-[5%] lg:py-10">
            <div className="flex w-full flex-row justify-end items-center gap-10 lg:px-5">

                <div className="flex flex-1 lg:flex-none h-full flex-col justify-end">
                    <InputGeneric type="white" placeholder="Pesquisar"/>
                </div>
            </div>
            {/* <div className="flex justify-center h-full w-full mt-10">
                <CardPublication/>
            </div> */}
            <div className="grid md:grid-cols-1 lg:grid-cols-2 h-full w-full my-[10%] lg:my-[2%] ">
                {currentPageItems.map((item,index)=>{
                    return (
                        <CardPublication key={`card-publication-${index}`} image="/images/report_card.svg" description={description} title={title}/>
                    )
                })}
                {/* <CardPublication/>
                <CardPublication/>
                <CardPublication/>
                <CardPublication/>
                <CardPublication/>
                <CardPublication/> */}
            </div>
            <div className="flex flex-row w-full ">
                <PaginationGeneric/>
            </div>
        </div>
    )
}

export default Guides;