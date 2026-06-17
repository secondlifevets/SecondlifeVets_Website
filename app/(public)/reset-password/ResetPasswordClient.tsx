"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    setLoading(false);

    if (error) {
      console.error("Reset password error:", error);
      toast.error(error?.message && error.message !== "{}" ? error.message : "Couldn't update password. Please try again.");
    } else {
      toast.success("Password updated successfully!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 sm:p-8 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary-light/50 -skew-y-6 transform origin-top-left -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-light rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute top-40 -left-40 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-card border border-white p-8">
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-100 overflow-hidden">
              <img src="/logo.png" alt="Vets on Door Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="font-display text-3xl font-bold text-dark mb-2">
              Set New Password
            </h1>
            <p className="text-gray-500 font-sans text-sm">
              Please enter your new secure password below.
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-12 py-3.5 text-dark focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-12 py-3.5 text-dark focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-primary hover:bg-primary-mid text-white py-3.5 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
