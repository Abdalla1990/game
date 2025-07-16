export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
