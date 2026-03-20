import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => (
  <div className="flex flex-col gap-3">
    <Skeleton className="aspect-[3/4] rounded-none" />
    <div className="flex justify-between items-start px-1">
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 rounded-none mb-2" />
        <Skeleton className="h-3 w-1/2 rounded-none" />
      </div>
      <Skeleton className="h-4 w-16 rounded-none" />
    </div>
  </div>
);
