import { IndicatorsMenuPage } from "@/components/index";

import { ChartUseCases } from "@/lib/useCases/chartUseCases";

export default async function IndicatorsPage() {
  const useChartCase = new ChartUseCases();
  // This is a Promise.all that will fetch the data from the API and return it to the component
  const [graphicData, mapData] = await Promise.all([
    useChartCase.gettAllIndicatorsDaddusGraphData(),
    useChartCase.getAllIndicatorsStateChartData(),
  ]);
  return (
    <div>
      <IndicatorsMenuPage graphicData={graphicData} mapData={mapData} />
    </div>
  );
}
