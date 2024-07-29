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
    const res = await fetch("/api/state-map-charts");
    const data = await res.json();
    console.log(this.formatMapData(data))
    return data;
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

  formatMapData(data: any[]): [any[], string[]] {
    const transformedData = [
      ['State', 'IDH'],
      ...data.slice(1).map((row: string[]) => {
        const stateName = row[2];
        const idh = parseFloat(row[3].replace(',', '.')); // Convert IDH to number
        return [stateName, idh];
      })
    ];

    const extractedColors = data
      .slice(1)
      .map((row: string[]) => row[1])
      .filter((color: string) => color !== '');


    return [transformedData, extractedColors];
  }

  formatMapTableData(data: any[]): { state: string; idh: string }[] {
    return data.slice(1).map((row: string[]) => ({
      state: row[2],
      idh: row[3],
    }));
  }
}

const transformData = (data: string[]) => {
  return [parseInt(data[3]), parseFloat(data[4].replace(',', '.'))]
}