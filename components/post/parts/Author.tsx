import { PostModel } from "@/lib/interfaces/post";
import Image from "next/image";

export const Author = ({ author }: Pick<PostModel, "author">) => {
  return (
    <div className="flex gap-2 w-full px-4">
      <Image
        className="rounded-full w-[62px] h-[62px]"
        src={author.image.src}
        alt=""
        width={62}
        height={62}
      />
      <div className="flex flex-col gap-2">
        <div>
          Por <span className="text-primary">{author.name}</span>
          <div>{author.role}</div>
        </div>

        <p className="opacity-50">{author.description}</p>
        <div className="text-primary">{author.email}</div>
      </div>
    </div>
  );
};
