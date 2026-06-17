export default function SettingsLoading() {
  return (
    <div className="max-w-2xl animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-72 mb-8"></div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
          <div className="w-20 h-20 bg-gray-200 rounded-full shrink-0"></div>
          <div className="flex flex-col gap-2">
            <div className="h-6 bg-gray-200 rounded-md w-40"></div>
            <div className="h-4 bg-gray-100 rounded w-32"></div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="h-4 bg-gray-100 rounded w-24 mb-2"></div>
            <div className="h-12 bg-gray-50 rounded-xl w-full border border-gray-100"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-100 rounded w-32 mb-2"></div>
            <div className="h-12 bg-gray-50 rounded-xl w-full border border-gray-100"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-100 rounded w-28 mb-2"></div>
            <div className="h-24 bg-gray-50 rounded-xl w-full border border-gray-100"></div>
          </div>

          <div className="pt-4 flex justify-end">
            <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
