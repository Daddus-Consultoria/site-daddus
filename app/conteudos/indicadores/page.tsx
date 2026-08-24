import { IndicatorsMenuPage } from "@/components/index";

import { ChartUseCases } from "@/lib/useCases/chartUseCases";
import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Indicadores",
  description:
    "Gráficos e mapas de indicadores municipais e estaduais organizados pela Daddus a partir de bases públicas.",
  path: "/conteudos/indicadores",
});

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
