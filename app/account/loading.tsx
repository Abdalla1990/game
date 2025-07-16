export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 space-y-3">
              <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
