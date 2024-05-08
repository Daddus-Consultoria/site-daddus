import { PostLayout } from "@/components/post";
import { postItems } from "./_constants";

interface PostPageProps {
  category?: string;
  post?: string;
}

const PostPage = ({ params }: { params: PostPageProps }) => {
  const { post, category } = params;
  const postFound = postItems.find(
    (item) => item.slug === post && item.category === category
  );

  if (!postFound)
    return (
      <div className="m-auto mt-24 text-[#999999]">Nenhum post encontrado</div>
    );
  return <PostLayout {...postFound} />;
};

export default PostPage;
