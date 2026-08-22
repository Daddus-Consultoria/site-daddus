import React, { Suspense } from "react";
import { CircularProgressIndicator, PublicationsLibrary } from "@/components/index";

/**
 * Acervo completo: estudos, guias e perfis municipais no mesmo lugar, com
 * busca e filtros. Ver docs/DIRETRIZES-UX.md, secao 7.
 */
const PublishPage = () => {
  return (
    <div className="flex flex-1 flex-col justify-start items-center px-[2%] lg:px-[5%] xl:px-[5%] lg:py-10">
      <div className="flex w-full flex-col items-center">
        <h1 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mt-4 lg:mt-0 mb-2">
          PUBLICAÇÕES
        </h1>
        <p className="mb-8 max-w-[720px] px-6 text-center text-[13px] text-[#555555] lg:px-0">
          Acervo de estudos, guias e perfis municipais produzidos pela Daddus.
          Use a busca e os filtros para chegar ao material por tipo, tema ou ano.
        </p>
      </div>

      <Suspense fallback={<CircularProgressIndicator containerHeight="400px" />}>
        <PublicationsLibrary />
      </Suspense>
    </div>
  );
};

export default PublishPage;
