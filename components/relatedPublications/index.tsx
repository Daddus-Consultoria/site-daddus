interface RelatedPublicationsProps {
    publicationsRelated: {
        title: string;
        link: string;
    }[];
}

const RelatedPublications:React.FC<RelatedPublicationsProps> = ({publicationsRelated}) => {
    return(
        <div className="flex flex-col h-full gap-5">
            <p className="font-semibold text-[16px] text-[#A90920]">PUBLICAÇÕES RELACIONADAS</p>
            {publicationsRelated.map((item, index) => (
                <a key={`relatedPublication-${index}`} href={item.link} className="font-bold text-[#646464] text-[18px]">{item.title}</a>
            ))}
        </div>
    )
}

export { RelatedPublications }