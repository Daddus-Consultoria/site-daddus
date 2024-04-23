import { CardInfoProps } from "@/lib/interfaces/card"

import {Links} from '@/lib/constants/constants';


export const constantsPublications:CardInfoProps[] = [
  {
    title: "ESTUDOS",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publication1.svg",
    path: "/conteudos/publicacoes/estudos",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/estudos`,
  },
  {
    title: "GUIAS",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publications2.svg",
    path: "/conteudos/publicacoes/guias",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/guias`,
  },
  {
    title: "PERFIS MUNICIPAIS",
    description:
      "Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos.",
    image: "/images/publications/publications3.svg",
    path: "/conteudos/publicacoes/perfis-municipais",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/perfis-municipais`,
  },
];
