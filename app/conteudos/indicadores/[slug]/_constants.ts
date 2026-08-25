/**
 * Texto da pagina de um indicador.
 *
 * Como em `app/conteudos/indicadores/_constants.ts`: numero nenhum mora aqui.
 * Tudo o que a tela exibe sai do banco, e o que fica neste arquivo e so o que
 * enquadra o dado — ver docs/DIRETRIZES-UX.md secoes 6 e 8.
 */

export const indicadorPageContent = {
  voltar: { label: "Todos os indicadores", href: "/conteudos/indicadores" },

  serie: {
    title: "Série histórica",
    /**
     * A pagina precisa dizer o que o grafico e: uma reducao. Quem compara o
     * desenho com a serie na origem precisa saber por que ha menos pontos,
     * em vez de concluir que falta dado.
     */
    reducao:
      "O gráfico desenha a série inteira; em séries longas ele mostra uma amostra " +
      "regular dos períodos, para caber na tela sem sobrepor pontos. Nenhum valor " +
      "é suavizado ou recalculado — a tabela e o CSV trazem os períodos como a " +
      "origem os publicou.",

    /**
     * Aparece so quando o indicador declara `comparable_from` (migration 009).
     * A ausencia precisa ser explicada: quem conhece a serie do SGS sabe que
     * ela comeca em 1984 e, sem esta frase, concluiria que falta dado aqui.
     */
    janela:
      "O gráfico começa em {inicio} porque os valores anteriores estão em moeda " +
      "extinta — a série cruza o Plano Real, e cotações em cruzeiros não se " +
      "comparam a cotações em reais no mesmo eixo. O CSV traz a série completa, " +
      "desde {serieDesde}, como a origem a publica.",
  },

  tabela: {
    title: "Períodos recentes",
    colunas: { periodo: "Período", valor: "Valor" },
    vazio: "Esta série ainda não foi coletada.",
  },

  download: {
    title: "Série completa",
    label: "Baixar CSV",
    /** CTA nomeia o destino — DIRETRIZES-UX secao 11. */
    texto:
      "O CSV traz todos os períodos guardados, com a data de referência e o valor " +
      "como a origem publicou.",
  },

  procedencia: {
    title: "Procedência",
    /**
     * O paragrafo repete a regra central da area porque e nela que a pagina se
     * sustenta: a Daddus republica, nao apura. Ver docs/INDICADORES.md.
     */
    texto:
      "A Daddus não apura este indicador. A série é lida na instituição que a " +
      "produz e republicada aqui com a procedência preservada, sem conversão de " +
      "unidade nem recálculo.",
    rotulos: {
      produtor: "Quem apura",
      distribuidor: "Lida em",
      periodicidade: "Periodicidade",
      cobertura: "Períodos guardados",
      metodologia: "Metodologia",
      coleta: "Última leitura",
      codigo: "Código na origem",
    },
  },

  marcos: {
    title: "Marcos da série",
    maior: "Maior valor",
    menor: "Menor valor",
    /**
     * Explica por que a pagina nao traz variacao acumulada. Sem isso, a
     * ausencia parece esquecimento — e agora ela tem para onde apontar: o
     * acumulado existe, mas na calculadora, onde vem com a memoria de calculo.
     */
    nota:
      "São valores publicados pela origem, escolhidos da própria série. Variação " +
      "acumulada não entra aqui porque não é um número que a origem divulgou — a " +
      "calculadora de correção faz essa conta quando pedida, mostrando mês a mês " +
      "o que aplicou.",
  },

  /**
   * Atalhos para as calculadoras. Aparecem conforme a serie: encadear so faz
   * sentido em indice de preco mensal, e comparar exige que exista outra serie
   * na mesma unidade — as duas condicoes sao decididas na pagina.
   */
  calculadoras: {
    title: "Usar esta série",
    correcao: {
      texto:
        "A calculadora de correção encadeia as variações mensais deste índice para " +
        "atualizar um valor entre dois meses, com a memória de cálculo à vista.",
      label: "Corrigir um valor pelo {indice}",
    },
    comparar: {
      texto:
        "O comparador põe esta série ao lado de outra de mesma unidade, no mesmo " +
        "eixo e sem reescala.",
      label: "Comparar com outra série",
    },
  },

  cta: {
    title: "Precisa desta série dentro de um estudo?",
    text:
      "A leitura de indicador vira insumo de modelagem econômico-financeira, " +
      "projeção de arrecadação e reajuste contratual nos trabalhos da Daddus.",
    label: "Falar com a equipe",
    href: "/institucional/contato",
  },
} as const;

export const FREQUENCIA_LABEL: Record<string, string> = {
  diaria: "Diária",
  mensal: "Mensal",
};
