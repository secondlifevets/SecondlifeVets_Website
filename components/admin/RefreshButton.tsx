"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

export default function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000); // Visual feedback duration
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-bold text-gray-600 disabled:opacity-50"
      title="Refresh Dashboard"
    >
      <RefreshCw size={16} className={clsx(isRefreshing && "animate-spin text-primary")} />
      <span className="hidden sm:inline">Refresh</span>
    </button>
  );
}
