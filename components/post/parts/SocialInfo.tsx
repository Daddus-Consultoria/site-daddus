import { AvatarNetwork } from "@/components/avatarNetwork";
import { PostModel } from "@/lib/interfaces/post";
import { FormatDate } from "@/lib/utils/formatDate";

export const SocialInfo = ({
  author,
  publishedDate,
}: Pick<PostModel, "author" | "publishedDate">) => {
  const { publishedDateFormatted, ISODate, publishedDateRelativeToNow } =
    FormatDate(publishedDate);
  return (
    <div className="flex justify-between">
      <div>
        <p className="text-primary underline font-semibold">{author.name}</p>
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
