import React from 'react';

const IndicatorsPage: React.FC = () => {
    return (
        <div className='flex align-middle items-center justify-center w-full h-100 max-h-screen'>
           <iframe className='w-full h-full' width="800px" height="600px" src={process.env.NEXT_PUBLIC_BI_URL} frameBorder="0" style= {{border:0}} allowFullScreen sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>
        </div>
    );
};

export default IndicatorsPage;
