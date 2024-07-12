"use client";

import React, { useState } from 'react';
import { constantsIndicators, filtersIndicatorPage } from './_constants';
import Image from 'next/image';
import { IndicatorFilter, Graphic } from '@/components/index';
import {Tabs, TabsList, TabsContent, TabsTrigger} from '@/components/ui/index'
import { useQuery } from '@tanstack/react-query';
import { ChartUseCases } from '@/lib/useCases/chartUseCases'

const IndicatorsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'idh' | 'ipca'>('idh');

  const toggleSection = () => {
    setActiveSection(prev => prev === 'idh' ? 'ipca' : 'idh');
  };

  const useChartCase = new ChartUseCases();

  const {data, isLoading} = useQuery({
    queryKey: ['chart'],
    queryFn: async () => {
      return await useChartCase.gettAllIndicatorsDaddusGraphData();
    }
  })

  var itemsGraphic = data!;

  const currentSection = constantsIndicators.sections.find(section => section.id === activeSection);

  if (!currentSection) {
    return <div>Section not found</div>;
  }

  return (
    <Tabs defaultValue='maps' className="container mx-auto px-8 py-12 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3 md:border-r md:border-gray-400 pr-8">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-bold text-primary">{currentSection.title}</h1>
            <p className="text-sm font-semibold text-gray-700 mb-4">{currentSection.dataSource}</p>
            <p className="mb-8">{currentSection.description}</p>
            <TabsContent value='maps' className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentSection.images.map((image, index) => (
                <div key={index} className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <Image 
                    src={image.src}
                    alt={image.alt}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              ))}
            </TabsContent>
            <TabsContent value='graphics' className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Graphic data={itemsGraphic}/>
            </TabsContent>
          </div>
        </div>
        
        <div className='flex justify-start flex-1 flex-col gap-9 '>
          <TabsList className='grid w-full grid-cols-2 font-bold'>
            <TabsTrigger value="maps">MAPAS</TabsTrigger>
            <TabsTrigger value="graphics">GRÁFICOS</TabsTrigger>
          </TabsList>
          <div className='flex flex-1 flex-col'>
            {filtersIndicatorPage.items.map((item, index) => {
              return (
                  <TabsContent key={`tab-indicator-${item.value}-${index}`} value={item.value} className='flex flex-col gap-2'>
                    {item.content.map((contentAux, index)=>{
                      return <IndicatorFilter key={`indicator-filter-${item.value}-${index}`} title={contentAux.title} items={contentAux.items} placeholder={contentAux.placeholder}/>
                    })}
                  </TabsContent>
              )
            })}
          </div>
        </div>
        
      </div>
    </Tabs>
  );
};

export default IndicatorsPage;