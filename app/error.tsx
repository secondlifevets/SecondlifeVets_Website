"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-emergency" size={40} />
        </div>
        <h1 className="font-display text-3xl font-bold text-dark mb-3">Something went wrong</h1>
        <p className="text-gray-500 mb-8 font-medium">
          We apologize for the inconvenience. An unexpected error occurred while loading this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-primary hover:bg-primary-mid text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
          <Link
            href="/"
            className="bg-gray-50 hover:bg-gray-100 text-dark px-6 py-3 rounded-xl font-bold transition-all border border-gray-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
