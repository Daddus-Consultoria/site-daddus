import { IndicatorsMenuPage } from "@/components/index";

import { ChartUseCases } from "@/lib/useCases/chartUseCases";

export default async function IndicatorsPage() {
  const useChartCase = new ChartUseCases();
  const getData = async () => {
  "use server";
  const [graphicData, mapData] = await Promise.all([
    useChartCase.gettAllIndicatorsDaddusGraphData(),
    useChartCase.getAllIndicatorsStateChartData(),
  ]);
  return { graphicData, mapData };
  }

  const { graphicData, mapData } = await getData();

  return (
    <div>
      <IndicatorsMenuPage graphicData={graphicData} mapData={mapData} />
    </div>
  );
}
