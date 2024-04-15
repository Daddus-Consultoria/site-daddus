'use client'
import {constantsTransports} from './_constants'
import Image from 'next/image'
import { Contact, RelatedPublications, Cards } from '@/components/index'


const TransportPage = () =>{
    return (
        <div className="flex flex-1 flex-col">
            <div id="top-transport-page" className="flex flex-row w-full  py-[4%] px-[9%] mb-[2%] gap-[10%]">
                <div id="left" className="flex w-1/2 flex-col ">
                    {constantsTransports.map((item, index) => (
                        <div  key={`transport-page-${index}`} className="flex flex-col mt-[8%]">
                            <h2 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mb-[2%] ">{item.title}</h2>
                            <p className="flex text-justify text-[17px] text-[#696984] leading-loose whitespace-pre-line ">{item.text}</p>
                        </div>
                    ))}
                </div>
                <div id="right" className="flex w-1/2 flex-col justify-start items-end gap-[7%] ">
                    <Image src="/images/publications/bus.svg" alt="Transportes" width={500} height={500} />
                    <div className='flex justify-center items-center bg-[#D9D9D9] h-[25%] w-[55%]'>
                        <p className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mb-[2%]">GOOGLE</p>
                    </div>
                    <div className='flex flex-row w-full justify-end'>
                        <div className='flex w-[72%]  flex-col '>
                            <Contact/>
                            <RelatedPublications/>
                        </div>
                    </div>
                </div>   
                
            </div>
            <div id="bottom-transport-page" className='px-[7%]' >
                <h2 className=" px-[2%] font-bold text-[26px] lg:text-[32px] text-[#A90920] mb-[2%] ">ATUAMOS TAMBÉM</h2>
                <div className='w-full bg-[#999999] h-[1.5px]'></div>
                <div className='flex flex-row gap-10 h-[70%]'>
                    <div className="flex flex-col lg:flex-row gap-10 md:max-w-[30%] lg:max-w-[33%] mb-4 lg:mb-14 mt-[3%] rounded-3xl shadow-xl">
                        <Cards 
                            title='RODOVIAS'
                            description='Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.'
                            image='/images/publications/publication1.svg'
                            path='#'
                        />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-10 md:max-w-[30%] lg:max-w-[33%] mb-4 lg:mb-14 mt-[3%] rounded-3xl shadow-xl">
                        <Cards 
                            title='PORTOS'
                            description='Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.'
                            image='/images/publications/publication1.svg'
                            path='#'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransportPage; 
