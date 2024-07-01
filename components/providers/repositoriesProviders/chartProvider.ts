import { ChartRepository } from "@/lib/repositories/ChartRepository";
import { ChartAPIService } from "@/lib/services/chart/chartAPIService";

let chartRepository: ChartRepository;
chartRepository = new ChartAPIService();
export { chartRepository };
