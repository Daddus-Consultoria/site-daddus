import { CardInfoProps } from "@/lib/interfaces/card"

import {Links} from '@/lib/constants/constants';


export const constantsPublications:CardInfoProps[] = [
  {
    title: "ESTUDOS",
    description:
      "Análises técnicas sobre políticas públicas, economia e gestão, com metodologia e fontes descritas.",
    image: "/images/publications/publication1.svg",
    path: "/conteudos/publicacoes/estudos",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/estudos`,
        ctaLabel: "Ver estudos",
  },
  {
    title: "GUIAS",
    description:
      "Materiais de orientação prática para equipes municipais aplicarem na rotina da gestão.",
    image: "/images/publications/publications2.svg",
    path: "/conteudos/publicacoes/guias",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/guias`,
        ctaLabel: "Ver guias",
  },
  {
    title: "PERFIS MUNICIPAIS",
    description:
      "Retratos social, econômico e eleitoral de municípios, organizados a partir de bases públicas.",
    image: "/images/publications/publications3.svg",
    path: "/conteudos/publicacoes/perfis-municipais",
    copyLink: `${Links.SITE_DOMAIN}/conteudos/publicacoes/perfis-municipais`,
        ctaLabel: "Ver perfis municipais",
  },
];
