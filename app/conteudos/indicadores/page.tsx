"use client";
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { filtersIndicatorPage } from './_constants';
import { IndicatorFilter, Graphic } from '@/components/index';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/index'
import { ChartUseCases } from '@/lib/useCases/chartUseCases'
import BrazilMap from "@/components/brazilMap";
import IndicatorsTable from "@/components/indicatorsTable";
import { ButtonTextArrow } from '@/components/buttonTextArrow';

const IndicatorsPage: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('maps');
    const [data, setData] = useState<{
        graphic: any[],
        idh: { data: any[], colors: string[] } | null
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const useChartCase = useMemo(() => new ChartUseCases(), []);

    const fetchData = useCallback(async () => {
        try {
            const [graphicData, mapData] = await Promise.all([
                useChartCase.gettAllIndicatorsDaddusGraphData(),
                useChartCase.getAllIndicatorsStateChartData()
            ]);
            setData({
                graphic: graphicData,
                idh: { data: mapData[0], colors: mapData[1] }
            });
        } catch (err) {
            setError('Falha ao buscar dados');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [useChartCase]);

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    useEffect(() => {
        const slug = 'maps';
            setActiveTab(slug);
    }, []);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.push(`?slug=${value}`);
    };

    const mapTableHeaders: [string, string] = ["Estado", "IDH"];

    const renderContent = (content: React.ReactNode) => (
        isLoading ? (
            <div className="flex items-center justify-center h-full">Carregando dados...</div>
        ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">Erro ao carregar dados</div>
        ) : content
    );

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="container mx-auto px-8 py-12 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* MAPS */}
                <TabsContent value='maps' className="md:col-span-3 md:border-r md:border-gray-400 pr-8">
                    <div className="bg-white shadow-md rounded-lg p-8">
                        <h1 className="text-3xl font-bold text-primary">{filtersIndicatorPage.items[0].title}</h1>
                        <p className="text-sm font-semibold text-gray-700 mb-4">{filtersIndicatorPage.items[0].subTitle}</p>
                        <p className="mb-8">{filtersIndicatorPage.items[0].text}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                            <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden col-span-12 lg:col-span-8">
                                {renderContent(<BrazilMap data={data?.idh?.data ?? []} colors={data?.idh?.colors ?? []} />)}
                            </div>
                            <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden col-span-12 lg:col-span-4">
                                {renderContent(<IndicatorsTable data={data?.idh?.data ?? []} headers={mapTableHeaders} />)}
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
                        <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
                            {renderContent(data && <Graphic data={data.graphic} />)}
                        </div>
                    </div>
                </TabsContent>

                <div className='flex justify-start flex-1 flex-col gap-9 '>
                    <TabsList className='grid w-full grid-cols-2 font-bold'>
                        <TabsTrigger value="maps">MAPAS</TabsTrigger>
                        <TabsTrigger value="graphics">GRÁFICOS</TabsTrigger>
                    </TabsList>
                    <div className='flex flex-1 flex-col'>
                        {filtersIndicatorPage.items.map((item, index) => (
                            <TabsContent key={`tab-indicator-${item.value}-${index}`} value={item.value} className='flex flex-col gap-2'>
                                {item.content.map((contentAux, contentIndex) => (
                                    <IndicatorFilter
                                        key={`indicator-filter-${item.value}-${contentIndex}`}
                                        title={contentAux.title}
                                        items={contentAux.items}
                                        placeholder={contentAux.placeholder}
                                    />
                                ))}
                                <div className='flex flex-1 flex-col mt-12 w-[90%]'>
                                    <strong className='text-primary text-sm mb-2'>Veja todas as nossas publicações:</strong>
                                    {filtersIndicatorPage.publicationButtons.map((button, index) => (
                                        <ButtonTextArrow
                                            key={index}
                                            text={button.text}
                                            onClick={() => window.location.href = button.path}
                                            variant="outline"
                                            className="bg-primary text-primary-foreground rounded-lg mb-2"
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                        ))}
                    </div>
                </div>
            </div>
        </Tabs>
    );
};

export default IndicatorsPage;