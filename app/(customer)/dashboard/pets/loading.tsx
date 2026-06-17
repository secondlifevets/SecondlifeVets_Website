import { PetCardSkeleton } from "@/components/ui/Skeleton";

export default function PetsLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-9 w-40 bg-gray-200 animate-pulse rounded-xl mb-2" />
          <div className="h-5 w-64 bg-gray-200 animate-pulse rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PetCardSkeleton />
        <PetCardSkeleton />
        <PetCardSkeleton />
      </div>
    </div>
  );
}
