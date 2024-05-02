import {CardBlogProps} from "@/lib/interfaces/card";
import { title } from "process";

const cardsPostBlog:CardBlogProps[] = [
    {
        title: 'Citolologia: um estudo demográfico de  duas ou três linhas ',
        badgeTitle: 'MERCADOS',
        first: true,
        image: '/images/blog/tremStation.svg'
    },
    {
        title: 'Citolologia: um estudo demográfico de  duas ou três linhas ',
        badgeTitle: 'MERCADOS',
        first: false,
        image: '/images/blog/maria.svg'
    },
    {
        title: 'Citolologia: um estudo demográfico de  duas ou três linhas ',
        badgeTitle: 'MERCADOS',
        first: false,
        image: '/images/blog/bike.svg'
    }
]

export const constantCardBlog ={
    title: 'Destaques',
    cards: cardsPostBlog,
    logoBlog: '/images/blog/logo.svg',
    barItens: [
        {
            title: 'FINANÇAS',
            link: '/blog/financas',
        },
        {
            title: 'POLÍTICAS PÚBLICAS',
            link: '#',
        },
        {
            title: 'GOVERNANÇA',
            link: '#',
        },
        {
            title: 'LOGÍSTICA',
            link: '#',
        },
        {
            title: 'INOVAÇÃO',
            link: '#',
        },
        {
            title: 'SUSTENTABILIDADE',
            link: '#',
        },
        {
            title: 'OPORTUNIDADES',
            link: '#',
        },
        
    ],
}