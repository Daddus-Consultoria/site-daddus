import { IndicatorsMenuPage } from "@/components/index";

import { ChartUseCases } from "@/lib/useCases/chartUseCases";

export default async function IndicatorsPage () {
  const useChartCase = new ChartUseCases();
  const [graphicData, mapData] = await Promise.all([
    useChartCase.gettAllIndicatorsDaddusGraphData(),
    useChartCase.getAllIndicatorsStateChartData(),
  ]);


  return (
    <div>
      <IndicatorsMenuPage graphicData={graphicData} mapData={mapData}/>
    </div>
  )
};

