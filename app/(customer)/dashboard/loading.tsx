import { AppointmentCardSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-9 w-64 bg-gray-200 animate-pulse rounded-xl mb-2" />
          <div className="h-5 w-72 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-b border-gray-100 pb-2">
          <div className="h-7 w-40 bg-gray-200 animate-pulse rounded-lg" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
        </div>
      </div>
    </div>
  );
}
