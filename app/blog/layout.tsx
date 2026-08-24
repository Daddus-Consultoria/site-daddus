import type { Metadata } from "next";

import { constantCardBlog } from "./_constants";
import { BlogHeader } from "@/components/index";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * O layout deixou de ser client component: nao usa hook nenhum, e sendo server
 * component pode declarar os metadados do blog. O `BlogHeader` continua
 * client — vem do barril `@/components/index`.
 */
export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Análises e notas da equipe da Daddus sobre políticas públicas, economia, governança, mobilidade, inovação e sustentabilidade.",
  path: "/blog",
});

function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col w-full h-full">
      <BlogHeader categorys={constantCardBlog.barItens} />
      {children}
    </div>
  );
}

export default BlogLayout;
