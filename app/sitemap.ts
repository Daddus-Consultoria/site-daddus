import { MetadataRoute } from "next";

import { documentTypeRoutes } from "@/lib/biblioteca/constants";
import { query } from "@/lib/db/pool";

const BASE_URL = "https://www.daddusconsultoria.com";

/** Teto por sitemap: o limite do protocolo e 50 mil URLs. */
const MAX_LIBRARY_DOCUMENTS = 20_000;

/**
 * URLs da Biblioteca. As fichas dos documentos sao indexaveis porque o que
 * publicamos e o registro de metadados, com link para a origem — ver
 * docs/BIBLIOTECA.md, secao "Direitos".
 *
 * Se o banco estiver fora, o sitemap perde a Biblioteca mas continua valido
 * para o resto do site.
 */
const libraryEntries = async (): Promise<MetadataRoute.Sitemap> => {
  try {
    const [documents, topics, types] = await Promise.all([
      query<{ slug: string; updated_at: Date }>(
        `SELECT slug, updated_at FROM library_documents
          ORDER BY updated_at DESC LIMIT ${MAX_LIBRARY_DOCUMENTS}`
      ),
      query<{ slug: string }>("SELECT slug FROM library_topics WHERE active ORDER BY position"),
      query<{ document_type: string }>(
        "SELECT DISTINCT document_type FROM library_documents"
      ),
    ]);

    return [
      { url: `${BASE_URL}/biblioteca`, lastModified: new Date(), priority: 0.9 },
      ...topics.map((topic) => ({
        url: `${BASE_URL}/biblioteca/${topic.slug}`,
        lastModified: new Date(),
        priority: 0.7,
      })),
      ...types.map((type) => ({
        url: `${BASE_URL}/biblioteca/${
          documentTypeRoutes[type.document_type as keyof typeof documentTypeRoutes]
        }`,
        lastModified: new Date(),
        priority: 0.7,
      })),
      ...documents.map((document) => ({
        url: `${BASE_URL}/biblioteca/documento/${document.slug}`,
        lastModified: document.updated_at,
        priority: 0.5,
      })),
    ];
  } catch (error) {
    console.error("Sitemap sem a Biblioteca:", error);

    return [];
  }
};

/** Uma vez por hora: o acervo muda no ritmo da coleta, nao a cada acesso. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    ...(await libraryEntries()),
    {
      url: "https://www.daddusconsultoria.com/",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 1.0,
    },
    {
      url: "https://www.daddusconsultoria.com/institucional/sobre",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/servicos/consultoria",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/servicos/consultoria/elaboracao-politicas-publicas",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/servicos/consultoria/estudo-de-viabilidade",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/servicos/consultoria/modelagem-projetos",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/setores/mobilidade-urbana",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/setores/mobilidade-urbana/transportes",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/setores/mobilidade-urbana/rodovias",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/setores/mobilidade-urbana/portos",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/solucoes",
      lastModified: new Date("2026-08-22T00:00:00+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/blog",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/conteudos/publicacoes",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/conteudos/publicacoes/estudos",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/conteudos/publicacoes/guias",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/conteudos/publicacoes/perfis-municipais",
      lastModified: new Date("2024-05-02T01:18:27+00:00"),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/termos-de-uso",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://www.daddusconsultoria.com/politica-de-privacidade",
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}
