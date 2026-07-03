/**
 * LoadingSkeleton Component
 * Renders pulsing skeleton loaders replicating the CRM Dashboard grid layout to avoid layout shifts.
 */
const LoadingSkeleton = () => {
  return (
    <div className="p-4 md:p-6 space-y-6 w-full select-none animate-pulse">
      {/* Filters Bar Skeleton */}
      <div className="h-14 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl" />

      {/* KPI Cards Skeletons (6 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 h-28 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
            <div className="h-3.5 w-full bg-gray-100 dark:bg-gray-900 rounded-md" />
          </div>
        ))}
      </div>

      {/* Charts Grid Row 1 (Pie & Funnel) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 h-[380px] flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-60 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-[14px] border-gray-200 dark:border-gray-700" />
          </div>
          <div className="h-6 w-3/4 mx-auto bg-gray-150 dark:bg-gray-900 rounded" />
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 h-[380px] flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-60 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-3.5 px-6">
            <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-6 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2 (Bar & Line) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 h-[350px] flex flex-col justify-between">
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex-1 flex items-end gap-3.5 pt-4">
            <div className="w-full h-1/4 bg-gray-200 dark:bg-gray-700 rounded-t" />
            <div className="w-full h-2/5 bg-gray-200 dark:bg-gray-700 rounded-t" />
            <div className="w-full h-3/5 bg-gray-200 dark:bg-gray-700 rounded-t" />
            <div className="w-full h-1/2 bg-gray-200 dark:bg-gray-700 rounded-t" />
            <div className="w-full h-4/5 bg-gray-200 dark:bg-gray-700 rounded-t" />
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-t" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 h-[350px] flex flex-col justify-between">
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 relative">
              <div className="absolute left-[20%] -top-2 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="absolute left-[50%] -top-2 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="absolute left-[80%] -top-2 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
