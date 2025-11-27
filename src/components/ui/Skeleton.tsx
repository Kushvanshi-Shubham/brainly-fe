import { memo } from "react";

const CardSkeleton = memo(() => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md w-full max-w-sm flex flex-col h-full animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="flex gap-2">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>

      <div className="rounded overflow-hidden mt-auto">
        <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
});

CardSkeleton.displayName = "CardSkeleton";

const ContentGridSkeleton = memo(({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
});

ContentGridSkeleton.displayName = "ContentGridSkeleton";

export { CardSkeleton, ContentGridSkeleton };
