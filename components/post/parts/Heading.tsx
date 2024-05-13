import { PostModel } from "@/lib/interfaces/post";

export const Heading = ({
  title,
  authorComment,
}: Pick<PostModel, "title" | "authorComment">) => {
  return (
    <>
      <h1 className="font-extrabold text-3xl text-primary">{title}</h1>
      <p className="font-light">{authorComment}</p>
    </>
  );
};
