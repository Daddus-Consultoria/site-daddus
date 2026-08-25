import { CATEGORY_LABELS_BLOG } from "@/app/blog/[category]/_constants";
import { sistemas } from "@/app/tecnologia/_constants";
import { getIndicatorSlugs } from "@/lib/indicadores/queries";
import { type SitemapEntry, urlsetXml, xmlResponse } from "@/lib/seo/sitemap";

/**
 * Paginas fixas do site.
 *
 * A lista anterior tinha envelhecido: nao anunciava a Biblioteca, o ecossistema
 * de tecnologia, o contato nem os indicadores, e ainda listava `/indicadores` e
 * `/termos-de-uso`, que hoje redirecionam. Aqui as paginas geradas a partir de
 * uma lista (os sistemas, as categorias do blog) saem dessa mesma lista, para
 * que criar um sistema novo nao exija lembrar deste arquivo.
 *
 * Ficam de fora, de proposito: `/login` e `/painel/*` (area de sessao) e as
 * rotas legadas que redirecionam.
 */
export const revalidate = 86400;

const entries = (): SitemapEntry[] => [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },

  // Conhecimento — a frente que o sitemap mais precisa expor.
  { path: "/biblioteca", priority: 0.9, changeFrequency: "daily" },
  { path: "/conteudos/publicacoes", priority: 0.9, changeFrequency: "weekly" },
  { path: "/conteudos/publicacoes/estudos", priority: 0.8, changeFrequency: "weekly" },
  { path: "/conteudos/publicacoes/guias", priority: 0.8, changeFrequency: "weekly" },
  { path: "/conteudos/publicacoes/perfis-municipais", priority: 0.8, changeFrequency: "weekly" },
  { path: "/conteudos/indicadores", priority: 0.7, changeFrequency: "weekly" },

  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  ...Object.keys(CATEGORY_LABELS_BLOG).map((category) => ({
    path: `/blog/${category}`,
    priority: 0.6,
    changeFrequency: "weekly" as const,
  })),

  // Consultoria.
  { path: "/servicos/consultoria", priority: 0.8, changeFrequency: "monthly" },
  { path: "/servicos/consultoria/elaboracao-politicas-publicas", priority: 0.7, changeFrequency: "monthly" },
  { path: "/servicos/consultoria/estudo-de-viabilidade", priority: 0.7, changeFrequency: "monthly" },
  { path: "/servicos/consultoria/modelagem-projetos", priority: 0.7, changeFrequency: "monthly" },
  { path: "/setores/mobilidade-urbana", priority: 0.7, changeFrequency: "monthly" },
  { path: "/setores/mobilidade-urbana/portos", priority: 0.6, changeFrequency: "monthly" },
  { path: "/setores/mobilidade-urbana/rodovias", priority: 0.6, changeFrequency: "monthly" },
  { path: "/setores/mobilidade-urbana/transportes", priority: 0.6, changeFrequency: "monthly" },

  // Tecnologia.
  { path: "/tecnologia", priority: 0.8, changeFrequency: "monthly" },
  ...sistemas.map((sistema) => ({
    path: `/tecnologia/${sistema.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  { path: "/solucoes", priority: 0.7, changeFrequency: "monthly" },

  // Institucional.
  { path: "/institucional/sobre", priority: 0.7, changeFrequency: "monthly" },
  { path: "/institucional/contato", priority: 0.6, changeFrequency: "yearly" },
  { path: "/institucional/termos-de-uso", priority: 0.3, changeFrequency: "yearly" },
  { path: "/politica-de-privacidade", priority: 0.3, changeFrequency: "yearly" },
];

/**
 * As paginas dos indicadores saem do banco, e nao de uma lista fixa: ativar uma
 * serie nova ja a anuncia ao buscador, sem passar por aqui.
 *
 * Falha do banco nao pode derrubar o sitemap inteiro — as dezenas de paginas
 * fixas acima valem mais do que as dezesseis que faltariam, e um sitemap com
 * erro 500 tira todas de circulacao.
 */
const indicatorEntries = async (): Promise<SitemapEntry[]> => {
  try {
    return (await getIndicatorSlugs()).map((slug) => ({
      path: `/conteudos/indicadores/${slug}`,
      priority: 0.6,
      changeFrequency: "daily" as const,
    }));
  } catch (error) {
    console.error("Sitemap: falha ao listar os indicadores", error);

    return [];
  }
};

export async function GET() {
  return xmlResponse(urlsetXml([...entries(), ...(await indicatorEntries())]));
}
