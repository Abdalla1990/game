export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="h-12 w-3/4 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
