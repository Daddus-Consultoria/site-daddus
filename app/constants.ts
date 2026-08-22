import { Links } from "@/lib/constants/constants";

/**
 * Conteudo da home. A estrutura segue docs/DIRETRIZES-UX.md (secao 5): a home
 * apresenta a organizacao e o que ela produz, e nao funciona como vitrine
 * comercial. Nada aqui pode afirmar numero, cliente ou funcionalidade que a
 * Daddus nao tenha — os numeros da pagina saem do acervo publicado no CMS.
 */

export const heroHome = {
  chapeu: "Daddus Consultoria",
  titulo: "Dados, conhecimento e tecnologia aplicados à gestão pública",
  texto:
    "A Daddus produz estudos e indicadores sobre municípios, presta consultoria em políticas públicas e estruturação de projetos, e desenvolve os sistemas que apoiam a gestão no dia a dia.",
  acoes: [
    { rotulo: "Ver publicações", href: "/conteudos/publicacoes" },
    { rotulo: "Conhecer o ecossistema", href: "/tecnologia" },
  ],
};

export const frentesHome = [
  {
    titulo: "Conhecimento",
    descricao:
      "Estudos, guias, perfis municipais e indicadores, com metodologia e fontes descritas.",
    href: "/conteudos/publicacoes",
    rotulo: "Ver publicações",
  },
  {
    titulo: "Consultoria",
    descricao:
      "Políticas públicas, viabilidade econômico-financeira e modelagem de projetos para o setor público.",
    href: "/servicos/consultoria",
    rotulo: "Ver áreas de atuação",
  },
  {
    titulo: "Tecnologia",
    descricao:
      "Quatro sistemas próprios para demandas, projetos de PPP, compras públicas e informações de gestão municipal.",
    href: "/tecnologia",
    rotulo: "Conhecer o ecossistema",
  },
];

export const consultoriaHome = {
  titulo: "Consultoria",
  texto:
    "O trabalho acompanha o projeto do diagnóstico à contratação: entender a necessidade, avaliar a sustentação financeira e definir o formato do contrato.",
  areas: [
    {
      titulo: "Elaboração de políticas públicas",
      descricao:
        "Definição de objetivos, programas e metas da política, com escuta dos atores interessados e avaliação de alternativas.",
      href: "/servicos/consultoria/elaboracao-politicas-publicas",
    },
    {
      titulo: "Viabilidade econômico-financeira",
      descricao:
        "Análise de mercado, projeção de fluxo de caixa e indicadores como TIR, VPL e payback.",
      href: "/servicos/consultoria/estudo-de-viabilidade",
    },
    {
      titulo: "Modelagem de projetos",
      descricao:
        "Estruturação técnica, jurídica e econômica do projeto, do desenho da solução ao formato de contratação.",
      href: "/servicos/consultoria/modelagem-projetos",
    },
  ],
};

export const institucionalHome = {
  titulo: "Quem faz",
  texto:
    "A Daddus é uma assessoria técnica que atende ao setor público e ao setor corporativo, com equipe própria conduzindo estudos, consultorias e o desenvolvimento dos sistemas.",
  href: "/institucional/sobre",
  rotulo: "Conhecer a Daddus",
};

export const contatoHome = {
  titulo: "Fale com a Daddus",
  texto:
    "Para apresentar um dos sistemas, discutir um projeto ou pedir uma proposta de consultoria.",
  href: "/institucional/contato",
  rotulo: "Falar com a Daddus",
  site: Links.SITE_DOMAIN,
};
