'use client'
import { InputGeneric, Publication, SelectGeneric } from "@/components/index";
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
            <div className="flex justify-center h-full w-full mt-10">
                <Publication/>
            </div>
        </div>
    )
}

export default Municipal_Profiles;