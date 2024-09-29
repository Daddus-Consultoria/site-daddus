"use client";
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
            mapData={mapData}
            graphicData={graphicData}
            initialTab={activeTab}
        />
    );
};
export default SlugPage;