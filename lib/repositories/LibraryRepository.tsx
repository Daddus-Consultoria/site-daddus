import type { LibraryQuery, LibrarySearchResult } from "@/lib/biblioteca/types";

/**
 * Contrato da Biblioteca no cliente. Diferente das publicacoes da Daddus — que
 * vem do Strapi —, a Biblioteca e servida pelo proprio site, que consulta o
 * Postgres no servidor.
 */
abstract class LibraryRepository {
  /** Busca com filtros combinaveis; devolve tambem as facetas do recorte. */
  abstract searchLibrary(query: LibraryQuery): Promise<LibrarySearchResult>;
}

export default LibraryRepository;
