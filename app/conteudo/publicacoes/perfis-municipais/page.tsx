'use client'
import { InputGeneric, SelectGeneric } from "@/components/index";
import {
    Label,
} from "@/components/ui/index";

const Municipal_Profiles = () => {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

    return(
        <div className="flex flex-1 flex-col justify-start items-center lg:px-60 lg:py-20">
            <div className="flex w-full flex-row justify-between items-center">
                <div className="flex flex-1 flex-col gap-2">
                    <Label className="font-medium text-[13px] lg:text-[13px] text-black">Tópicos</Label>
                    <div className="w-[30%]">
                        <SelectGeneric placeholder="Selecionar" items={items}/>
                    </div>
                </div>
                <div className="flex h-full flex-col justify-end">
                    <InputGeneric type="white" placeholder="Pesquisar"/>
                </div>
            </div>
            <div>
                <Label className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mt-11 mb-2 lg:mb-16">PUBLICAÇÕES</Label>
            </div>
        </div>
    )
}

export default Municipal_Profiles;