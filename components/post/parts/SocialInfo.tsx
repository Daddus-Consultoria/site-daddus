import { AvatarNetwork } from "@/components/avatarNetwork";
import { PostModel } from "@/lib/interfaces/post";
import { FormatDate } from "@/lib/utils/formatDate";

export const SocialInfo = ({
  author,
  publishedAt,
}: Pick<PostModel, "author" | "publishedAt">) => {
  const { publishedDateFormatted, ISODate, publishedDateRelativeToNow } =
    FormatDate(publishedAt);
  return (
    <div className="flex justify-between">
      <div>
        <p className="text-primary underline">{author.name}</p>
        <time
          title={publishedDateRelativeToNow({ prefix: true })}
          dateTime={ISODate}
          className="text-sm text-secondary"
        >
          {publishedDateFormatted}
        </time>
      </div>
      <AvatarNetwork />
    </div>
  );
};
