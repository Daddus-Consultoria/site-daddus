import { FaArrowRightLong } from "react-icons/fa6";

import { DaddusLink } from "@/components/daddusLink";
import Link from "next/link";

interface CardSelectProps {
    title: string;
    href: string;
}

const CardSelect:React.FC<CardSelectProps> = ({title, href}) => {
    return (
        <Link className="flex flex-col justify-between w-full h-24 md:h-28 md:w-28 xl:w-36 xl:h-36 bg-white rounded-lg p-3 hover:bg-primary-foreground" href={href}>
            <h3 className="font-semibold text-sm md:text-md lg:text-md">{title}</h3>
            <div className="flex flex-row w-full justify-end text-primary">
                <FaArrowRightLong size={30}/>
            </div>
        </Link>
    )
}

export {CardSelect}