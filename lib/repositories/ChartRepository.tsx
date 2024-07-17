export abstract class ChartRepository {
  abstract getAllIndicatorsStateChartData(): Promise<MapChartData[]>;

  abstract gettAllIndicatorsDaddusGraphData(): Promise<any[]>;
}
