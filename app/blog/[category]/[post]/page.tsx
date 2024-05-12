"use client";
import { PostLayout } from "@/components/post";
import { postItems } from "./_constants";
import { PostsUseCases } from "@/lib/useCases/postsUseCases";
import { useQuery } from "@tanstack/react-query";
interface PostPageProps {
  category?: string;
  post?: string;
}

const PostPage = ({ params }: { params: PostPageProps }) => {
  const { post, category } = params;

  const usePostUseCases = new PostsUseCases();

  const { data: postData, isLoading: isLoadingPost } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return await usePostUseCases.getSinglePost({
        slug: post!,
        category: category!,
      });
    },
  });

  const { data: lastPosts, isLoading: isLoadingLastPost } = useQuery({
    queryKey: ["lastPosts"],
    queryFn: async () => {
      return await usePostUseCases.getPosts({
        category: category!,
        limit: 3,
        order: "desc",
      });
    },
  });

  const isLoading = isLoadingPost || isLoadingLastPost;

  return (
    <PostLayout
      loading={isLoading}
      post={postData}
      lastPosts={lastPosts?.posts}
    />
  );
};

export default PostPage;
