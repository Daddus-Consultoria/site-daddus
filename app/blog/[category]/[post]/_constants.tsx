import { PostModel, Post } from "@/lib/interfaces/post";
import PublishImg from "@/public/images/blog/bike.svg";

const relatedPosts: PostModel[] = [
  {
    slug: "potencial-no-agronegocio",
    category: "oportunidades",
    title:
      "Agribusiness em alta: 5 oportunidades para investir no setor em 2024",
    authorComment:
      "Descubra os nichos mais promissores e as tendências que impulsionam o crescimento do agronegócio brasileiro.",
    image: {
      src: PublishImg,
      alt: "",
    },
    author: {
      id: 2,
      name: "Ana Clara Oliveira",
      image: { src: "https://www.instagram.com/anaclaraoliv/", alt: "" },
      email: "teste@gmail.com",
      role: "Analista de Investimentos",
      description:
        "Especialista em agronegócio com mais de 5 anos de experiência em análise de mercado e seleção de investimentos.",
    },
    tags: ["Agribusiness", "Investimentos"],
    firstContent: "<p>text</p>",
    publishedDate: "2024-05-06:00:00",
  },
  {
    slug: "investir-na-bolsa-de-valores",
    category: "financas",
    image: {
      src: PublishImg,
      alt: "",
    },
    title: "Como investir na bolsa de valores: Guia completo para iniciantes",
    authorComment:
      "Aprenda os passos básicos para começar a investir na bolsa de valores e construir um patrimônio sólido.",
    author: {
      id: 3,
      name: "Pedro Henrique Silva",
      image: {
        src: PublishImg,
        alt: "",
      },
      email: "teste@gmail.com",
      role: "Educador Financeiro",
      description:
        "Especialista em educação financeira com mais de 10 anos de experiência em ajudar pessoas a alcançar seus objetivos financeiros.",
    },
    tags: ["Investimentos", "Educação Financeira"],
    publishedDate: "2024-05-06:00:00",

    firstContent: "<p>text</p>",
  },
  {
    slug: "sustentabilidade-no-agronegocio",
    category: "sustentabilidade",
    image: {
      src: PublishImg,
      alt: "",
    },
    title: "Sustentabilidade no agronegócio: Desafios e oportunidades",
    authorComment:
      "O agronegócio enfrenta o desafio de se tornar mais sustentável, mas também encontra diversas oportunidades para isso.",
    author: {
      id: 4,
      name: "Gabriela Silva",
      image: {
        src: "https://www.linkedin.com/in/gabriela-silva-1a2b4a16b/",
        alt: "",
      },
      email: "test@gmail.com",
      role: "Engenheira Ambiental",
      description:
        "Especialista em sustentabilidade no agronegócio com mais de 7 anos de experiência em consultoria e implementação de projetos.",
    },
    tags: ["Sustentabilidade", "Agronegócio"],

    firstContent: "<p>text</p>",
    publishedDate: "2024-05-06:00:00",
  },
];

export const postItems: Post[] = [
  {
    slug: "aversao-a-risco",
    category: "financas",
    title:
      "Irã-Israel: Sentimento de aversão a risco no curto prazo deve seguir, dizem analistas",
    authorComment:
      "Durante o Morning Call, eles comentaram que a resposta do irã neste final de semana ao bombardeio de sua embaixada na Síria foi pontual",
    publishedDate: "2024-05-06:00:00",
    image: { src: "", alt: "" },
    author: {
      id: 1,
      name: "Marcio Castanheira",
      image: {
        src: "/images/avatar/marcio.png",
        alt: "Marcio Castanheira Image",
      },
      email: "castanheira@daddus.com",
      role: "Jornalista",
      description:
        "Formada em Jornalismo pela PUC-SP, tem especialização em Jornalismo Internacional. Atua como editora-chefe no Money Times e já trabalhou nas redações do InfoMoney, Você S/A, Você RH, Olhar Digital e Editora Trip.",
    },
    tags: ["Finanças", "Investimentos"],

    firstContent: "<p>text</p>",
    lastContent: "<p>text</p>",
    relatedPosts,
  },
];
