import { CardInfoProps } from "@/lib/interfaces/card"

import { Links } from '@/lib/constants/constants';

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
        title: 'Estudos de Viabilidade Econômico-Financeiro',
        description: "Avaliação da sustentação financeira do projeto: análise de mercado, projeção de fluxo de caixa e indicadores como TIR, VPL e payback.",
        image: '/images/publications/publication1.svg',
        path: '/servicos/consultoria/estudo-de-viabilidade',
        copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/estudo-de-viabilidade`,
        ctaLabel: "Conhecer o serviço",
        titleAlign: 'left',
    }
]


export const constantsProjectModeling = {
    image: {
        src: '/images/study/study_image.svg',
        alt: 'study',
    },
    content: [
        {
            title: 'MODELAGEM DE PROJETOS',
            text: 'Modelar um projeto é definir como ele sai do papel: qual solução técnica atende à necessidade, quanto custa, quem investe, quem opera e sob qual contrato. A modelagem reúne as dimensões técnica, econômica e jurídica em um desenho único, que possa ser levado à contratação.'
        },
        {
            title: 'Quando a modelagem é necessária',
            text: 'Sempre que a administração precisa contratar algo mais complexo do que uma compra direta — uma concessão, uma parceria público-privada, uma obra com operação de longo prazo. Nesses casos, a decisão sobre o formato do contrato define o resultado tanto quanto a escolha da solução técnica.'
        },
        {
            title: 'O que a modelagem define',
            text: 'O trabalho percorre as escolhas que estruturam o projeto:',
            listConsultancy: [
                'Solução técnica: o que será executado, em qual escala e com qual padrão de serviço.',
                'Estrutura econômico-financeira: investimento necessário, fontes de receita e sustentação ao longo do contrato.',
                'Arranjo jurídico: o instrumento de contratação e a divisão de responsabilidades entre as partes.',
                'Matriz de riscos: quais riscos ficam com o poder público, quais ficam com o parceiro privado e como são tratados.',
                'Indicadores de desempenho: o que será medido para acompanhar a execução do contrato.',
            ],
            type: 'disc',
        },
        {
            title: 'Como conduzimos',
            text: 'A modelagem se apoia nos estudos que a antecedem e se organiza em etapas:',
            listConsultancy: [
                'Diagnóstico da necessidade e das alternativas possíveis.',
                'Estudo de viabilidade econômico-financeira das alternativas selecionadas.',
                'Definição do arranjo de contratação e da matriz de riscos.',
                'Elaboração dos documentos que instruem o processo, com a metodologia descrita.',
            ],
            type: 'decimal',
        },
    ],
    footer: {
        title: 'OUTRAS CONSULTORIAS',
        cards: cardContents,
    },
}