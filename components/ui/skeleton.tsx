import { cn } from "@/lib/utils";

interface Props
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "className"> {
  children?: React.ReactNode;
}

const Skeleton = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        [
          "relative",
          "isolate",
          "overflow-hidden",
          "before:via-gray-100/10",
          "before:absolute",
          "before:inset-0",
          "before:-translate-x-full",
          "before:animate-[shimmer_2s_infinite]",
          "before:bg-gradient-to-r",
          "before:from-transparent",
          "before:via-white/50",
          'before:to-transparent"',
        ],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Skeleton;
