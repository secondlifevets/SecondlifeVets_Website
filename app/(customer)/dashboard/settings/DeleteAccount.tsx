"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const requestDeletion = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/auth/request-deletion", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to request deletion");
      }

      toast.success("Verification email sent! Please check your inbox.");
      setShowConfirm(false);
    } catch (error: any) {
      console.error("Account deletion error:", error);
      toast.error(error?.message && error.message !== "{}" ? error.message : "Couldn't send verification email. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-red-50 rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm mt-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-100 text-red-600 rounded-2xl shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-red-900 mb-2">Danger Zone</h3>
          <p className="text-red-700 text-sm mb-4">
            Permanently delete your account and all associated data (pets, profile). This action is irreversible. Appointments will be kept for our records but unlinked from your account.
          </p>
          
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 transition-all shadow-sm"
            >
              Delete Account
            </button>
          ) : (
            <div className="bg-white border border-red-200 p-4 rounded-xl shadow-sm">
              <p className="text-sm font-bold text-dark mb-3">Are you absolutely sure?</p>
              <div className="flex gap-3">
                <button
                  onClick={requestDeletion}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Yes, send verification email"}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                  className="bg-gray-100 hover:bg-gray-200 text-dark px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
