'use client'

import { Button } from "@/components/ui";
import Link from "next/link";

const ButtonContact = () => {
    return (
        <div className="flex w-full h-14 flex-row bg-black justify-center items-center ">
            <p className="flex flex-1 text-white justify-center items-center text-[10px] xl:text-[14px] 2xl:text-[16px] ">
                Quer saber mais?
            </p>
            <Link className="flex flex-1 justify-center items-center h-[92%] mr-[0.6%] rounded-none text-[8px] xl:text-[12px] 2xl:text-[14px] bg-primary" href={"/institucional/contato"}>
                <p className="text-white">
                    Entre em contato
                </p>
            </Link>
        </div>
    )
}

export {ButtonContact}