import LibraryRepository from "@/lib/repositories/LibraryRepository";
import { buildLibrarySearchParams } from "@/lib/biblioteca/searchParams";
import type { LibraryQuery, LibrarySearchResult } from "@/lib/biblioteca/types";

const EMPTY_RESULT: LibrarySearchResult = {
  items: [],
  totalItems: 0,
  facets: { types: [], topics: [], sources: [], languages: [], access: [], years: [] },
  approximate: false,
};

export class LibraryAPIService implements LibraryRepository {
  async searchLibrary(query: LibraryQuery): Promise<LibrarySearchResult> {
    const params = buildLibrarySearchParams(query);

    // A pagina e o tamanho de pagina precisam viajar sempre: o construtor de
    // parametros omite a pagina 1 para deixar a URL do usuario limpa, mas a
    // chamada da API nao pode depender de valor implicito.
    params.set("pagina", String(query.page));
    params.set("ordem", query.order);

    const response = await fetch(`/api/biblioteca/documentos?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`A Biblioteca respondeu ${response.status}`);
    }

    return { ...EMPTY_RESULT, ...((await response.json()) as LibrarySearchResult) };
  }
}
