import { Skeleton } from "@/components/common/Skeleton";

export function SkeletonCard() {
  return (
    <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm flex flex-col" aria-hidden="true" aria-busy="true">
      {/* Image area */}
      <Skeleton className="w-full aspect-[4/3] rounded-none" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Title */}
        <Skeleton className="h-5 w-3/4 rounded-md" />

        {/* Location */}
        <Skeleton className="h-4 w-1/2 rounded-md" />

        {/* Specs row */}
        <div className="border-t border-border mt-auto pt-3 flex items-center gap-4">
          <Skeleton className="h-4 w-8 rounded-md" />
          <Skeleton className="h-4 w-8 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md mr-auto" />
        </div>
      </div>
    </div>
  );
}
