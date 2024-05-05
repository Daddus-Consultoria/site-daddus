import { Post } from "@/lib/interfaces/post";
import React from "react";
import { BlogPostCard } from "@/components/index";
import { getCategoryTranslation } from "@/lib/utils/translateData";

interface BlogPostGridProps {
  title: string;
  posts: Post[];
}

const BlogPostGrid: React.FC<BlogPostGridProps> = ({ posts, title }) => {
  const gridCustomClass = posts.length === 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <div className="w-full">
      <h2 className="ml-2 text-primary font-extrabold text-xl mb-4">{title}</h2>
      <div className={`grid sm:grid-cols-1 md:${gridCustomClass} gap-5`}>
        {posts.map((post, index) => (
          <div className="h-[250px]" key={`post-${post.category}-${index}`}>
            <BlogPostCard
              first={index === 0}
              image={post.image}
              title={post.title}
              badgeTitle={getCategoryTranslation(post.category)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export { BlogPostGrid };
