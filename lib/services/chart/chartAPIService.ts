import { GraphicChart } from "@/lib/interfaces/graphicChart";
import { ChartRepository } from "@/lib/repositories/ChartRepository";
import { google } from "googleapis";

export class ChartAPIService implements ChartRepository {
  async getAllIndicatorsStateChartData(): Promise<MapChartData[]> {
    const res = await fetch("/api/state-map-charts");
    const data = await res.json();
    return data;
  }

  async gettAllIndicatorsDaddusGraphData(): Promise<GraphicChart[]> {
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
