import type { Metadata } from "next";

import { POST_REVALIDATE, postMetadata, renderPostPage } from "@/app/blog/_postPage";

/**
 * Post do blog. A montagem e os metadados vivem em `_postPage.tsx`.
 */
export const revalidate = POST_REVALIDATE;

interface PageProps {
  params: { category: string; post: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return postMetadata(params.category, params.post);
}

export default async function Page({ params }: PageProps) {
  return renderPostPage(params.category, params.post);
}
