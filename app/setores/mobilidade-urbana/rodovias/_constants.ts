import { CardInfoProps } from "@/lib/interfaces/card"

import {Links} from '@/lib/constants/constants';

const cardContents: CardInfoProps[] = [
    {
        title: 'RODOVIAS',
        description: 'Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.',
        image: '/images/publications/publication1.svg',
        path: '/setores/mobilidade-urbana/rodovias',
        copyLink: `${Links.SITE_DOMAIN}/setores/mobilidade-urbana/rodovias`,
        titleAlign: 'left',
    },
    {
        title: 'PORTOS',
        description: 'Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.',
        image: '/images/publications/publication1.svg',
        path: '/setores/mobilidade-urbana/portos',
        copyLink: `${Links.SITE_DOMAIN}/setores/mobilidade-urbana/portos`,
        titleAlign: 'left',
    }
]


export const constantsHighways = {
    content: [
        {
            title: 'RODOVIAS',
            text: 'Empresas, associações e prefeituras podem agora embasar as suas tomadas de decisão no reajuste de tarifas do transporte público ou no planejamento orçamentário. \n\n O uso de índices específicos como indexador de contratos minimiza a ocorrência de desequilíbrio financeiro na relação entre contratante e contratado durante a vigência do acordo, propiciando mais segurança às partes para realizarem transações de médio e longo prazos. '
        },
        {
            title: 'Reajuste de Tarifas',
            text: 'Associe os índices do setor às fórmulas paramétricas e aos cálculos do sistema para obter um reajuste que contemple a evolução real de preços.',
        },
        {
            title: 'Planejamento Orçamentário',
            text: 'Monitore a evolução dos preços de produtos e serviços que afetam o sistema de transporte urbano e realize projeções para o seu orçamento.',
        },
        {
            title: 'Negociação de Contratos',
            text: 'Tenha acesso a diferentes índices do setor de transporte urbano e inclua parâmetros imparciais em suas negociações.',
        },
    ],
    cards: cardContents,
}