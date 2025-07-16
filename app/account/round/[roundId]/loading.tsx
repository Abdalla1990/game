export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>

        {/* Game details skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>

          {/* Teams list skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded border space-y-2">
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Stats or additional info skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Action buttons skeleton */}
          <div className="flex justify-end space-x-4">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
