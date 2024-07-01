export abstract class ChartRepository {
  abstract getAllIndicatorsStateChartData(): Promise<MapChartData[]>;
}
