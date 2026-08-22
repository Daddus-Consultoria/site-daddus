import { CardInfoProps } from "@/lib/interfaces/card"
import {Links} from '@/lib/constants/constants';

export const constantsConsultancy: CardInfoProps[] = [
  {
    title: "Elaboração de Políticas Públicas",
    description:
      "Definição de objetivos, programas e metas da política, com escuta dos atores interessados e avaliação de alternativas até a formulação final.",
    image: "/images/publications/publication1.svg",
    path: `${Links.SITE_DOMAIN}/servicos/consultoria/elaboracao-politicas-publicas`,
    copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/elaboracao-politicas-publicas`,
        ctaLabel: "Conhecer o serviço",
    titleAlign: 'left',
  },
  {
    title: "Estudos de Viabilidade Econômico-Financeiro",
    description:
      "Avaliação da sustentação financeira do projeto: análise de mercado, projeção de fluxo de caixa e indicadores como TIR, VPL e payback.",
    image: "/images/publications/publications2.svg",
    path: `${Links.SITE_DOMAIN}/servicos/consultoria/estudo-de-viabilidade`,
    copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/estudo-de-viabilidade`,
        ctaLabel: "Conhecer o serviço",
    titleAlign: 'left',
  },
  {
    title: "Modelagem de Projetos",
    description:
      "Estruturação técnica, jurídica e econômica do projeto, do desenho da solução ao formato de contratação.",
    image: "/images/publications/publications3.svg",
    path: `${Links.SITE_DOMAIN}/servicos/consultoria/modelagem-projetos`,
    copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/modelagem-projetos`,
        ctaLabel: "Conhecer o serviço", 
    titleAlign: 'left',
  },
];
