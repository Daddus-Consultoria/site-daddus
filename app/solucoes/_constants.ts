/**
 * Solucoes para municipios — docs/DIRETRIZES-UX.md, secao 10: a pagina organiza
 * a jornada pela necessidade da prefeitura, nao pelo nome do produto. O gestor
 * chega sabendo o problema que tem, e nao qual sistema resolve.
 *
 * Cada necessidade aponta para uma das tres frentes. Quando a resposta e um
 * sistema, `sistemaSlug` liga o item ao Ecossistema Daddus — e a pagina le dali
 * se o sistema ja esta em operacao, para nao prometer o que ainda nao existe.
 */

export type FrenteDaddus = "Conhecimento" | "Consultoria" | "Tecnologia";

export interface NecessidadeMunicipal {
  /** A necessidade dita como o gestor a formularia. */
  necessidade: string;
  /** A situacao concreta que leva ate ela. */
  contexto: string;
  frente: FrenteDaddus;
  /** O que a Daddus faz diante dessa necessidade. */
  resposta: string;
  /** Preenchido quando a resposta e um dos sistemas proprios. */
  sistemaSlug?: string;
  destino: { rotulo: string; href: string };
}

export const solucoesHeader = {
  chapeu: "Soluções",
  titulo: "Para municípios",
  texto:
    "Por onde começar, conforme a necessidade da prefeitura. Cada situação abaixo leva ao estudo, ao " +
    "serviço de consultoria ou ao sistema que responde a ela.",
};

export const necessidades: NecessidadeMunicipal[] = [
  {
    necessidade: "Organizar as demandas que chegam à prefeitura",
    contexto:
      "Ofício de vereador, pedido de secretaria e solicitação de munícipe chegam por canais diferentes, " +
      "e o andamento de cada um depende da memória de quem recebeu.",
    frente: "Tecnologia",
    resposta:
      "O Compasso reúne as demandas em um cadastro único, organizadas por secretaria, tipo e prioridade, " +
      "com a situação de cada uma visível ao longo do tempo.",
    sistemaSlug: "compasso",
    destino: { rotulo: "Conhecer o Compasso", href: "/tecnologia/compasso" },
  },
  {
    necessidade: "Acompanhar um projeto de PPP ao longo dos anos",
    contexto:
      "Estudos, pareceres, versões de contrato e atas se espalham por pastas e e-mails, e a troca de " +
      "equipe leva embora o histórico do projeto.",
    frente: "Tecnologia",
    resposta:
      "O Opus mantém as etapas, os documentos, as responsabilidades e os indicadores reunidos por projeto, " +
      "com histórico.",
    sistemaSlug: "opus",
    destino: { rotulo: "Conhecer o Opus", href: "/tecnologia/opus" },
  },
  {
    necessidade: "Dar rastro ao processo de compra",
    contexto:
      "O processo atravessa secretarias, setor de compras e comissão de licitação. Quando cada etapa vive " +
      "em uma planilha, a parada não aparece para ninguém.",
    frente: "Tecnologia",
    resposta:
      "O Prisma conecta a demanda de cada secretaria às etapas do processo até o contrato, com a fase atual, " +
      "o responsável por ela e o saldo disponível.",
    sistemaSlug: "prisma",
    destino: { rotulo: "Conhecer o Prisma", href: "/tecnologia/prisma" },
  },
  {
    necessidade: "Reunir as informações de gestão em um lugar só",
    contexto:
      "Folha em um sistema, contratos em outro, arrecadação em um terceiro: montar o quadro completo custa " +
      "dias de trabalho manual e o resultado envelhece rápido.",
    frente: "Tecnologia",
    resposta:
      "O Atlas centraliza folha, contratos, saldos, despesas por secretaria, contas a pagar e arrecadação, " +
      "e apoia os secretários no fechamento da folha.",
    sistemaSlug: "atlas",
    destino: { rotulo: "Conhecer o Atlas", href: "/tecnologia/atlas" },
  },
  {
    necessidade: "Saber se um projeto se sustenta financeiramente",
    contexto:
      "A decisão de levar um projeto adiante precisa de mais do que estimativa: exige mercado analisado e " +
      "fluxo de caixa projetado.",
    frente: "Consultoria",
    resposta:
      "O estudo de viabilidade econômico-financeira avalia o mercado, projeta o fluxo de caixa e calcula " +
      "indicadores como TIR, VPL e payback.",
    destino: { rotulo: "Ver o estudo de viabilidade", href: "/servicos/consultoria/estudo-de-viabilidade" },
  },
  {
    necessidade: "Formular ou revisar uma política pública",
    contexto:
      "A política precisa de objetivo, programa e meta definidos, com os atores interessados ouvidos antes " +
      "da formulação final.",
    frente: "Consultoria",
    resposta:
      "A Daddus conduz a definição de objetivos, programas e metas, a escuta dos atores interessados e a " +
      "avaliação de alternativas até a formulação final. Quando o projeto avança para contratação, a " +
      "modelagem cuida da estrutura técnica, jurídica e econômica.",
    destino: {
      rotulo: "Ver elaboração de políticas públicas",
      href: "/servicos/consultoria/elaboracao-politicas-publicas",
    },
  },
  {
    necessidade: "Encontrar dado sobre o município",
    contexto:
      "Antes de decidir, é preciso um retrato do território — e a base pública nem sempre está organizada " +
      "para consulta.",
    frente: "Conhecimento",
    resposta:
      "Perfis municipais, estudos, guias e indicadores ficam abertos no acervo do site, com fonte, período " +
      "de referência e metodologia descritas.",
    destino: { rotulo: "Ver o acervo", href: "/conteudos/publicacoes" },
  },
];

export const contratacaoSolucoes = {
  titulo: "Como contratar",
  texto:
    "Consultoria e sistemas são contratados de forma independente. A prefeitura pode começar pelo que é " +
    "mais urgente e incluir o restante depois — não é preciso adotar o conjunto para usar qualquer parte dele.",
  rotulo: "Falar com a Daddus",
  href: "/institucional/contato",
};
