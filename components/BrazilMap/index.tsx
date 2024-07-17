import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { ChartAPIService } from '@/lib/services/chart/chartAPIService';

const BrazilMap: React.FC = () => {
    const [mapData, setMapData] = useState<any[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const chartService = ChartAPIService.getInstance();
                const rawData = await chartService.getAllIndicatorsStateChartData();

                // Pegando as cores
                const extractedColors = rawData
                    .slice(1)
                    .map((row: string[]) => row[1])
                    .filter((color: string) => color !== '');
                setColors(extractedColors);

                // Pegando os estados e IDH
                const transformedData = [
                    ['State', 'IDH'],
                    ...rawData.slice(1).map((row: string[]) => {
                        const stateName = row[2];
                        const idh = parseFloat(row[3].replace(',', '.')); // Os números na tabela tem , ...
                        return [stateName, idh];
                    })
                ];

                setMapData(transformedData);
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const geoChartOptions = {
        region: 'BR',
        resolution: 'provinces',
        colorAxis: {
            values: [0.5, 0.6, 0.66, 0.75, 1],
            colors: colors,
        },
        backgroundColor: '#ffffff',
        datalessRegionColor: '#ffffff',
        defaultColor: '#ffffff',
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="relative h-full w-full bg-gray-100 rounded-lg overflow-hidden">
            <Chart
                chartType="GeoChart"
                width="100%"
                height="100%"
                data={mapData}
                options={geoChartOptions}
            />
        </div>
    );
};

export default BrazilMap;