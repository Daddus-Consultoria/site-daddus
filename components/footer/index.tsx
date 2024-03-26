'use client'
import React from 'react'
import { Label } from '../ui/label'
import Image from "next/image";

export function Footer(){
    return (
        <div className='w-full h-80 bg-[#2B2B2B]'>
            <div className='flex flex-row w-full h-3/4 pl-[15%]'>
                <div className='flex bg-white w-[420px] h-full justify-center items-center'>
                    <Image alt="Logo" src="/images/logos/daddus.svg" width={230} height={50}/>
                </div>
                <div className='flex flex-row pl-[8%] justify-center items-center'>
                    <div className='flex md:flex-row sm:flex-col md:gap-20 sm:gap-2'>
                        <div className='flex flex-col gap-1'>
                            <Label className='font-bold text-[#A90920] text-[16px]'>Serviços</Label>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-medium text-white text-[12px]'>Consultoria</Label>
                                <Label className='font-medium text-white text-[10px]'> • Elaboração de Políticas Públicas</Label>
                                <Label className='font-medium text-white text-[10px]'> • Estudos de Viabilidade Econômico-Financeiro</Label>
                                <Label className='font-medium text-white text-[10px]'> • Modelagem de Projetos</Label>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-medium text-white text-[12px]'>Desenvolvimento de sistemas</Label>
                                <Label className='font-medium text-white text-[10px]'> • Compasso</Label>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <Label className='font-bold text-[#A90920] text-[16px]'>Setores</Label>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-medium text-white text-[12px]'>Mobilidade Urbana</Label>
                                <Label className='font-medium text-white text-[10px]'> • Transportes</Label>
                                <Label className='font-medium text-white text-[10px]'> • Rodovias</Label>
                                <Label className='font-medium text-white text-[10px]'> • Portos</Label>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <Label className='font-bold text-[#A90920] text-[16px]'>Conteúdos</Label>
                            <Label className='font-medium text-white text-[12px]'>Blog</Label>
                            <Label className='font-medium text-white text-[12px]'>Estudos</Label>
                            <Label className='font-medium text-white text-[12px]'>Guias</Label>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-medium text-white text-[12px]'>Publicações</Label>
                                <Label className='font-medium text-white text-[10px]'> • Perfil Social dos Municípios</Label>
                                <Label className='font-medium text-white text-[10px]'> • Perfil Eleitoral dos Municípios</Label>
                                <Label className='font-medium text-white text-[10px]'> • Perfil Econômico dos Municípios</Label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-row items-center justify-between px-[15%] w-full md:h-1/4 bg-[#A90920]'>
                <div>
                    <Label className='font-medium text-white text-[14px]'>© 2024 Daddus Consultoria - Todos os direitos reservados.</Label>
                </div>
                <div className='flex flex-row gap-4'>
                    <div>
                        <Label className='font-medium text-white text-[16px]'>SOBRE NÓS</Label>
                    </div>
                    <div>
                        <Label className='font-medium text-white text-[16px]'>TERMOS DE USO</Label>
                    </div>
                    <div>
                        <Label className='font-medium text-white text-[16px]'>CONTATO</Label>
                    </div>
                </div>
            </div>
        </div>
    )
}