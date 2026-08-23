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

  /** Numeros e temas do acervo, para as telas que apresentam a Biblioteca. */
  async getLibrarySummary() {
    try {
      return await this.libraryRepository.getLibrarySummary();
    } catch (error) {
      throw error;
    }
  }
}
