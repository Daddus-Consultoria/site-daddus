import Skeleton from "@/components/ui/skeleton";

interface BlogGridSkeletonProps {
  className?: string;
}

const BlogGridSkeleton = ({ className }: BlogGridSkeletonProps) => {
  return (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        <Skeleton
          className={`${className}`}
          key={`blog-grid-skeleton-${index}`}
        >
          <div className="h-[250px] m-auto bg-mediumGray rounded-lg w-full"></div>
        </Skeleton>
      ))}
    </>
  );
};

export { BlogGridSkeleton };
