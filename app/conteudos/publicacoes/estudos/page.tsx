import React, { Suspense } from "react";
import { CircularProgressIndicator, PublicationsLibrary } from "@/components/index";
import { PublishCategories } from "@/lib/constants/constants";

const Study = () => {
  return (
    <div className="flex flex-1 flex-col justify-start items-center px-[2%] lg:px-[5%] xl:px-[5%] lg:py-10">
      <div className="flex w-full flex-col items-center">
        <h1 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mt-4 lg:mt-0 mb-2">
          ESTUDOS
        </h1>
        <p className="mb-8 max-w-[720px] px-6 text-center text-[13px] text-[#555555] lg:px-0">
          Análises técnicas sobre políticas públicas, economia e gestão, com metodologia e fontes descritas.
        </p>
      </div>

      <Suspense fallback={<CircularProgressIndicator containerHeight="400px" />}>
        <PublicationsLibrary fixedCategory={PublishCategories.STUDIES} />
      </Suspense>
    </div>
  );
};

export default Study;
