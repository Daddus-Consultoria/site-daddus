import { IndicatorsMenuPage } from "@/components/index";

import { ChartUseCases } from "@/lib/useCases/chartUseCases";

export default async function IndicatorsPage() {
  const useChartCase = new ChartUseCases();
  // const [graphicData, mapData] = await Promise.all([
  //   useChartCase.gettAllIndicatorsDaddusGraphData(),
  //   useChartCase.getAllIndicatorsStateChartData(),
  // ]);
  const graphicData:any[] = [];
  const mapData:any[] = [];

  return (
    <div>
      <IndicatorsMenuPage graphicData={graphicData} mapData={mapData} />
    </div>
  );
}
