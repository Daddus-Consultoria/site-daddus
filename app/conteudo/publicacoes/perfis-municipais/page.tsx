'use client'
import { InputGeneric, CardPublication, SelectGeneric } from "@/components/index";
import {
    Label,
} from "@/components/ui/index";
import {PaginationGeneric} from "@/components/index"
import { useState } from "react";
import { useRouter } from 'next/navigation';

const data = [
    {id: 1, content: <CardPublication/>},
    {id: 2, content: <CardPublication/>},
    {id: 3, content: <CardPublication/>},
    {id: 4, content: <CardPublication/>},
    {id: 5, content: <CardPublication/>},
    {id: 6, content: <CardPublication/>},
    {id: 7, content: <CardPublication/>},
    {id: 8, content: <CardPublication/>},
    {id: 9, content: <CardPublication/>},
    {id: 10, content: <CardPublication/>},
    {id: 11, content: <CardPublication/>}
]


const Municipal_Profiles = () => {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6;
    const startIndex = (currentPage -1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentPageItems = data.slice(startIndex, endIndex)
    
    const router = useRouter();

    

    return(
        <div className="flex flex-1 flex-col justify-start items-center mt-6 px-[2%] lg:px-60 lg:py-20">
            <div className="flex w-full flex-row justify-between items-center gap-10 lg:px-5">
                <div className="flex flex-1 flex-col gap-2 ">
                    <Label className="font-medium text-[13px] lg:text-[13px] text-black">Tópicos</Label>
                    <div className="w-[100%] lg:w-[30%]">
                        <SelectGeneric placeholder="Selecionar" items={items}/>
                    </div>
                </div>
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
                        <CardPublication key={`card-publication-${index}`}/>
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

export default Municipal_Profiles;