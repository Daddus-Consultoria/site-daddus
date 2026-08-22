"use client";

import { useQuery } from "@tanstack/react-query";
import { RelatedPublications } from "@/components/relatedPublications";
import { QueryKeys } from "@/lib/constants/queryKeys";
import { transformCategory } from "@/lib/constants/constants";
import { PublishModel } from "@/lib/interfaces/publish";
import { PublishUseCases } from "@/lib/useCases/publishUseCases";

/**
 * As paginas institucionais e de setores traziam uma lista fixa de publicacoes
 * de exemplo, com links para "#". Aqui as publicacoes vem do CMS e os links
 * levam mesmo ao conteudo. Sem publicacao cadastrada, o bloco nao aparece.
 */
export function UltimasPublicacoes({ quantidade = 3 }: { quantidade?: number }) {
  const { data } = useQuery({
    queryKey: [QueryKeys.allPublishs, "ultimas", quantidade],
    queryFn: async () => {
      const useCases = new PublishUseCases();
      const [estudos, guias, perfis] = await Promise.all([
        useCases.getPaginatedStudies({ page: 1, limit: quantidade, order: "desc" }),
        useCases.getPaginatedGuides({ page: 1, limit: quantidade, order: "desc" }),
        useCases.getPaginatedMunicipalProfiles({ page: 1, limit: quantidade, order: "desc" }),
      ]);

      return [...estudos.items, ...guias.items, ...perfis.items]
        .sort((a, b) => new Date(b.publishDate ?? 0).getTime() - new Date(a.publishDate ?? 0).getTime())
        .slice(0, quantidade)
        .map((publicacao: PublishModel) => ({
          title: publicacao.title ?? "",
          link: `/conteudos/publicacoes/${transformCategory[publicacao.category]}/${publicacao.slug}`,
        }));
    },
  });

  if (!data?.length) return null;

  return <RelatedPublications publicationsRelated={data} />;
}
