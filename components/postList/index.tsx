import React from "react";
import Link from "next/link";
import { Links } from "@/lib/constants/constants";

interface PostListProps {
  title: string;
  posts: {
    title: string;
    link: string;
  }[];
}

const PostList: React.FC<PostListProps> = ({ posts, title }) => {
  return (
    <div className="rounded-2xl">
      <div className="bg-primary py-3 px-6 rounded-tl-2xl rounded-tr-2xl">
        <h3 className="font-bold text-white text-lg">{title}</h3>
      </div>
      <ol className="py-4 rounded-br-2xl rounded-bl-2xl border">
        {posts.map((post, index) => (
          <li
            className={`${
              index === posts.length - 1 ? "" : "border-b"
            } font-extrabold text-sm`}
            key={`post-title-${title.toLowerCase()}${index}`}
          >
            <Link
              className="flex gap-3 p-5 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
              href={`${Links.SITE_DOMAIN}${post.link}`}
            >
              <span className="text-primary font-extrabold text-2xl">
                {index + 1}.
              </span>
              {post.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export { PostList };
