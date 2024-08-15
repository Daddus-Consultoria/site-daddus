import { Chart } from 'react-google-charts'

interface GraphicProps {
    data: any[],
}

const Graphic = ({data}: GraphicProps) => {
    const options = {
        title: 'Variação mensal - Brasil',
        curveType: 'none',
        legend: { position: 'none'},
        pointSize: 5,
        lineWidth: 2,
        hAxis: {
            title: 'Ano',
            format: '#', 
            slantedText: true, // Inclina os textos para melhor visualização
            slantedTextAngle: 45, // Ângulo de inclinação
        },
        vAxis: {
            title: 'Porcentagem',
            minValue: -1000,
            maxValue: 3000,
            format: '#', // Formato decimal sem vírgula
        },
        series: {
            0: { color: 'black' }, // Define a cor da linha para preto
        },
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

