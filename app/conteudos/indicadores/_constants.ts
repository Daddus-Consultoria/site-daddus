import { title } from "process";

export const constantsIndicators = {
  sections: [
    {
      id: 'idh',
      title: 'Mapa do IDH',
      dataSource: 'Base de dados: Out/2021',
      description: 'O Índice de Desenvolvimento Humano (IDH) compara indicadores de países nos itens riqueza, alfabetização, educação, esperança de vida, natalidade e outros, com o intuito de avaliar o bem-estar de uma população, especialmente das crianças.',
      images: [
        {
          src: '/images/temporary_tests/idh_map.svg',
          alt: 'Mapa do IDH'
        },
        {
          src: '/images/temporary_tests/idh_table.svg',
          alt: 'Tabela do IDH'
        }
      ]
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
            'indicador 1',
          ]
        },
        {
          title : 'ANO',
          placeholder: 'IDH',
          items: [
            'ano 1',
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
            'fonte 1',
          ]
        },
        {
          title : 'INDICADOR',
          placeholder: 'IPCA-15',
          items: [
            'indicador 1',
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