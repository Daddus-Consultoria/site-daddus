import { IndicatorsMenuPage } from "@/components/index";

import { ChartUseCases } from "@/lib/useCases/chartUseCases";

export const IndicatorsPage = async () => {
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

export default IndicatorsPage;