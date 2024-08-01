import { DataSpreadSheetsGraphic } from "../interfaces/dataGraphic";

export abstract class ChartRepository {
  abstract getAllIndicatorsStateChartData(): Promise<MapChartData[]>;

  abstract gettAllIndicatorsDaddusGraphData(): Promise<DataSpreadSheetsGraphic[]>;
}
