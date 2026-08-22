import { CardInfoProps } from "@/lib/interfaces/card"
import { CardInfo } from "@/components/index";

interface ListCardsProps {
    title: string;
    cards: CardInfoProps[];
}

export const ListCards:React.FC<ListCardsProps> = ({title,cards}) => {
    return (
        <div className="flex flex-1 w-full flex-col justify-start items-center">
            <h1 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mt-4 lg:mt-6 mb-2 lg:mb-4">
                {title}
            </h1>
            <div className="flex flex-col lg:flex-row gap-10 md:max-w-[70%] lg:max-w-[70rem] mb-4 px-12 lg:px-0 lg:mb-14">
                {cards.map((item, index) => {
                return (
                    <CardInfo
                        key={`publish-card-info-${index}`}
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        path={item.path}
                        copyLink={item.copyLink}
                        titleAlign={item.titleAlign}
                        ctaLabel={item.ctaLabel}
                    />
                );
                })}
            </div>
        </div>
    )
}