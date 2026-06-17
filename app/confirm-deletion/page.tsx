"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

function ConfirmDeletionContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token found in the URL.");
      return;
    }

    const confirmDeletion = async () => {
      try {
        const res = await fetch("/api/auth/confirm-deletion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to delete account");
        }

        // Deletion successful, sign out locally to clear session cookies
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabase.auth.signOut();

        setStatus("success");
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(error.message);
      }
    };

    confirmDeletion();
  }, [token]);

  return (
    <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-lg text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center">
          <Loader2 size={48} className="animate-spin text-primary mb-4" />
          <h1 className="text-2xl font-bold font-display text-dark mb-2">Deleting Account...</h1>
          <p className="text-gray-500">Please wait while we securely remove your data.</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center animate-fade-in">
          <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-2xl font-bold font-display text-dark mb-2">Account Deleted</h1>
          <p className="text-gray-500 mb-6">Your account and all associated personal data have been permanently removed.</p>
          <Link 
            href="/"
            className="bg-primary hover:bg-primary-mid text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md w-full block"
          >
            Return to Homepage
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center animate-fade-in">
          <div className="bg-red-100 p-4 rounded-full text-red-600 mb-4">
            <XCircle size={48} />
          </div>
          <h1 className="text-2xl font-bold font-display text-dark mb-2">Verification Failed</h1>
          <p className="text-gray-500 mb-6">{errorMessage}</p>
          <Link 
            href="/dashboard/settings"
            className="bg-gray-100 hover:bg-gray-200 text-dark px-6 py-3 rounded-xl font-bold transition-all w-full block"
          >
            Back to Settings
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ConfirmDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Suspense fallback={
        <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-lg text-center flex flex-col items-center">
          <Loader2 size={48} className="animate-spin text-primary mb-4" />
          <h1 className="text-2xl font-bold font-display text-dark mb-2">Loading...</h1>
        </div>
      }>
        <ConfirmDeletionContent />
      </Suspense>
    </div>
  );
}
