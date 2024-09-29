import { ChartUseCases } from "../../useCases/chartUseCases";
import { ChartRepository } from "@/lib/repositories/ChartRepository";
import { DataSpreadSheetsGraphic } from "@/lib/interfaces/dataGraphic"

import { google } from "googleapis";

export class ChartAPIService implements ChartUseCases, ChartRepository {
  private static instance: ChartAPIService;
  chartRepository: ChartRepository;
  private apiURL = process.env.NEXT_PUBLIC_SITE_API_URL;

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
    const res = await fetch(`${this.apiURL}/state-map-charts`);
    const data = await res.json();

    /* const auth = await google.auth.getClient({
      projectId: process.env.GOOGLE_SHEETS_PROJECT_ID,
      credentials: {
        type: "service_account",
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
        token_url: "https://oauth2.googleapis.com/token",
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
  
    const sheets = google.sheets({ version: "v4", auth });
    const range = "A1:Z1000";
  
    const data = await sheets.spreadsheets.values.get({
      spreadsheetId:process.env.GOOGLE_SHEETS_MAP_CHART_SPREADSHEET_ID,
      range: range,
    });
  
    res.status(200).json(data.data.values); */

    return this.formatMapData(data);
  }

  async gettAllIndicatorsDaddusGraphData(): Promise<DataSpreadSheetsGraphic[]> {
    const res = await fetch(`${this.apiURL}/state-graphic-charts`); // colocar a rota https://daddus.....

    const data = await res.json();

    const resultAll = data.slice(1).map((item: string[]) => {
       return {
        dataGraphic: [
          //['Ano', 'Porcentagem'],
          ...item,
        ],
      } 
      //return transformData(item);
    })

    /* {
      dataGraph: [
        ['Ano', 'Porcentagem'],
        ...resultAll,
      ],
      dataSelectors:{
        uf: data[5]
      }
    } */

    return resultAll;
  }

  formatMapData(data: any[]): { [year: string]: [any[], string[]] } {
    const years = data[0].slice(2);
    const result: { [year: string]: [any[], string[]] } = {};
    years.forEach((year: string, yearIndex: number) => {
      const transformedData = data.slice(1).map((row: string[]) => {
        const stateName = row[1];
        const idh = parseFloat(row[yearIndex + 2].replace(',', '.'));
        return [stateName, idh];
      });
      const extractedColors = data.slice(1).map((row: string[]) => row[0]).filter((color: string) => color !== '');
      result[year] = [transformedData, extractedColors];
    });
    return result;
  }

  formatMapTableData(data: any[]): { state: string; idh: string }[] {
    return data.slice(1).map((row: string[]) => ({
      state: row[2],
      idh: row[3],
    }));
  }
}

