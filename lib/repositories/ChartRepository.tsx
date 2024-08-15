export abstract class ChartRepository {
  abstract getAllIndicatorsStateChartData(): Promise<[any[], string[]]>;

  abstract gettAllIndicatorsDaddusGraphData(): Promise<any[]>;
}
