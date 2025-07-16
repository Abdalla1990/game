export default function Loading() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Create New Game Round</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-8">
          {/* Round Name Skeleton */}
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>

          {/* Teams Skeleton */}
          <div>
            <div className="h-5 w-16 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Categories Skeleton */}
          <div>
            <div className="h-5 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Submit Button Skeleton */}
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
