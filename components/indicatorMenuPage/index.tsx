'use client';
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { filtersIndicatorPage } from "./_constants";
import { IndicatorFilter, Graphic } from "@/components/index";
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/index";
import { ChartUseCases } from "@/lib/useCases/chartUseCases";
import BrazilMap from "@/components/brazilMap";
import IndicatorsTable from "@/components/indicatorsTable";
import { ButtonTextArrow } from "@/components/buttonTextArrow";
import { DataSpreadSheetsGraphic } from "@/lib/interfaces/dataGraphic";

interface IndicatorMenuProps {
  graphicData: any[];
  mapData: { [key: string]: [any[], string[]] };
  initialTab?: string;
}

export const IndicatorsMenuPage = ({ graphicData, mapData, initialTab = "maps" }: IndicatorMenuProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedYear, setSelectedYear] = useState<string>("2021");
  // Mapa
  const [data, setData] = useState<{
    graphic: any[];
    idh: { [key: string]: { data: any[]; colors: string[] } } | null;
  } | null>();
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const useChartCase = useMemo(() => new ChartUseCases(), []);

  const [filterUF, setFilterUF] = useState<string>("BR");
  const [filterMunicipality, setFilterMunicipality] =
    useState<string>("MACEIÓ");

  // dados filtrados - gráfico
  const [allDataFiltered, setallDataFiltered] = useState<DataSpreadSheetsGraphic[]>([]);

  const [states, setStates] = useState<string[]>([]);
  const [municipality, setMunicipality] = useState<string[]>([]);
  // mp - gráfico
  const [dataGraphic, setDataGraphic] = useState<any[]>([]);

  const idhData = Object.keys(mapData).reduce((acc: { [key: string]: { data: any, colors: any } }, year) => {
    acc[year] = { data: mapData[year][0], colors: mapData[year][1] };
    return acc;
  }, {});

  const transformData = (data: DataSpreadSheetsGraphic) => { // bote essa função no topo e funcionou aksdkas
    return [
      parseInt(data.dataGraphic[3]),
      parseFloat(data.dataGraphic[4].replace(",", ".")),
    ];
  };

  const setMapData = useCallback(async () => {
    try {
      setData({
        graphic: graphicData,
        idh: idhData,
      });
    } catch (err) {
      setError("Falha ao buscar dados");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [useChartCase]);

  const setGraphicData = async () => {
    const data = graphicData;

    await setallDataFiltered(data);

    const getUniqueStates = (
      dataArray: DataSpreadSheetsGraphic[],
      position: number
    ): string[] => {
      const stateSet = new Set<string>();
      dataArray.forEach((obj) => {
        
        if (obj.dataGraphic.length >= 6) {
          const state = obj.dataGraphic[position];
          stateSet.add(state);
        }
      });
      return Array.from(stateSet);
    };

    const uniqueStates = getUniqueStates(data, 5);
    const uniqueMunicipality = getUniqueStates(data, 6);

    setStates(uniqueStates);
    setMunicipality(uniqueMunicipality);

    const listData = data.map((item: DataSpreadSheetsGraphic) => {
      return transformData(item);
    });

    setDataGraphic([["Ano", "Porcentagem"], ...listData]);
    setIsLoading(false);
  };
  
  useEffect(() => {
    setActiveTab(initialTab);
    setMapData();
    setGraphicData();
  }, [initialTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/conteudos/indicadores/${value}`);
  };
  

  useEffect(() => {
    var listData: any[] = [];
    allDataFiltered.map((item: DataSpreadSheetsGraphic) => {
      if (item.dataGraphic[5] === filterUF) {
        listData.push(transformData(item));
      }
    });

    setDataGraphic([["Ano", "Porcentagem"], ...listData]);
  }, [filterUF]);

  useEffect(() => {
    var listData: any[] = [];
    allDataFiltered.map((item: DataSpreadSheetsGraphic) => {
      if (item.dataGraphic[6] === filterMunicipality) {
        listData.push(transformData(item));
      }
    });

    setDataGraphic([["Ano", "Porcentagem"], ...listData]);
  }, [filterMunicipality]);


  const mapTableHeaders: [string, string] = ["Estado", "IDH"];

  const renderContent = (content: React.ReactNode) =>
    isLoading ? (
      <div className="flex items-center justify-center h-full">
        Carregando dados...
      </div>
    ) : error ? (
      <div className="flex items-center justify-center h-full text-red-500">
        Erro ao carregar dados
      </div>
    ) : (
      content
    );

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="container mx-auto px-8 py-12 max-w-7xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* MAPS */}
        <TabsContent
          value="maps"
          className="md:col-span-3 md:border-r md:border-gray-400 pr-8"
        >
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-bold text-primary">
              {filtersIndicatorPage.items[0].title}
            </h1>
            <p className="text-sm font-semibold text-gray-700 mb-4">
              {filtersIndicatorPage.items[0].subTitle}
            </p>
            <p className="mb-8">{filtersIndicatorPage.items[0].text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden col-span-12 lg:col-span-8">
                {renderContent(
                  <BrazilMap
                    data={data?.idh?.[selectedYear]?.data ?? []}
                    colors={data?.idh?.[selectedYear]?.colors ?? []}
                  />
                )}
              </div>
              <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden col-span-12 lg:col-span-4">
                {renderContent(
                  <IndicatorsTable
                    data={data?.idh?.[selectedYear]?.data ?? []}
                    headers={mapTableHeaders}
                  />
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        {/* GRAPHIC */}
        <TabsContent
          value="graphics"
          className="md:col-span-3 md:border-r md:border-gray-400 pr-8"
        >
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-bold text-primary">
              {filtersIndicatorPage.items[1].title}
            </h1>
            <p className="text-sm font-semibold text-gray-700 mb-4">
              {filtersIndicatorPage.items[1].subTitle}
            </p>
            <p className="mb-8">{filtersIndicatorPage.items[1].text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
              <div className="relative h-72 md:h-96 rounded-lg overflow-hidden col-span-12 lg:col-span-9">
                {renderContent(
                  <Graphic data={dataGraphic} />
                )}
              </div>
              <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden col-span-12 lg:col-span-3">
                {renderContent(
                  <IndicatorsTable
                    data={dataGraphic.slice(1)}
                    headers={dataGraphic[0]}
                  />
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <div className="flex justify-start flex-1 flex-col gap-9 ">
          <TabsList className="grid w-full grid-cols-2 font-bold">
            <TabsTrigger value="maps">MAPAS</TabsTrigger>
            <TabsTrigger value="graphics">GRÁFICOS</TabsTrigger>
          </TabsList>
          <div className="flex flex-1 flex-col">
            {filtersIndicatorPage.items.map((item, index) => {
              return item.value === "maps" ? (
                <TabsContent
                  key={`tab-indicator-${item.value}-${index}`}
                  value={item.value}
                  className="flex flex-col gap-2"
                >
                  <IndicatorFilter
                    key={`indicator-filter-${item.value}-${0}`}
                    title={item.content[0].title}
                    items={item.content[0].items}
                    placeholder={"IDH"}
                    setFilter={() => {}}
                  />
                  <IndicatorFilter
                    key={`indicator-filter-${item.value}-${1}`}
                    title={item.content[1].title}
                    items={item.content[1].items}
                    placeholder={item.content[1].placeholder}
                    setFilter={setSelectedYear}
                  />
                  <div className="flex flex-1 flex-col mt-12 w-[90%]">
                    <strong className="text-primary text-sm mb-2">
                      Veja todas as nossas publicações:
                    </strong>
                    {filtersIndicatorPage.publicationButtons.map(
                      (button, index) => (
                        <ButtonTextArrow
                          key={index}
                          text={button.text}
                          onClick={() => (window.location.href = button.path)}
                          variant="outline"
                          className="bg-primary text-primary-foreground rounded-lg mb-2"
                        />
                      )
                    )}
                  </div>
                </TabsContent>
              ) : (
                <TabsContent
                  key={`tab-indicator-${item.value}-${index}`}
                  value={item.value}
                  className="flex flex-col gap-2"
                >
                  <IndicatorFilter
                    key={`indicator-filter-${item.value}-${0}`}
                    title={item.content[0].title}
                    items={item.content[0].items}
                    placeholder={"IBGE"}
                    setFilter={() => {}}
                  />
                  <IndicatorFilter
                    key={`indicator-filter-${item.value}-${1}`}
                    title={item.content[1].title}
                    items={item.content[1].items}
                    placeholder={"IPCA-15"}
                    setFilter={() => {}}
                  />
                  {states[0] != undefined ? (
                    <IndicatorFilter
                      key={`indicator-filter-${item.value}-${2}`}
                      title={item.content[2].title}
                      items={states}
                      placeholder={filterUF}
                      setFilter={setFilterUF}
                    />
                  ) : null}
                  {municipality[0] != undefined ? (
                    <IndicatorFilter
                      key={`indicator-filter-${item.value}-${3}`}
                      title={item.content[3].title}
                      items={municipality}
                      placeholder={filterMunicipality}
                      setFilter={setFilterMunicipality}
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col mt-12 w-[90%]">
                    <strong className="text-primary text-sm mb-2">
                      Veja todas as nossas publicações:
                    </strong>
                    {filtersIndicatorPage.publicationButtons.map(
                      (button, index) => (
                        <ButtonTextArrow
                          key={index}
                          text={button.text}
                          onClick={() => (window.location.href = button.path)}
                          variant="outline"
                          className="bg-primary text-primary-foreground rounded-lg mb-2"
                        />
                      )
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </div>
        </div>
      </div>
    </Tabs>
  );
};

