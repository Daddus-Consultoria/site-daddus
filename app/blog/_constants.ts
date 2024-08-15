import {CardBlogProps} from "@/lib/interfaces/card";
import { title } from "process";

const cardsPostBlog:CardBlogProps[] = [
    {
        title: 'Citolologia: um estudo demográfico de  duas ou três linhas ',
        badgeTitle: 'MERCADOS',
        first: true,
        image: {
            src:  '/images/blog/tremStation.svg',
            alt: 'tremStation'
        }
    },
    {
        title: 'Citolologia: um estudo demográfico de  duas ou três linhas ',
        badgeTitle: 'MERCADOS',
        first: false,
        image: {
            src: '/images/blog/maria.svg',
            alt: 'maria',
        }
    },
    {
        title: 'Citolologia: um estudo demográfico de  duas ou três linhas ',
        badgeTitle: 'MERCADOS',
        first: false,
        image: {
            src: '/images/blog/bike.svg',
            alt: 'bikes',
        }
    }
]

export const constantCardBlog ={
    title: 'Destaques',
    cards: cardsPostBlog,
    logoBlog: '/images/blog/logo.svg',
    barItens: [
        {
            title: 'ECONOMIA', // Mudado de Finanças para Economia
            link: '/blog/financas',
        },
        {
            title: 'POLÍTICAS PÚBLICAS',
            link: '/blog/politicas-publicas',
        },
        {
            title: 'GOVERNANÇA',
            link: '/blog/governanca',
        },
        {
            title: 'MOBILIDADE', // Mudado de Logística para Mobilidade
            link: '/blog/logistica',
        },
        {
            title: 'INOVAÇÃO',
            link: '/blog/inovacao',
        },
        {
            title: 'SUSTENTABILIDADE',
            link: '/blog/sustentabilidade',
        },
        {
            title: 'OPORTUNIDADES',
            link: '/blog/oportunidades',
        },
        
    ],
}