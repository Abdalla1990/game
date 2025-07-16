export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Question content skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
          </div>

          {/* Options skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Controls skeleton */}
          <div className="flex justify-between pt-4">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
