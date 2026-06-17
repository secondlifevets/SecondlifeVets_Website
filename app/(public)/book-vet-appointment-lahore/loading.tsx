export default function Loading() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50 flex justify-center">
      <div className="container px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-7">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <div className="flex gap-4 mb-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                    <div className="h-12 bg-gray-100 rounded-xl w-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column Skeleton */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
              <div className="space-y-4 mb-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-50 rounded-xl w-full animate-pulse"></div>
                ))}
              </div>
              <div className="h-14 bg-gray-200 rounded-xl w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
