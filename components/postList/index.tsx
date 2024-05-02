import React from "react";

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
      <div className="bg-primary py-3 px-6">
        <h3 className="font-bold text-white text-lg">{title}</h3>
      </div>
      <ol className="px-5 py-4">
        {posts.map((post, index) => (
          <li key={`post-title-${title.toLowerCase()}${index}`}>
            {post.title}
          </li>
        ))}
      </ol>
    </div>
  );
};

export { PostList };
