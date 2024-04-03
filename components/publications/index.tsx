'use client'

import Image from "next/image"

const Publication = () => {
    return (
        <div className="flex items-center relative w-[45%] h-[40%] rounded-2xl bg-[#EEEEEE] text-black">
            <div className="flex-shrink-0">
                    <img
                        src="/images/report_card.svg"
                        alt="Report Card"
                        className="relative z-10 -mt-10 ml-5 lg:h-[50%] 2xl:h-[70%]"
                    />
                    {/* <Image alt="Publication 1" width={160} height={200} src={"/images/report_card.svg"} className="relative z-10 -mt-10 ml-5"/> */}
            </div>
        </div>
    )
}

export {Publication}