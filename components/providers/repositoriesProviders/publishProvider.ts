import { PublishAPIService } from "@/lib/services/publishAPIService";
// import { MockPublishRepository } from "@/lib/mocks/mockPublishRepository";
import PublishRepository from "@/lib/repositories/PublishRepository";

let publishRepository: PublishRepository;

// publishRepository = new MockPublishRepository();

publishRepository = new PublishAPIService();

export { publishRepository };
