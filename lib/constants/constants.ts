import { NavigationItem, NavigationType } from "@/lib/interfaces/navigation";
export const headerItems: NavigationType[] = [
    {
        title: "SERVIÇOS",
        subtypes: [
            {
                title: "Consultoria",
                items: [
                    {
                        title: "Elaboração de Políticas Públicas",
                        href: "#",
                    },
                    {
                        title: "Estudos de Viabilidade Econômico-Financeira",
                        href: "#",
                    },
                    {
                        title: "Modelagem de Projetos",
                        href: "#",
                    },
                ],
            },
            {
                title: "Desenvolvimento de sistemas",
                items: [
                {
                    title: "Compasso",
                    href: "#",
                },
                ],
            },
        ],
    },
    {
        title: "SETORES",
        subtypes: [
            {
                title: "Mobilidade Urbana",
                items: [
                {
                    title: "Transportes",
                    href: "#",
                },
                {
                    title: "Rodovias",
                    href: "#",
                },
                {
                    title: "Portos",
                    href: "#",
                },
                ],
            },
            {
                title: "Saúde",
                items: [
                {
                    title: "Gestão Hospitalar",
                    href: "#",
                },
                ],
            },
            {
                title: "Mobiliário Urbano",
                items: [
                    {
                        title: "RED's",
                        href: "#",
                    },
                ],
            },
        ],
    },
    {
        title: "CONTEÚDOS",
        subtypes: [
        {
            title: "Blog",
            items: [],
        },
        {
            title: "Estudos",
            href: "#",
        },
        {
            title: "Guias",
            href: "#",
        },
        {
            title: "Publicações",
            href: "#",
            items: [
                {
                    title: "Perfil Social dos Municípios",
                    href: "#",
                },
                {
                    title: "Perfil Eleitoral dos Municípios",
                    href: "#",
                },
                {
                    title: "Perfil Econômico dos Municípios",
                    href: "#",
                },
            ],
        },
        ],
    },
    {
        title: "SOBRE NÓS",
        href: "#",
    },
];
