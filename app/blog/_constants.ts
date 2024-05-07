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
            link: '/blog/politicas-publicas',
        },
        {
            title: 'GOVERNANÇA',
            link: '/blog/governanca',
        },
        {
            title: 'LOGÍSTICA',
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