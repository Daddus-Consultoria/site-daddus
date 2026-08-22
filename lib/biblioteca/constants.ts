import type {
  LibraryAccess,
  LibraryDocumentType,
  LibraryLanguage,
  LibraryOrder,
} from "./types";

/**
 * Rotulos exibidos. O valor guardado no banco e sempre o slug; o rotulo muda
 * sem migration.
 */
export const documentTypeLabels: Record<LibraryDocumentType, string> = {
  livro: "Livro",
  "e-book": "E-book",
  tese: "Tese",
  dissertacao: "Dissertação",
  artigo: "Artigo científico",
  relatorio: "Relatório",
  "nota-tecnica": "Nota técnica",
  estudo: "Estudo",
  guia: "Guia",
  manual: "Manual",
  monografia: "Monografia",
  "documento-institucional": "Documento institucional",
  dados: "Dados / base de dados",
  outro: "Outro",
};

export const languageLabels: Record<LibraryLanguage, string> = {
  pt: "Português",
  en: "Inglês",
  es: "Espanhol",
  outro: "Outros",
};

export const accessLabels: Record<LibraryAccess, string> = {
  "acesso-aberto": "Acesso aberto",
  "leitura-gratuita": "Gratuito para leitura",
  "emprestimo-digital": "Empréstimo digital",
  "acesso-restrito": "Acesso restrito",
  "nao-informado": "Não informado",
};

export const orderLabels: Record<LibraryOrder, string> = {
  relevancia: "Relevância",
  recentes: "Mais recente",
  antigos: "Mais antigo",
  titulo: "Ordem alfabética",
  autor: "Autor",
};

export const documentTypes = Object.keys(documentTypeLabels) as LibraryDocumentType[];
export const languages = Object.keys(languageLabels) as LibraryLanguage[];
export const accessOptions = Object.keys(accessLabels) as LibraryAccess[];
export const orderOptions = Object.keys(orderLabels) as LibraryOrder[];

export const DEFAULT_ORDER: LibraryOrder = "relevancia";
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 48;

/** Parametros da URL — o recorte da Biblioteca precisa ser compartilhavel. */
export const LIBRARY_QUERY_PARAMS = {
  search: "q",
  type: "tipo",
  topic: "tema",
  source: "fonte",
  language: "idioma",
  access: "acesso",
  keyword: "palavra-chave",
  yearFrom: "de",
  yearTo: "ate",
  curated: "curadoria",
  order: "ordem",
  page: "pagina",
} as const;

/**
 * Segmento de rota de cada tipo — /biblioteca/teses, /biblioteca/artigos. Sao
 * paginas proprias porque um recorte estavel e indexavel: quem procura "teses
 * sobre PPP" chega direto.
 */
export const documentTypeRoutes: Record<LibraryDocumentType, string> = {
  livro: "livros",
  "e-book": "e-books",
  tese: "teses",
  dissertacao: "dissertacoes",
  artigo: "artigos",
  relatorio: "relatorios",
  "nota-tecnica": "notas-tecnicas",
  estudo: "estudos",
  guia: "guias",
  manual: "manuais",
  monografia: "monografias",
  "documento-institucional": "documentos-institucionais",
  dados: "dados",
  outro: "outros",
};

export const documentTypeByRoute: Record<string, LibraryDocumentType> = Object.entries(
  documentTypeRoutes
).reduce((accumulator, [type, route]) => ({ ...accumulator, [route]: type }), {});
