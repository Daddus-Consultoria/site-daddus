import { CardInfoProps } from "@/lib/interfaces/card"

import {Links} from '@/lib/constants/constants';

const cards: CardInfoProps[] = [
    {
        title:'Elaboração de Políticas Públicas',
        description:"Definição de objetivos, programas e metas da política, com escuta dos atores interessados e avaliação de alternativas até a formulação final.",
        image:'/images/publications/publication1.svg',
        path:'#',
        copyLink: `${Links.SITE_DOMAIN}/#`,
        ctaLabel: "Conhecer o serviço",
        titleAlign:'left',
    },
    {
        title:'Estudos de Viabilidade Econômico-Financeiro',
        description:"Avaliação da sustentação financeira do projeto: análise de mercado, projeção de fluxo de caixa e indicadores como TIR, VPL e payback.",
        image:'/images/publications/publication1.svg',
        path:'#',
        copyLink: `${Links.SITE_DOMAIN}/#`,
        ctaLabel: "Conhecer o serviço",
        titleAlign:'left',
    },
    {
        title:'Modelagem de Projetos',
        description:"Estruturação técnica, jurídica e econômica do projeto, do desenho da solução ao formato de contratação.",
        image:'/images/publications/publication1.svg',
        path:'#',
        copyLink: `${Links.SITE_DOMAIN}/#`,
        ctaLabel: "Conhecer o serviço",
        titleAlign: 'left',
    },
]

export const constantsAbout = {
    image: '/images/logos/daddusSquare.svg',
    text: [
        {
            title: 'Quem somos',
            text: 'A Daddus é uma assessoria técnica especializada em atender às demandas do setor corporativo e público, oferecendo soluções personalizadas e especializadas em economia, análise de dados, mobilidade urbana e infraestrutura.\n\n Nosso compromisso é tornar a economia acessível e descomplicada para as organizações e entidades governamentais, fornecendo conhecimento direto, simplificado e direcionado para resolver os desafios específicos de cada projeto. '
        },
        {
            title: 'O que fazemos',
            text: 'Na Daddus, oferecemos consultorias conduzidas por profissionais experientes, realizando estudos do perfil de cada projeto com base em análises de dados. Seja para lançar novas ideias, encontrar soluções para projetos em andamento ou desenvolver políticas públicas, estamos comprometidos em atender às necessidades específicas de nossos clientes.\n\nAlém disso, prestamos o serviço de desenvolvimento de sistemas de gestão. Independentemente do tipo ou tamanho do projeto, garantimos um controle detalhado das informações.',
        },
        {
            title: 'Nossa missão',
            text: 'Nossa missão é viabilizar projetos de impacto social para organizações corporativas e entidades do setor público, mediante estudos econômicos e planejamento estruturado, para que possam tomar decisões informadas e alcançar os objetivos institucionais.',
        },
        {
            title: 'Negociação de Contratos',
            text: 'Tenha acesso a diferentes índices do setor de transporte urbano e inclua parâmetros imparciais em suas negociações.',
        },
    ], 
    values: {
        title: 'Nossos valores',
        listValues:[
            'Excelência em Consultoria',
            'Inovação e Tecnologia',
            'Transparência',
            'Compromisso com o cliente',
            'Responsabilidade Socioeconômica',
        ],
    },
    footer: {
        title: 'NOSSAS CONSULTORIAS',
        cards: cards,
    }
}

