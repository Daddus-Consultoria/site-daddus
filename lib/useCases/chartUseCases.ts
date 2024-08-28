import { chartRepository } from "@/components/providers/repositoriesProviders/chartProvider";
export class ChartUseCases {
  chartRepository;
  constructor() {
    this.chartRepository = chartRepository;
  }

  async getAllIndicatorsStateChartData() {
    try {
      return await this.chartRepository.getAllIndicatorsStateChartData();
    } catch (error) {
      throw error;
    }
  }

  async gettAllIndicatorsDaddusGraphData() {
    try {
      return await this.chartRepository.gettAllIndicatorsDaddusGraphData();
    } catch (error) {
      throw error;
    }
  }
}
