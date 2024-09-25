import { ChartUseCases } from "../../useCases/chartUseCases";
import { ChartRepository } from "@/lib/repositories/ChartRepository";
import { DataSpreadSheetsGraphic } from "@/lib/interfaces/dataGraphic"

export class ChartAPIService implements ChartUseCases, ChartRepository {
  private static instance: ChartAPIService;
  chartRepository: ChartRepository;

  constructor() {
    // Lazy import to avoid circular dependency
    const { chartRepository } = require('@/components/providers/repositoriesProviders/chartProvider');
    this.chartRepository = chartRepository;
  }

  public static getInstance(): ChartAPIService {
    if (!ChartAPIService.instance) {
      ChartAPIService.instance = new ChartAPIService();
    }
    return ChartAPIService.instance;
  }

  async getAllIndicatorsStateChartData() {
    const res = await fetch("/api/state-map-charts");
    const data = await res.json();
    //console.log(this.formatMapData(data)[0][0][0]);
    console.log(this.formatMapData(data)['2021']);
    console.log(this.formatMapData(data));
    return this.formatMapData(data);
  }

  async gettAllIndicatorsDaddusGraphData(): Promise<DataSpreadSheetsGraphic[]> {
    const res = await fetch("/api/state-graphic-charts");
    const data = await res.json();

    const resultAll = data.slice(1).map((item: string[]) => {
       return {
        dataGraphic: [
          //['Ano', 'Porcentagem'],
          ...item,
        ],
      } 
      //return transformData(item);
    })

    /* {
      dataGraph: [
        ['Ano', 'Porcentagem'],
        ...resultAll,
      ],
      dataSelectors:{
        uf: data[5]
      }
    } */

    return resultAll;
  }

  formatMapData(data: any[]): { [year: string]: [any[], string[]] } {
    const years = data[0].slice(2);
    const result: { [year: string]: [any[], string[]] } = {};

    years.forEach((year: string, yearIndex: number) => {
      const transformedData = data.slice(1).map((row: string[]) => {
        const stateName = row[1];
        const idh = parseFloat(row[yearIndex + 2].replace(',', '.'));
        return [stateName, idh];
      });

      const extractedColors = data.slice(1).map((row: string[]) => row[0]).filter((color: string) => color !== '');

      result[year] = [transformedData, extractedColors];
    });

    return result;
  }

  formatMapTableData(data: any[]): { state: string; idh: string }[] {
    return data.slice(1).map((row: string[]) => ({
      state: row[2],
      idh: row[3],
    }));
  }
}

