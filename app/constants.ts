import { DaddusCarouselItem } from "@/lib/interfaces/daddusCarouselItem";
import { CardInfoProps } from "@/lib/interfaces/card"
import {Links} from '@/lib/constants/constants';

export const carouselItems: DaddusCarouselItem[] = [
  {
    title: "Desenvolvimento de políticas públicas para municípios",
    description:
      "Faça do seu município um modelo em governança e qualidade dos serviços. Nosso time está preparado para contribuir com a sua gestão.",
    image: {
      src: "/images/home/carousel/carousel_image_1.webp",
      alt: "Jovem estudante sorrindo e uma vista de prédio",
    },
  },
  {
    title: "Estudos de Vulnerabilidade Econômico-Financeiro",
    description:
      "Faça do seu município um modelo em governança e qualidade dos serviços. Nosso time está preparado para contribuir com a sua gestão.",
    image: {
      src: "/images/home/carousel/carousel_image_2.webp",
      alt: "Calculadora e ao lado um prédio alto",
    },
  },
  {
    title: "Modelagem de Projetos para o setor público e privado",
    description:
      "Faça do seu município um modelo em governança e qualidade dos serviços. Nosso time está preparado para contribuir com a sua gestão.",
    image: {
      src: "/images/home/carousel/carousel_image_3.webp",
      alt: "Dois projetos: de bicicletas e uma roda gigante",
    },
  },
];


export const constantsConsultancyHome:CardInfoProps[] = [
  {
    title: "Elaboração de Políticas Públicas",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publication1.svg",
    path: "/servicos/consultoria/elaboracao-politicas-publicas",
    copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/elaboracao-politicas-publicas`,
    titleAlign: "left",
  },
  {
    title: "Estudos de Viabilidade Econômico-Financeiro",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publications2.svg",
    path: "/servicos/consultoria/estudo-de-viabilidade",
    copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/estudo-de-viabilidade`,
    titleAlign: "left",
  },
  {
    title: "Modelagem de Projetos",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publications3.svg",
    path: "/servicos/consultoria/modelagem-projetos",
    copyLink: `${Links.SITE_DOMAIN}/servicos/consultoria/modelagem-projetos`,
    titleAlign: "left",
  },
];
  
export const constantConsultancyListHome = {
  title: "NOSSAS CONSULTORIAS",
  cards: constantsConsultancyHome,
}

export const constantsPublishHome:CardInfoProps[] = [
  {
    title: "ESTUDOS",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publication1.svg",
    path: "/conteudos/publicacoes/estudos",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/estudos`,
    titleAlign: "center",
  },
  {
    title: "GUIAS",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publications2.svg",
    path: "/conteudos/publicacoes/guias",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/guias`,
    titleAlign: "center",
  },
  {
    title: "PERFIS MUNICIPAIS",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publications3.svg",
    path: "/conteudos/publicacoes/perfis-municipais",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/perfis-municipais`,
    titleAlign: "center",
  },
];
  
export const constantPublishListHome = {
  title: "NOSSAS PUBLICAÇÕES",
  cards: constantsPublishHome,
}


