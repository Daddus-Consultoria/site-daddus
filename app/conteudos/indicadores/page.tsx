"use client";
import React, { useState } from "react";
import { constantsIndicators } from "./_constants";
import BrazilMap from "@/components/BrazilMap";
import IDHTable from "@/components/IDHTable";

const IndicatorsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"idh" | "ipca">("idh");

  const toggleSection = () => {
    setActiveSection((prev) => (prev === "idh" ? "ipca" : "idh"));
  };

  const currentSection = constantsIndicators.sections.find(
    (section) => section.id === activeSection
  );

  if (!currentSection) {
    return <div>Section not found</div>;
  }

  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3 md:border-r md:border-gray-400 pr-8">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-bold text-primary">
              {currentSection.title}
            </h1>

            <p className="text-sm font-semibold text-gray-700 mb-4">
              {currentSection.dataSource}
            </p>

            <p className="mb-8">{currentSection.description}</p>

            {activeSection === "idh" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <BrazilMap />
                </div>

                <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <IDHTable />
                </div>
              </div>
            ) : (
              <div className="relative h-72 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
                  {/* Placeholder for IPCA content */}
                  <p>IPCA content goes here</p>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col items-center md:items-start justify-start">
          <div className="mt-6 md:mt-10 w-full flex justify-center md:justify-start">
            <button
              onClick={toggleSection}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            >
              {activeSection === "idh"
                ? "Switch to IPCA-15"
                : "Switch to IDH Map"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorsPage;