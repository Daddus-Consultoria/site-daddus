import { libraryRepository } from "@/components/providers/repositoriesProviders/libraryProvider";
import type { LibraryQuery } from "@/lib/biblioteca/types";

export class LibraryUseCases {
  libraryRepository;

  constructor() {
    this.libraryRepository = libraryRepository;
  }

  /** Busca da Biblioteca: texto livre combinado com os filtros escolhidos. */
  async searchLibrary(query: LibraryQuery) {
    try {
      return await this.libraryRepository.searchLibrary(query);
    } catch (error) {
      throw error;
    }
  }
}
