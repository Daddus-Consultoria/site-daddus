import { ChartUseCases } from "../../useCases/chartUseCases";
import { ChartRepository } from "@/lib/repositories/ChartRepository";

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

  async gettAllIndicatorsDaddusGraphData(): Promise<any[]> {
    const res = await fetch("/api/state-graphic-charts");
    const data = await res.json();

    const resultAll = data.slice(1).map((item: string[]) => {
      return transformData(item);
    })

    return [
      ['Ano', 'Porcentagem'],
      ...resultAll,
    ]
  }
}

const transformData = (data: string[]) =>{
  return [parseInt(data[3]), parseFloat(data[4].replace(',','.'))]
}
