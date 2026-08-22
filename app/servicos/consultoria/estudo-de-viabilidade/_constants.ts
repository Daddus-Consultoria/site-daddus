import { CardInfoProps } from "@/lib/interfaces/card"

import {Links} from '@/lib/constants/constants';

const cardContents: CardInfoProps[] = [
    {
        title: 'Elaboração de Políticas Públicas',
        description: "Definição de objetivos, programas e metas da política, com escuta dos atores interessados e avaliação de alternativas até a formulação final.",
        image: '/images/publications/publication1.svg',
        path: '/servicos/consultoria/elaboracao-politicas-publicas',
        copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/elaboracao-politicas-publicas`,
        ctaLabel: "Conhecer o serviço",
        titleAlign: 'left',
    },
    {
        title: 'Modelagem de Projetos',
        description: "Estruturação técnica, jurídica e econômica do projeto, do desenho da solução ao formato de contratação.",
        image: '/images/publications/publication1.svg',
        path: '/servicos/consultoria/modelagem-projetos',
        copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/modelagem-projetos`,
        ctaLabel: "Conhecer o serviço",
        titleAlign: 'left',
    }
]


export const constantsStudy = {
    image: {
        src: '/images/study/study_image.svg',
        alt: 'study',
    },
    content: [
        {
            title: 'ESTUDOS DE VIABILIDADE ECONÔMICO-FINANCEIRA',
            text: 'A viabilidade financeira é o processo de avaliação que permite determinar se um projeto, não só trará melhorias, mas que também seja factível do ponto de vista econômico.'
        },
        {
            title: 'Por que é Crucial?',
            text: 'A viabilidade financeira oferece uma visão clara das oportunidades e desafios que o plano enfrentará. Ela ajuda a minimizar riscos, maximizar retornos e guiar os responsáveis nos possíveis problemas que podem surgir. '
        },
        {
            title: 'Cálculos Fundamentais',
            text: 'Calcular a viabilidade financeira não é uma tarefa simples, mas é essencial para o sucesso a longo prazo. Envolve uma série de etapas, desde a análise de mercado até a projeção de fluxo de caixa e indicadores financeiros. Aqui estão alguns aspectos-chave:',
            listConsultancy: [
                'Análise de Mercado: Entender o comportamento do mercado, a demanda dos consumidores e as tendências do setor é fundamental para tomar decisões informadas.',
                'Projeção de Fluxo de Caixa: Antecipar receitas, despesas e investimentos ao longo do tempo é essencial para garantir a saúde financeira do investimento.',
                'Análise de Indicadores: Utilizar indicadores como TIR, Payback e VPL para avaliar a rentabilidade e a atratividade do investimento.',
            ],
            type: 'disc',
        },
        {
            title: 'Dicas para o Sucesso',
            text: 'Mantenha-se informado sobre as tendências do mercado e as mudanças no comportamento da população.',
            listConsultancy: [
                'Seja realista ao projetar receitas e despesas, considerando diferentes cenários possíveis.',
                'Busque orientação profissional, seja de contadores, consultores financeiros ou mentores experientes.',
                'Ao compreender e aplicar esses conceitos de forma eficaz, você estará melhor preparado para transformar suas ideias em negócios lucrativos e sustentáveis.',
            ],
            type: 'decimal',
        },
    ],
    footer:{
        title: 'OUTRAS CONSULTORIAS',
        cards: cardContents,
    },
}