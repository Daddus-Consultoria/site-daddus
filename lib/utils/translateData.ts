import { PostCategory } from "@/lib/interfaces/post";

export const getCategoryTranslation = (category: PostCategory): string => {
  switch (category) {
    case "financas":
      return "Finanças";
    case "politicasPublicas":
      return "Políticas Públicas";
    case "governanca":
      return "Governança";
    case "logistica":
      return "Logística";
    case "inovacao":
      return "Inovação";
    case "sustentabilidade":
      return "Sustentabilidade";
    case "oportunidades":
      return "Oportunidades";
    default:
      return "Categoria não encontrada";
  }
};
