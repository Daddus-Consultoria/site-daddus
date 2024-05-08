import { PostModel } from "@/lib/interfaces/post";

export const Heading = ({
  title,
  subtitle,
}: Pick<PostModel, "title" | "subtitle">) => {
  return (
    <>
      <h1 className="font-extrabold text-3xl text-primary">{title}</h1>
      <p className="font-light">{subtitle}</p>
    </>
  );
};
