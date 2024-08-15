"use client";

import React, { useEffect, useState } from 'react';
import { constantsIndicators, filtersIndicatorPage } from './_constants';
import Image from 'next/image';
import { IndicatorFilter, Graphic } from '@/components/index';
import {Tabs, TabsList, TabsContent, TabsTrigger} from '@/components/ui/index'
import { useQuery } from '@tanstack/react-query';
import { ChartUseCases } from '@/lib/useCases/chartUseCases'
import BrazilMap from "@/components/BrazilMap";
import IDHTable from "@/components/IDHTable";
import { DataSpreadSheetsGraphic } from "@/lib/interfaces/dataGraphic"

const IndicatorsPage: React.FC = () => {
  const [dataGraphic, setDataGraphic] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<'idh' | 'ipca'>('idh');

  const [filterUF, setFilterUF] = useState<string>("BR");
  const [filterMunicipality, setFilterMunicipality] = useState<string>("MACEIÓ");
  const [allData, setAllData] = useState<DataSpreadSheetsGraphic[]>([]);

  const [states, setStates] = useState<string[]>([]);
  const [municipality, setMunicipality] = useState<string[]>([]);

  const toggleSection = () => {
    setActiveSection((prev) => (prev === "idh" ? "ipca" : "idh"));
  };

  const useChartCase = new ChartUseCases();

  const transformData = (data: DataSpreadSheetsGraphic) =>{
    return [parseInt(data.dataGraphic[3]), parseFloat(data.dataGraphic[4].replace(',','.'))]
  }  

  const fetchData = async () =>{
    const data = await useChartCase.gettAllIndicatorsDaddusGraphData()
    
    setAllData(data)

    // here we will have some positions defined according to the table, so it is necessary to change the table 
    // (or page) and also change the values ​​that are relative to the positions

    const getUniqueStates = (dataArray: DataSpreadSheetsGraphic[], position: number): string[] => {
      // Create a set to store unique states
      const stateSet = new Set<string>();
    
      // Iterate through each object in the array
      dataArray.forEach(obj => {
        // Check if dataGraphic has at least 6 elements
        if (obj.dataGraphic.length >= 6) {
          // Get the state at position 5
          const state = obj.dataGraphic[position];
    
          // Add the state to the set
          stateSet.add(state);
        }
      });
    
      // Convert the set to an array
      return Array.from(stateSet);
    };

    const uniqueStates = getUniqueStates(data, 5);
    const uniqueMunicipality = getUniqueStates(data, 6);

    setStates(uniqueStates);
    setMunicipality(uniqueMunicipality);

    const listData = data.map((item:DataSpreadSheetsGraphic) => {
        return transformData(item)
    })

    setDataGraphic([
      ['Ano', 'Porcentagem'],
      ...listData,]
    )
  }

  useEffect(() => {
    var listData: any[] = []
    allData.map((item:DataSpreadSheetsGraphic) => {
      if(item.dataGraphic[5] === filterUF){
        listData.push(transformData(item))
      }
    })
    
    setDataGraphic([
      ['Ano', 'Porcentagem'],
      ...listData,]
    )
  },[filterUF])

  useEffect(() => {
    var listData: any[] = []
    allData.map((item:DataSpreadSheetsGraphic) => {
      if(item.dataGraphic[6] === filterMunicipality){
        listData.push(transformData(item))
      }
    })
    
    setDataGraphic([
      ['Ano', 'Porcentagem'],
      ...listData,]
    )
  },[filterMunicipality])

  useEffect(() => {
    try{
      fetchData()
    }catch(e){
      console.log(e)
    }
  }, [])

  const currentSection = constantsIndicators.sections.find(section => section.id === activeSection);

  if (!currentSection) {
    return <div>Section not found</div>;
  }

  return (
    <Tabs defaultValue='maps' className="container mx-auto px-8 py-12 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* MAPS */}
        <TabsContent value='maps' className="md:col-span-3 md:border-r md:border-gray-400 pr-8">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-bold text-primary">{filtersIndicatorPage.items[0].title}</h1>
            <p className="text-sm font-semibold text-gray-700 mb-4">{filtersIndicatorPage.items[0].subTitle}</p>
            <p className="mb-8">{filtersIndicatorPage.items[0].text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden col-span-12 lg:col-span-8">
                  <BrazilMap />
                </div>

                <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden col-span-12 lg:col-span-4">
                  <IDHTable />
                </div>

            </div>
          </div>
        </TabsContent>
        {/* GRAPHIC */}
        <TabsContent value='graphics' className="md:col-span-3 md:border-r md:border-gray-400 pr-8">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-bold text-primary">{filtersIndicatorPage.items[1].title}</h1>
            <p className="text-sm font-semibold text-gray-700 mb-4">{filtersIndicatorPage.items[1].subTitle}</p>
            <p className="mb-8">{filtersIndicatorPage.items[1].text}</p>
            <div className="relative h-72 md:h-[25rem] bg-gray-100 rounded-lg overflow-hidden">
              <Graphic data={dataGraphic}/>
            </div>
          </div>
        </TabsContent>
        
        <div className='flex justify-start flex-1 flex-col gap-9 '>
          <TabsList className='grid w-full grid-cols-2 font-bold'>
            <TabsTrigger value="maps">MAPAS</TabsTrigger>
            <TabsTrigger value="graphics">GRÁFICOS</TabsTrigger>
          </TabsList>
          <div className='flex flex-1 flex-col'>
            {filtersIndicatorPage.items.map((item, index) => {
              return item.value === 'maps' ? (
                  <TabsContent key={`tab-indicator-${item.value}-${index}`} value={item.value} className='flex flex-col gap-2'>
                      <IndicatorFilter key={`indicator-filter-${item.value}-${0}`} title={item.content[0].title} items={item.content[0].items} placeholder={"IDH"} setFilter={()=>{}}/>
                      <IndicatorFilter key={`indicator-filter-${item.value}-${1}`} title={item.content[1].title} items={item.content[1].items} placeholder={"IDH"} setFilter={()=>{}}/>
                  </TabsContent>
              ) : (
                <TabsContent key={`tab-indicator-${item.value}-${index}`} value={item.value} className='flex flex-col gap-2'>
                  <IndicatorFilter key={`indicator-filter-${item.value}-${0}`} title={item.content[0].title} items={item.content[0].items} placeholder={"IBGE"} setFilter={()=>{}}/>
                  <IndicatorFilter key={`indicator-filter-${item.value}-${1}`} title={item.content[1].title} items={item.content[1].items} placeholder={"IPCA-15"} setFilter={()=>{}}/>
                  {states[0]!=undefined ? <IndicatorFilter key={`indicator-filter-${item.value}-${2}`} title={item.content[2].title} items={states} placeholder={filterUF} setFilter={setFilterUF}/> : null}
                  {municipality[0]!=undefined ? <IndicatorFilter key={`indicator-filter-${item.value}-${3}`} title={item.content[3].title}  items={municipality} placeholder={filterMunicipality} setFilter={setFilterMunicipality}/> : null}    
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