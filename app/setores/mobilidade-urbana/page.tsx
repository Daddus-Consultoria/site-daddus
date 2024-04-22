'use client'

import Image from "next/image";

import { VideoComponent, CardInfo } from '@/components/index';
import { constantMobilityUrban } from "./_constants";

const UrbanMobilityPage = () => {
    return (
        <div className="flex flex-1 flex-col">
            <div id="top-Urban-MobilityPage" className="flex flex-col w-full h-full py-[4%] px-[9%] mb-[2%] ">
                <div className="flex flex-col xl:flex-row w-full h-full gap-[2%] lg:gap-[10%]">
                    <div className="flex flex-1 flex-col">
                        <h2 className="font-bold text-[26px] lg:text-[32px] text-primary mb-[2%] ">
                            {constantMobilityUrban.subtitle1}
                        </h2>
                        <p className="flex text-justify text-[17px] text-[#696984] leading-loose whitespace-pre-line ">
                            {constantMobilityUrban.textSubtitle1}
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <VideoComponent/>
                    </div>
                </div>
                <div className="flex flex-col w-full md:justify-center items-center md:px-[10%] mt-[10%]">
                    <h2 className="font-bold text-[26px] lg:text-[32px] text-primary mb-[2%] ">
                        {constantMobilityUrban.subtitle2}
                    </h2>
                    <p className="flex text-justify md:text-center text-[17px] text-[#696984] leading-loose whitespace-pre-line ">
                        {constantMobilityUrban.textSubtitle2}
                    </p>
                    <div className="flex flex-col gap-4 mt-8  w-full">
                        <p className="flex text-center text-[18px] text-black font-semibold leading-loose whitespace-pre-line justify-center">
                            {constantMobilityUrban.data.title}
                        </p>
                        <div className="flex flex-row gap-[10%] justify-center">
                            {constantMobilityUrban.data.percentage.map((item, index) => (
                                <div key={`percentage-${index}`} className="flex flex-col justify-center items-center gap-[2%]">
                                    <h3 className="font-bold text-[26px] lg:text-[32px] text-primary mb-[2%] ">
                                        {item.porcentage}
                                    </h3>
                                    <p className="flex text-center text-[18px] text-black font-semibold leading-loose whitespace-pre-line ">
                                        {item.type}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div id="botttom-Urban-MobilityPage">
                <h2 className="flex font-bold text-[26px] lg:text-[32px] text-primary mb-[2%] w-full justify-center">
                    {constantMobilityUrban.cards.title}
                </h2>
                <div className="flex flex-col lg:flex-row gap-10 lg:h-[70%] md:justify-center md:items-center lg:justify-start lg:items-start px-[10%]">
                    {constantMobilityUrban.cards.cardsContent.map((item, index) => (
                        <div
                        key={`card-urban-mobility-page-${index}`}
                        className="flex flex-col lg:flex-row gap-10  md:max-w-[70%] lg:max-w-[33%] mb-4 lg:mb-14 mt-[3%] rounded-3xl shadow-xl"
                        >
                        <CardInfo
                            title={item.title}
                            description={item.description}
                            image={item.image}
                            path={item.path}
                            titleAlign={item.titleAlign}
                        />
                        </div>
                    ))}
                </div>                
            </div>
        </div>
    )

}


export default UrbanMobilityPage;