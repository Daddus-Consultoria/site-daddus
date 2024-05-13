import { VariantProps } from "class-variance-authority";
import { badge } from "./badgeBlog.variants";
import { cn } from "@/lib/utils";

interface BadgeBlogProps extends VariantProps<typeof badge> {
  title: string;
  className?: string;
}

const BadgeBlog: React.FC<BadgeBlogProps> = ({
  title,
  first,
  className,
  colorScheme,
}) => {
  return (
    <div className={cn(badge({ colorScheme, first }), className)}>{title}</div>
  );
};

export { BadgeBlog };
