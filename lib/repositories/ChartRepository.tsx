import { DataSpreadSheetsGraphic } from "../interfaces/dataGraphic";

export abstract class ChartRepository {
  abstract getAllIndicatorsStateChartData(): Promise<{ [year: string]: [any[], string[]] }>;
  abstract gettAllIndicatorsDaddusGraphData(): Promise<DataSpreadSheetsGraphic[]>;
}
