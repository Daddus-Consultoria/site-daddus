import type { LibraryQuery, LibrarySearchResult, LibrarySummary } from "@/lib/biblioteca/types";

/**
 * Contrato da Biblioteca no cliente. Diferente das publicacoes da Daddus — que
 * vem do Strapi —, a Biblioteca e servida pelo proprio site, que consulta o
 * Postgres no servidor.
 */
abstract class LibraryRepository {
  /** Busca com filtros combinaveis; devolve tambem as facetas do recorte. */
  abstract searchLibrary(query: LibraryQuery): Promise<LibrarySearchResult>;

  /** Retrato do acervo para quem ainda nao pesquisou: numeros e temas. */
  abstract getLibrarySummary(): Promise<LibrarySummary>;
}

export default LibraryRepository;
