import { CardInfoProps } from "@/lib/interfaces/card"

import {Links} from '@/lib/constants/constants';

const cardContents: CardInfoProps[] = [
    {
        title: 'TRANSPORTES',
        description: 'Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.',
        image: '/images/publications/publication1.svg',
        path: '/setores/mobilidade-urbana/transportes',
        copyLink: `${Links.SITE_DOMAIN}/setores/mobilidade-urbana/transportes`,
    },
    {
        title: 'RODOVIAS',
        description: 'Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.',
        image: '/images/publications/publication1.svg',
        path: '/setores/mobilidade-urbana/rodovias',
        copyLink: `${Links.SITE_DOMAIN}/setores/mobilidade-urbana/rodovias`,
    },
    {
        title: 'PORTOS',
        description: 'Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.',
        image: '/images/publications/publication1.svg',
        path: '/setores/mobilidade-urbana/portos',
        copyLink: `${Links.SITE_DOMAIN}/setores/mobilidade-urbana/portos`,
    }
]

const constantMobilityUrban = {
    subtitle1: 'Mobilidade Urbana',
    textSubtitle1: 'A mobilidade urbana é a capacidade que um grupo de pessoas tem de se deslocar dentro de um centro urbano, seja de carro, metrô, ônibus, bicicleta, motos e outros meios de locomoção. Na mobilidade não se analisa o deslocamento em si, mas a qualidade de vida das pessoas e o bem-estar da população, porque é essencial para o planejamento urbano. ',
    video: '/images/publications/bus.svg',
    subtitle2: 'MOBILIDADE URBANA NO BRASIL',
    textSubtitle2: 'Dados da Pesquisa Mobilidade Urbana 2022 mostram que, em média, os brasileiros que  residem nas capitais passam 120 minutos por dia no trânsito para ir a lugares como o trabalho,  escola, faculdade ou centros comerciais, sendo que 28,3% levam de 30 minutos a 1 hora e 31,9%  levam de 1 a 2 horas.',
    data: {
        title: 'Como os brasileiros se locomovem pelas cidades?',
        percentage : [
            { 
                porcentage: '50%',
                type: 'ônibus',
            },
            { 
                porcentage: '32%',
                type: 'carro',
            },
            { 
                porcentage: '22%',
                type: 'à pé',
            },
            { 
                porcentage: '16%',
                type: 'app',
            },
            { 
                porcentage: '34%',
                type: 'outros',
            },
        ]
    },
    cards: {
        title: 'CONFIRA NOSSOS CONTEÚDOS',
        cardsContent: cardContents,
    },
}



export { constantMobilityUrban }