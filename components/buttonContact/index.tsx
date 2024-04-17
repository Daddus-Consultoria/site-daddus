'use client'

import { Button } from "@/components/ui";

const ButtonContact = () => {
    return (
        <div className="flex w-full h-14 flex-row bg-black justify-center items-center ">
            <p className="flex flex-1 text-white justify-center items-center text-[10px] xl:text-[14px] 2xl:text-[16px]">
                Quer saber mais?
            </p>
            <Button className="flex flex-1 h-[92%] mr-[0.6%] rounded-none text-[10px] xl:text-[14px] 2xl:text-[16px]">
                Entre em contato
            </Button>
        </div>
    )
}

export {ButtonContact}