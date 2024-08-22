import { CardInfoProps } from "@/lib/interfaces/card"
import {Links} from '@/lib/constants/constants';

export const constantsConsultancy: CardInfoProps[] = [
  {
    title: "Elaboração de Políticas Públicas",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publication1.svg",
    path: `${Links.SITE_DOMAIN}/servicos/consultoria/elaboracao-politicas-publicas`,
    copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/elaboracao-politicas-publicas`,
    titleAlign: 'left',
  },
  {
    title: "Estudos de Viabilidade Econômico-Financeiro",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publications2.svg",
    path: `${Links.SITE_DOMAIN}/servicos/consultoria/estudo-de-viabilidade`,
    copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/estudo-de-viabilidade`,
    titleAlign: 'left',
  },
  {
    title: "Modelagem de Projetos",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publications3.svg",
    path: `${Links.SITE_DOMAIN}/servicos/consultoria/modelagem-projetos`,
    copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/modelagem-projetos`, 
    titleAlign: 'left',
  },
];
