import { Chart } from 'react-google-charts'
import { DataSpreadSheetsGraphic } from "@/lib/interfaces/dataGraphic"

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
    

   /*  const transformData = (data: DataSpreadSheetsGraphic) =>{
        return [parseInt(data.dataGraph[4]), parseFloat(data.dataGraph[5].replace(',','.'))]
    }  

    const listData = data.map((item:any) => {
        return transformData(item)
    })

    const dataFinal = [
        ['Ano', 'Porcentagem'],
        ...listData,
    ] */

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

