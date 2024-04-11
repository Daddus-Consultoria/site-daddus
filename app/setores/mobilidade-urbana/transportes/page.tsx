'use client'
import {constantsTransports} from './_constants'

const TransportPage = () =>{
    return (
        <div className="flex flex-1">
            <div id="top-transport-page" className="flex flex-row py-[4%] px-[9%] gap-[10%]">
                <div id="left" className="flex flex-1 flex-col">
                    {constantsTransports.map((item, index) => (
                        <div  key={`transport-page-${index}`} className="flex flex-col mt-[8%]">
                            <h2 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mb-[2%] ">{item.title}</h2>
                            <p className="flex text-justify text-[17px] text-[#696984] leading-loose whitespace-pre-line ">{item.text}</p>
                        </div>
                    ))}
                </div>
                <div id="right" className="flex flex-1 ">

                </div>
            </div>
            <div id="bottom-transport-page">

            </div>
        </div>
    )
}

export default TransportPage; 