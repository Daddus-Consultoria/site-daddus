import { PostModel } from "@/lib/interfaces/post";
import React from "react";
import { BlogPostCard } from "@/components/index";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BlogGridSkeleton } from "./parts/GridSkeleton";

const blogPostVariants = cva("grid sm:grid-cols-1 gap-5", {
  variants: {
    variant: {
      default: "md:grid-cols-2",
      three: "md:grid-cols-3",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface BlogPostGridProps extends VariantProps<typeof blogPostVariants> {
  title: string;
  posts: PostModel[];
  isPostsLoading?: boolean;
}

const BlogPostGrid: React.FC<BlogPostGridProps> = ({
  posts,
  title,
  isPostsLoading = false,
  variant,
}) => {
  return (
    <div className="w-full">
      <h2 className="ml-2 text-primary font-extrabold text-xl mb-4">{title}</h2>
      <div className={cn(blogPostVariants({ variant }))}>
        {!isPostsLoading ? (
          posts.map((post, index) => (
            <div className="h-[250px]" key={`post-${post.category}-${index}`}>
              <BlogPostCard
                first={index === 0}
                image={post.image}
                title={post.title}
                href={`/blog/${post.category}/${post.slug}`}
                badgeTitle={post.category}
              />
            </div>
          ))
        ) : (
          <BlogGridSkeleton />
        )}
      </div>
    </div>
  );
};

export { BlogPostGrid };
