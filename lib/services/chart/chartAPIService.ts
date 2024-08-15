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
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/state-map-charts`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error in getAllIndicatorsStateChartData:", error);
      throw error;
    }
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
}

