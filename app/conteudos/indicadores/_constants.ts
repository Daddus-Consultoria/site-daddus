import { title } from "process";

export const constantsIndicators = {
  sections: [
    {
      id: 'idh',
      title: 'Mapa do IDH',
      dataSource: 'Base de dados: Out/2021',
      description: 'O Índice de Desenvolvimento Humano (IDH) compara indicadores de países nos itens riqueza, alfabetização, educação, esperança de vida, natalidade e outros, com o intuito de avaliar o bem-estar de uma população, especialmente das crianças.',
    },
    {
      id: 'ipca',
      title: 'IPCA-15',
      dataSource: 'Base de dados: Mar/2022',
      description: 'O Instituto Brasileiro de Geografia e Estatística é um instituto público da administração federal brasileira criado em 1934 e instalado em 1936 com o nome de Instituto Nacional de Estatística; seu fundador e grande incentivador foi o estatístico Mário Augusto Teixeira de Freitas. O nome atual data de 1938.',
      images: [
        {
          src: '/images/temporary_tests/ipca_graph',
          alt: 'Gráfico do IPCA-15'
        }
      ]
    }
  ]
};

export const filtersIndicatorPage = {
  items: [
    {
      value : 'maps',
      title: 'Mapa do IDH',
      subTitle: 'Base de dados: Out/2021',
      text: 'O Índice de Desenvolvimento Humano (IDH) compara indicadores de países nos itens riqueza, alfabetização, educação, esperança de vida, natalidade e outros, com o intuito de avaliar o bem-estar de uma população, especialmente das crianças.',
      content :[
        {
          title : 'INDICADOR',
          placeholder: 'IDH',
          items: [
            'IDH',
          ]
        },
        {
          title : 'ANO',
          placeholder: 'IDH',
          items: [
            'IDH',
          ]
        },
      ]
    },
    {
      value: 'graphics',
      title: 'IPCA-15',
      subTitle: 'Base de dados: Mar/2022',
      text: 'O Instituto Brasileiro de Geografia e Estatística é um instituto público da administração federal brasileira criado em 1934 e instalado em 1936 com o nome de Instituto Nacional de Estatística; seu fundador e grande incentivador foi o estatístico Mário Augusto Teixeira de Freitas. O nome atual data de 1938.',
      content: [
        {
          title : 'FONTE',
          placeholder: 'IBGE',
          items: [
            'IBGE',
          ]
        },
        {
          title : 'INDICADOR',
          placeholder: 'IPCA-15',
          items: [
            'IPCA-15',
          ]
        },
        {
          title : 'UF',
          placeholder: 'ALAGOAS',
          items: [
            'UF 1',
          ]
        },
        {
          title : 'MUNICÍPIO',
          placeholder: 'MACEIÓ',
          items: [
            'município 1',
          ]
        },
      ] 
    }
  ]
}