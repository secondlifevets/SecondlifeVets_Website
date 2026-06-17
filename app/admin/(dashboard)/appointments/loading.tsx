export default function Loading() {
  return (
    <div className="p-4 sm:p-8 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-48 mb-6"></div>
      
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-10 w-full lg:w-64 bg-gray-200 rounded-xl lg:ml-auto"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-4">
          <div className="h-10 bg-gray-50 rounded-lg w-full mb-4"></div>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-16 bg-gray-50 rounded-xl w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
