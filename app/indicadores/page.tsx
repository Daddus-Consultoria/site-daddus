import React from 'react';
import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

/**
 * Rota legada: nada no site aponta para ela, e o conteudo e um iframe de BI sem
 * texto proprio. Fica fora do indice — indexada, competiria com
 * `/conteudos/indicadores`, que e a pagina de indicadores atual e a que o menu
 * e o rodape linkam, oferecendo ao buscador uma tela em branco.
 */
export const metadata: Metadata = pageMetadata({
  title: "Indicadores",
  description: "Painel de indicadores da Daddus.",
  path: "/indicadores",
  index: false,
});

const IndicatorsPage: React.FC = () => {
    return (
        <div className='flex align-middle items-center justify-center w-full h-100 max-h-screen'>
           <iframe className='w-full h-full' width="800px" height="600px" src={process.env.NEXT_PUBLIC_BI_URL} frameBorder="0" style= {{border:0}} allowFullScreen sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>
        </div>
    );
};

export default IndicatorsPage;
