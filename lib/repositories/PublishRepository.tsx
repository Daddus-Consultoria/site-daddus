import {
  PublishData,
  PublishModel,
  PublishIndexEntry,
  PublishQuery,
} from "../interfaces/publish";
import { PublishCategories } from "@/lib/constants/constants";

abstract class PublishRepository {
  abstract getPublish (title?: string, category?: PublishCategories): Promise<PublishData>;

  abstract getPublishById (slug:string, category:PublishCategories): Promise<PublishModel | null>;

  abstract getPaginatedPublish (page: number, limit: number, category?:string, order?:"asc" | "desc"): Promise<PublishData>;

  /** Busca paginada do acervo, com busca textual e filtros combinaveis. */
  abstract searchPublish (query: PublishQuery): Promise<PublishData>;

  /** Lista enxuta do acervo, usada para montar as opcoes de filtro disponiveis. */
  abstract getPublishIndex (category?: PublishCategories): Promise<PublishIndexEntry[]>;
}

export default PublishRepository;
