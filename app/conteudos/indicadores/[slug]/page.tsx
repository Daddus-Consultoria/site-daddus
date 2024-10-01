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


/*"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { IndicatorsMenuPage } from "@/components/index";
const SlugPage: React.FC<{ graphicData: any[]; mapData: any }> = ({ graphicData, mapData }) => {
    const router = useRouter();
    const urlPath = usePathname();
    const slug = urlPath?.split("/").pop();
    const [activeTab, setActiveTab] = useState<string>(slug || "maps");
    useEffect(() => {
        if (slug) {
            setActiveTab(slug);
        } else {
            router.push("/conteudos/indicadores/maps");
        }
    }, [slug, router]);
    return (
        <IndicatorsMenuPage
            initialTab={activeTab}
        />
    );
};
export default SlugPage;
*/



/*
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import IndicatorsPage from "../page"; // Adjust the path if necessary

const SlugPage: React.FC = () => {
    const router = useRouter();
    const urlPath = usePathname();
    const slug = urlPath?.split("/").pop();

    const [activeTab, setActiveTab] = useState<string>(slug || "maps");

    useEffect(() => {
        if (slug) {
            setActiveTab(slug);
        } else {
            router.push("/conteudos/indicadores/maps");
        }
    }, [slug, router]);

    return (
        <IndicatorsPage
            initialTab={activeTab}
        />
    );
};

export default SlugPage;
*/