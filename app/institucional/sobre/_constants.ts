/**
 * Conteudo da pagina institucional. Segue docs/DIRETRIZES-UX.md: a Daddus se
 * apresenta pelas tres frentes (conhecimento, consultoria e tecnologia), e nao
 * como uma consultoria que tambem publica.
 *
 * O que esta escrito aqui precisa ser conferivel no proprio site — por isso
 * cada item de "Como trabalhamos" aponta para a pagina que mostra o trabalho.
 * Nada de numero, cliente ou funcionalidade que a empresa nao tenha.
 */

export const sobreHeader = {
  chapeu: "Daddus",
  titulo: "Quem somos",
  texto:
    "A Daddus é uma assessoria técnica que trabalha com economia, análise de dados e gestão pública. " +
    "Produz estudos e indicadores sobre municípios, presta consultoria em políticas públicas e " +
    "estruturação de projetos, e desenvolve os sistemas que apoiam a administração no dia a dia.",
};

export const missao = {
  titulo: "O que orienta o trabalho",
  texto:
    "Viabilizar projetos de impacto social no setor público e no setor corporativo por meio de estudo " +
    "econômico e planejamento estruturado, para que a decisão seja tomada com informação que dá para " +
    "conferir. É o mesmo critério nas três frentes: quem contrata precisa entender de onde veio o " +
    "número, o que a análise sustenta e o que ela não sustenta.",
};

/**
 * Abordagem — o item 10 das prioridades de redesign pede uma area de
 * metodologia. Cada passo descreve o que a Daddus faz de fato e leva para a
 * pagina onde isso aparece.
 */
export const comoTrabalhamos = [
  {
    titulo: "O estudo vem antes da recomendação",
    texto:
      "Cada análise declara a fonte dos dados, o período de referência e o método usado. Publicações e " +
      "indicadores ficam abertos no site para consulta, com a metodologia descrita junto do resultado.",
    rotulo: "Ver publicações",
    href: "/conteudos/publicacoes",
  },
  {
    titulo: "Do diagnóstico ao formato de contratação",
    texto:
      "Na consultoria, o trabalho acompanha o projeto inteiro: entender a necessidade, avaliar a " +
      "sustentação financeira e definir a estrutura técnica, jurídica e econômica da contratação.",
    rotulo: "Ver áreas de atuação",
    href: "/servicos/consultoria",
  },
  {
    titulo: "Os sistemas nascem do que a consultoria encontra",
    texto:
      "Compasso, Opus, Prisma e Atlas foram desenvolvidos a partir de problemas observados na " +
      "administração municipal — demanda sem registro, projeto sem histórico, compra sem rastro, " +
      "informação de gestão espalhada por sistemas diferentes.",
    rotulo: "Conhecer o ecossistema",
    href: "/tecnologia",
  },
];

/**
 * Substitui a antiga lista de valores ("Excelencia em Consultoria", "Inovacao
 * e Tecnologia"): adjetivo generico nao diz nada ao gestor que avalia contratar.
 * Aqui cada compromisso descreve uma pratica verificavel.
 */
export const compromissos = [
  {
    titulo: "Número com fonte e data",
    texto: "Nenhum dado aparece isolado: vem acompanhado da origem, do período e da data de atualização.",
  },
  {
    titulo: "Metodologia à vista",
    texto: "O caminho até o resultado fica descrito, para que outra equipe possa refazer a conta.",
  },
  {
    titulo: "Limite declarado",
    texto: "Quando a base disponível não sustenta uma conclusão, isso é dito no estudo em vez de contornado.",
  },
  {
    titulo: "Sistema entregue é sistema em uso",
    texto:
      "Cada sistema é apresentado pelo que já faz hoje. O que ainda está em desenvolvimento aparece " +
      "identificado como tal.",
  },
];

export const publicacoesSobre = {
  titulo: "O que temos publicado",
  texto:
    "A produção fica aberta no site — estudos, guias e perfis municipais, com autoria e metodologia " +
    "descritas em cada publicação.",
  rotulo: "Ver o acervo completo",
  href: "/conteudos/publicacoes",
};

export const contatoSobre = {
  titulo: "Falar com a Daddus",
  texto:
    "Para discutir um projeto, pedir uma proposta de consultoria ou solicitar a apresentação de um " +
    "dos sistemas.",
  email: "suporte@daddusconsultoria.com",
  rotulo: "Entrar em contato",
  href: "/institucional/contato",
};
