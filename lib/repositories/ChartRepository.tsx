import { DataSpreadSheetsGraphic } from "../interfaces/dataGraphic";

export abstract class ChartRepository {
  abstract getAllIndicatorsStateChartData(): Promise<[any[], string[]]>;

  abstract gettAllIndicatorsDaddusGraphData(): Promise<DataSpreadSheetsGraphic[]>;
}
