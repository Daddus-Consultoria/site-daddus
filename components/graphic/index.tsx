import { Chart } from 'react-google-charts'

interface GraphicProps {
    data: any[],
}

const Graphic = ({data}: GraphicProps) => {
    /* const data = [
        ['Month', 'Sales'],
        ['Jan', 1000],
        ['Feb', 1170],
        ['Mar', 660],
        ['Apr', 1030],
      ]; */
    
    console.log(data)

    const options = {
        title: 'Variação mensal - Brasil',
        curveType: 'function',
        legend: { position: 'bottom' },
    };

    return (
    <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
    />
    );
}

export {Graphic}