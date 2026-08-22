import { ChartUseCases } from "@/lib/useCases/chartUseCases";
import { IndicatorsMenuPage } from "@/components/index";
import { notFound } from "next/navigation";

const validTabs = ["maps", "graphics"];

export default async function SlugPage({ params }: { params: { slug: string } }) {
    const slug = params.slug;

    if (!validTabs.includes(slug)) {
        notFound();
    }

    const useChartCase = new ChartUseCases();
    const [graphicData, mapData] = await Promise.all([
        useChartCase.gettAllIndicatorsDaddusGraphData(),
        useChartCase.getAllIndicatorsStateChartData(),
    ]);

    return (
        <IndicatorsMenuPage
            graphicData={graphicData}
            mapData={mapData}
            initialTab={slug}
        />
    );
}