import { Chart } from 'react-google-charts';

interface BrazilMapProps {
    data: any[];
    colors: string[];
}


const BrazilMap: React.FC<BrazilMapProps> = ({ data, colors }) => {
    const geoChartOptions = {
        region: 'BR',
        resolution: 'provinces',
        colorAxis: {
            values: [0.5, 0.6, 0.66, 0.75, 1],
            colors: colors,
        },
        backgroundColor: '#ffffff',
        datalessRegionColor: 'transparent',
        defaultColor: '#ffffff',
    };

    const chartData = [['State', 'IDH'], ...data];

    return (
        <div className="relative h-full w-full bg-gray-100 rounded-lg overflow-hidden">
            <Chart
                chartType="GeoChart"
                width="100%"
                height="100%"
                data={chartData}
                options={geoChartOptions}
            />
        </div>
    );
};

export default BrazilMap;