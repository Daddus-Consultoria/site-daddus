import { CardInfoProps } from "@/lib/interfaces/card"

import { Links } from '@/lib/constants/constants';

const cardContents: CardInfoProps[] = [
    {
        title: 'Estudos de Viabilidade Econômico-Financeiro',
        description: "Avaliação da sustentação financeira do projeto: análise de mercado, projeção de fluxo de caixa e indicadores como TIR, VPL e payback.",
        image: '/images/publications/publication1.svg',
        path: '/servicos/consultoria/estudo-de-viabilidade',
        copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/estudo-de-viabilidade`,
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

export const constantsTransports = {
    title: 'ELABORAÇÃO DE POLÍTICAS PÚBLICAS',
    image: '/images/elaboration-policy-public/image.svg',
    content: [
        {
            title: 'Soluções Eficientes e Personalizadas',
            text: 'Nossa consultoria oferece:',
            listConsultancy: [
                'Identificação precisa de desafios locais e oportunidades de desenvolvimento.',
                'Definição de objetivos claros e metas realistas, alinhados com as necessidades da sua comunidade.',
                'Envolvimento ativo de todas as partes interessadas, incluindo líderes comunitários, especialistas e membros da sociedade civil.',
                'Flexibilidade para ajustes conforme feedback e mudanças no contexto.',
                'Recomendações embasadas em análises detalhadas e resultados comprovados.',
            ],
            textList: 'Entre em contato e descubra como podemos ajudar sua prefeitura a desenvolver políticas públicas que realmente façam a diferença para seus cidadãos!',
        },
        {
            title: 'O Caminho para Soluções Eficazes',
            text: 'A elaboração de políticas públicas é um processo dinâmico e desafiador que visa encontrar soluções eficazes para problemas sociais complexos. Quando surge um desafio, a primeira etapa é definir estratégias claras para abordá-lo. No entanto, esse processo muitas vezes desencadeia debates políticos e requer uma cuidadosa consideração dos interesses envolvidos. '
        },
        {
            title: 'Definindo o Rumo: Objetivos, Programas e Metas',
            text: 'Para começar, é fundamental estabelecer o objetivo da política pública, bem como os programas e metas específicos que guiarão sua implementação. Essa etapa envolve a análise cuidadosa de dados estatísticos e o envolvimento de especialistas técnicos para garantir a viabilidade das propostas.',
        },
        {
            title: 'Diálogo e Participação: Envolvendo os Stakeholders',
            text: 'Uma abordagem participativa é essencial. Por isso, é crucial envolver os diversos atores interessados, como líderes comunitários, especialistas, e representantes da sociedade civil. Essa colaboração permite a troca de ideias e a consideração de diferentes perspectivas, tornando as políticas mais inclusivas e eficazes.',
        },
        {
            title: 'Construindo Consenso: Alternativas e Flexibilidade',
            text: 'Durante o processo, várias propostas serão discutidas e algumas descartadas. É importante manter a flexibilidade e estar aberto a caminhos alternativos, caso a abordagem inicial se prove inviável. Isso garante que as políticas sejam adaptadas às necessidades reais da população e possam contar com amplo apoio.',
        },
    ],
    footer: {
        title: 'OUTRAS CONSULTORIAS',
        cards: cardContents,
    }
}