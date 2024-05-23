import { SearchLink, DaddusLink } from "@/components/index";
import { CardSelect } from "./cardSelect";

const CardSelectTypePublish = () => {
    return (
        <div className="flex items-start justify-start mb-[4%] min-h-[250px] rounded-2xl bg-[#EEEEEE] px-[5%] py-[4%] text-black relative">
            <div className="flex flex-col h-full w-full items-start justify-between gap-4">
                <div className="flex flex-col gap-3 w-full ">
                    <h2 className="font-bold text-[#A90920] text-[13px] lg:text-[16px] text-justify ">
                        Veja todas nossas publicações:
                    </h2>
                </div>
                <div className="flex flex-1 flex-col sm:flex-col w-full sm:items-end sm:justify-end md:flex-row gap-2 mdgap-1 px-2 md:px-8 ">
                    <CardSelect title="ESTUDOS" href="/conteudos/publicacoes/estudos"/>
                    <CardSelect title="GUIAS" href="/conteudos/publicacoes/guias"/>
                    <CardSelect title="PERFIS MUNICIPAIS" href="/conteudos/publicacoes/perfis-municipais"/>
                </div>
            </div>
        </div>
    )
}

export {CardSelectTypePublish}