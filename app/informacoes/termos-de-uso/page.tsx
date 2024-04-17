'use client'
import {constantsTermsOfUse} from './_constants'
import Image from 'next/image'
import { Contact, RelatedPublications, Cards } from '@/components/index'
import { title } from 'process'

import { twMerge } from "tailwind-merge"


const TermsOfUse = () =>{
    const relatedPublications = [
        {
            title: 'Citolologia: um estudo demográfico de  duas ou três linhas ',
            link: '#',
        },
        {
            title: 'Perspectivas de Mercado: Bitcoin e o mercado bovino. Onde vamos parar?',
            link: '#',
        }
    ]

    return (
        <div className="flex flex-1 flex-col">
            <div id="top-transport-page" className="flex flex-col w-full md:w-[70%] h-full py-[2%] px-[9%] mb-[2%] gap-[2%] lg:gap-[10%] ">
                <h2  className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mb-[2%] mt-[5%]">{constantsTermsOfUse.title}</h2>
                <p className="flex text-justify text-[15px] text-[#696984] leading-loose whitespace-pre-line ">{constantsTermsOfUse.text1}</p>
                <br />
                <p className="flex text-justify text-[15px] text-[#696984] leading-loose whitespace-pre-line ">{constantsTermsOfUse.titleDeclaration}</p>
                <br />
                <ol className='list-decimal text-justify text-[15px] text-[#696984] leading-loose whitespace-pre-line'>
                    {constantsTermsOfUse.declarations.map((item, index) => (
                        <li className='ml-[3%]' key={`item-declaration-${index}`}>{item}</li>
                    ))}
                </ol>
                <br />
                <p className="flex text-justify text-[15px] text-[#696984] leading-loose whitespace-pre-line ">{constantsTermsOfUse.text2}</p>
                <ol className='list-decimal text-justify text-[15px] text-[#696984] leading-loose whitespace-pre-line'>
                    <br />
                    {constantsTermsOfUse.topics.map((item, index) => {
                        const styleList = 'list-'+item.typeSublist;
                        return (
                            <div>
                            <li className='ml-[3%]' key={`item-declaration-${index}`}>{item.title}</li>
                            <br />
                            <p className="flex text-justify text-[15px] text-[#696984] leading-loose whitespace-pre-line ">{item.textBeforeSubList}</p>
                            <br />
                            {item.sublist && (
                                <div>
                                    <ol className={styleList}>
                                        {item.sublist.map((itemSub, indexSub) => (
                                            <li className='ml-[3%]' key={`subitem-sublist-${indexSub}`}>{itemSub}</li>
                                        ))}
                                    </ol>
                                    <br />
                                </div>
                            )}
                            
                            <p className="flex text-justify text-[15px] text-[#696984] leading-loose whitespace-pre-line ">{item.textAfter}</p>
                            <br />
                        </div>
                        )
                    })}
                </ol>
            </div>
        </div>
    )
}

export default TermsOfUse; 
