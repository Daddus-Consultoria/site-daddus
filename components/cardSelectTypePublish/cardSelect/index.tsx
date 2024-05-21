import { FaArrowRightLong } from "react-icons/fa6";

import { DaddusLink } from "@/components/daddusLink";

interface CardSelectProps {
    title: string;
    href: string;
}

const CardSelect:React.FC<CardSelectProps> = ({title, href}) => {
    return (
        <div className="flex flex-col justify-between w-24 h-24 md:h-28 md:w-28 xl:w-36 xl:h-36 bg-white rounded-lg p-3">
            <h3 className="font-semibold text-sm md:text-md lg:text-md">{title}</h3>
            <div className="flex flex-row w-full justify-end text-primary">
                <DaddusLink variant={"ghost"} href={href} aria-label={`Vendo todos os ${title}`}>
                    <FaArrowRightLong size={30}/>
                </DaddusLink>
            </div>
        </div>
    )
}

export {CardSelect}