import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200 rounded-xl",
        className
      )}
    />
  );
}

export function PetCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-gray-50 p-3 rounded-2xl space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="bg-gray-50 p-3 rounded-2xl space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function AppointmentCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>
      
      <div>
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-6 w-40" />
      </div>
      
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      
      <Skeleton className="h-10 w-full rounded-lg mt-2" />
    </div>
  );
}
