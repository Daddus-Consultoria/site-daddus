import { ChartRepository } from "@/lib/repositories/ChartRepository";
import { google } from "googleapis";

export class ChartAPIService implements ChartRepository {
  async getAllIndicatorsStateChartData(): Promise<MapChartData[]> {
    const res = await fetch("/api/state-map-charts");
    const data = await res.json();
    return data;
  }
}
