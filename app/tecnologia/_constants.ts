/**
 * Conteudo do Ecossistema Daddus. A funcao de cada sistema vem das diretrizes
 * passadas pela empresa (docs/DIRETRIZES-UX.md, secao 9). Nao acrescentar
 * funcionalidade que o sistema ainda nao tenha nem afirmar integracao
 * automatica entre eles: e regra explicita do cliente.
 *
 * `emOperacao: false` significa sistema ainda em desenvolvimento — a pagina
 * avisa o visitante e troca o CTA.
 */
export interface SistemaDaddus {
  slug: string;
  nome: string;
  chamada: string;
  /** Uma linha, usada em listagens e na home. */
  descricao: string;
  /** O problema concreto que levou o sistema a existir. */
  problema: string;
  atividades: string[];
  beneficios: string[];
  publico: string;
  emOperacao: boolean;
  imagem?: { src: string; alt: string; legenda: string };
}

export const contratacao =
  "Cada sistema é contratado por conta própria. A prefeitura pode começar por um e incluir os demais depois, conforme a necessidade.";

export const sistemas: SistemaDaddus[] = [
  {
    slug: "compasso",
    nome: "Compasso",
    chamada: "Gestão de demandas",
    descricao:
      "Centraliza as demandas e solicitações que chegam à administração, de onde quer que venham, e mantém o acompanhamento de cada uma em um só lugar.",
    problema:
      "As demandas chegam à prefeitura por canais diferentes: ofício de vereador, pedido de secretaria, solicitação de munícipe, conversa de corredor. Sem um lugar único de registro, o acompanhamento passa a depender da memória de quem recebeu — e responder “em que pé está aquilo?” vira uma investigação.",
    atividades: [
      "Registro das demandas e solicitações em um cadastro único",
      "Organização por secretaria, tipo e prioridade",
      "Acompanhamento da situação de cada demanda ao longo do tempo",
    ],
    beneficios: [
      "Toda demanda tem registro, responsável e situação visível.",
      "A resposta sobre o andamento não depende de quem atendeu.",
      "O histórico fica no sistema, não na caixa de entrada de uma pessoa.",
    ],
    publico: "Prefeituras e secretarias que hoje acompanham demandas por planilha, e-mail ou papel.",
    emOperacao: true,
  },
  {
    slug: "opus",
    nome: "Opus",
    chamada: "Gestão de projetos de PPP",
    descricao:
      "Acompanha projetos de parceria público-privada da estruturação em diante: etapas, documentos, responsabilidades e indicadores do projeto.",
    problema:
      "Um projeto de parceria público-privada se estende por anos e passa por muitas mãos. Estudos, pareceres, versões de contrato e atas costumam ficar espalhados por pastas e e-mails, e a resposta sobre o estágio do projeto depende de quem participou das reuniões.",
    atividades: [
      "Etapas do projeto e situação de cada uma",
      "Documentos reunidos por projeto, com histórico",
      "Responsabilidades atribuídas por etapa",
      "Indicadores acompanhados ao longo do contrato",
    ],
    beneficios: [
      "O estágio do projeto fica explícito, sem depender de reconstituição.",
      "Os documentos de cada etapa ficam reunidos e localizáveis.",
      "A troca de equipe não leva embora o histórico do projeto.",
    ],
    publico: "Municípios e órgãos que estruturam ou acompanham projetos de PPP.",
    emOperacao: true,
  },
  {
    slug: "prisma",
    nome: "Prisma",
    chamada: "Gestão de compras públicas",
    descricao:
      "Apoia o planejamento, a organização e o acompanhamento dos processos de compra, conectando a necessidade de cada secretaria às etapas do processo até o contrato.",
    problema:
      "Um processo de compra atravessa as secretarias, o setor de compras e a comissão de licitação. Quando cada etapa vive em uma planilha diferente, ninguém sabe de quem é a vez — e o processo para sem que a parada apareça para alguém.",
    atividades: [
      "Demandas das secretarias (DFD) reunidas em processos e lotes",
      "Estudo técnico preliminar (ETP) a partir da demanda registrada",
      "Coleta de quantidades por secretaria, item a item",
      "Cotações e mapa de preços, com o método de cálculo declarado",
      "Tramitação entre o setor de compras e a comissão de licitação",
      "Contratos e pedidos de fornecimento, com saldo por secretaria",
    ],
    beneficios: [
      "A fase do processo e o responsável por ela ficam visíveis a qualquer momento.",
      "A quantidade informada por cada secretaria fica registrada, com justificativa quando é alterada.",
      "O saldo do contrato é consultado antes do pedido, e não depois.",
    ],
    publico: "Setores de compras, comissões de licitação e secretarias de prefeituras.",
    emOperacao: true,
    imagem: {
      src: "/images/tecnologia/prisma-processo.png",
      alt: "Tela do Prisma mostrando a trilha de fases de um processo de compra",
      legenda: "Acompanhamento de um processo no Prisma, com a fase atual e o responsável por ela. Dados de demonstração.",
    },
  },
  {
    slug: "atlas",
    nome: "Atlas",
    chamada: "Inteligência para gestão municipal",
    descricao:
      "Reúne as informações que o gestor precisa para decidir — folha, contratos, saldos, despesas por secretaria, contas a pagar e arrecadação — e apoia os secretários no fechamento da folha.",
    problema:
      "As informações que sustentam uma decisão de gestão estão espalhadas: a folha em um sistema, os contratos em outro, a arrecadação em um terceiro. Reunir o quadro completo costuma custar dias de trabalho manual, e o resultado envelhece rápido.",
    atividades: [
      "Folha de pagamento e apoio ao fechamento mensal",
      "Contratos e saldos disponíveis",
      "Despesas por secretaria e contas a pagar",
      "Arrecadação e demais informações de gestão",
    ],
    beneficios: [
      "O quadro da gestão fica reunido em um lugar só.",
      "O fechamento da folha deixa de depender de consolidação manual.",
      "Secretários acompanham a própria despesa sem pedir relatório.",
    ],
    publico: "Prefeitos, secretários e equipes de planejamento e finanças.",
    emOperacao: false,
  },
];

export function encontrarSistema(slug: string) {
  return sistemas.find((sistema) => sistema.slug === slug);
}
