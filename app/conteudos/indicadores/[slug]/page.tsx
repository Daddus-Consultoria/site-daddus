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
