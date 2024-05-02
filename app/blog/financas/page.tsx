'use client'
import { constantsFinancas } from "./_constants";

import { BlogPostCard, CardInfo } from "@/components/index";

const FinancesPage: React.FC = () => {
    return (
        <div className="flex flex-1 flex-col justify-start items-start mt-6 lg:mt-0 px-8 sm:px-10 lg:px-32 xl:px-36 lg:py-10 ">
            <h2 className="font-bold text-[22px] lg:text-[26px] text-[#A90920] mt-4 lg:mt-1 mb-2 lg:mb-4">
                {constantsFinancas.title}
            </h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 h-full w-full xl:mt-0 gap-5 sm:gap-10 md:gap-10 xl:gap-5 md:mt-3 ">
                {constantsFinancas.cards.map((card, index) => {
                    if(index != 2){
                        return (
                            <div key={`card-financas-${index}`} className="w-full h-52 sm:w-80 sm:h-52 md:w-[20rem] md:h-64 lg:w-96 lg:h-72 rounded-xl">
                                <BlogPostCard 
                                    title={card.title}
                                    image={card.image}
                                    first={card.first}
                                    badgeTitle={card.badgeTitle}
                                />
                            </div>
                        )
                    }else{
                        return (
                            <div key={`card-financas-${index}`} className=" w-64 h-52 sm:w-80 sm:h-52 md:w-[20rem] md:h-64  lg:w-96 lg:h-72 rounded-xl">
                                {/*anuncio do google */}
                            </div>
                        )
                    }
                })}
                
            </div>
            <div className="flex flex-1 w-full flex-col justify-start items-center">
                <h1 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mt-4 lg:mt-6 mb-2 lg:mb-4">
                {constantsFinancas.titlePublications}
                </h1>
                <div className="flex flex-col lg:flex-row gap-10 md:max-w-[70%] lg:max-w-[70rem] mb-4 px-12 lg:px-0 lg:mb-14">
                    {constantsFinancas.cardsPublications.map((item, index) => {
                    return (
                        <CardInfo
                        key={`publish-card-info-${index}`}
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        path={item.path}
                        copyLink={item.copyLink}
                        />
                    );
                    })}
                </div>
            </div>
        </div>
    )
}

export default FinancesPage;