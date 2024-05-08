import { PostModel, Posts } from "@/lib/interfaces/post";
import PublishImg from "@/public/images/blog/bike.svg";

const relatedPosts: PostModel[] = [
  {
    slug: "potencial-no-agronegocio",
    category: "oportunidades",
    title:
      "Agribusiness em alta: 5 oportunidades para investir no setor em 2024",
    subtitle:
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
    tag: { label: "Agronegócio", slug: "sustentabilidade" },
    firstContent: (
      <p>
        O agronegócio brasileiro vive um momento de grande pujança, impulsionado
        pela demanda global por alimentos e pela crescente adoção de tecnologias
        inovadoras. Com um vasto território fértil, clima favorável e mão de
        obra qualificada, o país tem potencial para se tornar um dos maiores
        produtores de alimentos do mundo.
      </p>
    ),
    publishedAt: new Date(2024, 4, 7),
  },
  {
    slug: "investir-na-bolsa-de-valores",
    category: "financas",
    image: {
      src: PublishImg,
      alt: "",
    },
    title: "Como investir na bolsa de valores: Guia completo para iniciantes",
    subtitle:
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
    tag: { label: "Bolsa de Valores", slug: "investimentos" },

    publishedAt: new Date(2023, 3, 5),
    firstContent: <></>,
  },
  {
    slug: "sustentabilidade-no-agronegocio",
    category: "sustentabilidade",
    image: {
      src: PublishImg,
      alt: "",
    },
    title: "Sustentabilidade no agronegócio: Desafios e oportunidades",
    subtitle:
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
    tag: { label: "Agribusiness", slug: "sustentabilidade" },

    firstContent: (
      <p>
        O agronegócio é um dos setores mais importantes da economia brasileira,
        mas também é um dos que mais impactam o meio ambiente. O uso intensivo
        de agrotóxicos, o desmatamento e a erosão do solo são apenas alguns dos
        desafios que o setor enfrenta para se tornar mais sustentável.
      </p>
    ),
    publishedAt: new Date(2024, 5, 6),
  },
];

export const postItems: Posts[] = [
  {
    slug: "aversao-a-risco",
    category: "financas",
    title:
      "Irã-Israel: Sentimento de aversão a risco no curto prazo deve seguir, dizem analistas",
    subtitle:
      "Durante o Morning Call, eles comentaram que a resposta do irã neste final de semana ao bombardeio de sua embaixada na Síria foi pontual",
    publishedAt: new Date(),
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
    tag: { label: "Ecomonia", slug: "ecomonia" },

    firstContent: (
      <p>
        O acirramento das discussões em torno da meta de resultado primário de
        2025 e dos três anos seguintes (ou mesmo possíveis mudanças no objetivo
        de equilíbrio fiscal em 2024) pouco antes do envio do Projeto de Lei de
        Diretrizes Orçamentárias (PLDO) pelo governo do presidente Luiz Inácio
        Lula da Silva (PT) deixou temporariamente em segundo plano o debate
        sobre outra perna da política fiscal. Além de estabelecer compromissos
        para a relação entre receitas e despesas, o arcabouço que substituiu o
        teto de gastos (Lei Complementar nº 200/2023) trouxe uma regra
        específica para a evolução das despesas públicas ao longo dos anos – que
        já tem gerado dores de cabeça no mundo político e atraído olhares do
        mercado financeiro.
      </p>
    ),
    lastContent: (
      <p>
        O acirramento das discussões em torno da meta de resultado primário de
        2025 e dos três anos seguintes (ou mesmo possíveis mudanças no objetivo
        de equilíbrio fiscal em 2024) pouco antes do envio do Projeto de Lei de
        Diretrizes Orçamentárias (PLDO) pelo governo do presidente Luiz Inácio
        Lula da Silva (PT) deixou temporariamente em segundo plano o debate
        sobre outra perna da política fiscal. Além de estabelecer compromissos
        para a relação entre receitas e despesas, o arcabouço que substituiu o
        teto de gastos (Lei Complementar nº 200/2023) trouxe uma regra
        específica para a evolução das despesas públicas ao longo dos anos – que
        já tem gerado dores de cabeça no mundo político e atraído olhares do
        mercado financeiro.
      </p>
    ),
    relatedPosts,
  },
];
