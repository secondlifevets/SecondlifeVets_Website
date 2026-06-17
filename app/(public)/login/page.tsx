"use client";

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, ArrowRight, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import clsx from "clsx";
import { Suspense } from "react";
import Image from "next/image";

function OTPInput({ 
  length = 8, 
  onComplete 
}: { 
  length?: number, 
  onComplete: (code: string) => void 
}) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combined = newOtp.join("");
    if (combined.length === length && newOtp.every(d => d !== "")) {
      onComplete(combined);
    }

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    if (pastedData.length < length) {
      inputRefs.current[pastedData.length]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
      if (newOtp.every(d => d !== "")) {
        onComplete(newOtp.join(""));
      }
    }
  };

  return (
    <div className="flex justify-between gap-2 max-w-full overflow-x-auto pb-2 px-1 custom-scrollbar">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={clsx(
            "w-10 h-12 sm:w-12 sm:h-14 bg-white border-2 rounded-xl text-center text-xl font-bold text-dark transition-all shrink-0 shadow-sm",
            digit ? "border-primary ring-1 ring-primary/20 scale-105" : "border-gray-200 focus:border-primary-mid focus:ring-2 focus:ring-primary/20"
          )}
        />
      ))}
    </div>
  );
}

function LoginForm() {
  // Default to password mode
  const [mode, setMode] = useState<"password" | "otp" | "forgot">("password");
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const supabase = createClient();

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });

    setLoading(false);

    if (error) {
      console.error("Send OTP error:", error);
      toast.error(error?.message && error.message !== "{}" ? error.message : "Couldn't send security code. Please try again.");
    } else {
      toast.success("Security code sent to your email!");
      setStep("otp");
      setCooldown(60);
    }
  };

  const handleVerifyOtp = async (token: string) => {
    if (token.length !== 8) return;
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    setLoading(false);

    if (error) {
      console.error("Verify OTP error:", error);
      toast.error(error?.message && error.message !== "{}" ? error.message : "This code is invalid or has expired.");
    } else {
      toast.success("Successfully verified!");
      router.push(redirectTo);
      router.refresh();
    }
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        }
      });
      setLoading(false);
      if (error) {
        console.error("Sign up error:", error);
        toast.error(error?.message && error.message !== "{}" ? error.message : "Couldn't create account. Please try again.");
      } else {
        toast.success("Check your email to verify your account before logging in!", { duration: 6000 });
        setIsSignUp(false);
        setPassword("");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        console.error("Sign in error:", error);
        toast.error(error?.message && error.message !== "{}" ? error.message : "Invalid email or password.");
      } else {
        toast.success("Welcome back!");
        router.push(redirectTo);
        router.refresh();
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address first.");
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      setLoading(false);
      
      if (error) {
        console.error("Reset password error object:", error);
        // Supabase sometimes returns an empty object as error string if rate limited or if the email provider fails
        const errorMessage = error?.message && error.message !== "{}" 
          ? error.message 
          : "Couldn't send reset link. Please check your email and try again.";
        toast.error(errorMessage);
      } else {
        toast.success("Password reset instructions sent to your email!");
        setMode("password");
      }
    } catch (err) {
      setLoading(false);
      console.error("Reset password exception:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      toast.error(error?.message && error.message !== "{}" ? error.message : "Couldn't sign in with Google. Please try again.");
      setLoading(false);
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
              {step === "otp" ? "Check Your Email" : mode === "forgot" ? "Reset Password" : isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-500 font-sans text-sm">
              {step === "otp" 
                ? `We've sent an 8-digit code to ${email}` 
                : mode === "forgot" ? "Enter your email to receive a reset link."
                : "Manage your pets and appointments seamlessly."}
            </p>
          </div>

          {/* Mode Toggle (only show if not in OTP verification step and not in forgot password mode) */}
          {step === "email" && mode !== "forgot" && (
            <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
              <button
                onClick={() => setMode("password")}
                className={clsx(
                  "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                  mode === "password" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-dark"
                )}
              >
                Email & Password
              </button>
              <button
                onClick={() => setMode("otp")}
                className={clsx(
                  "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                  mode === "otp" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-dark"
                )}
              >
                Magic Link (OTP)
              </button>
            </div>
          )}

          {step === "otp" ? (
            <div className="space-y-6 animate-slide-in-right">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 text-center">Enter 8-Digit Security Code</label>
                  <OTPInput length={8} onComplete={handleVerifyOtp} />
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    disabled={loading || cooldown > 0}
                    onClick={() => handleSendOtp()}
                    className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-dark py-3.5 rounded-2xl font-bold transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't receive it? Resend"}
                  </button>
                  <button
                    onClick={() => { setStep("email"); setCooldown(0); }}
                    className="w-full py-2 text-gray-500 font-medium hover:text-dark transition-colors text-sm"
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            </div>
          ) : mode === "forgot" ? (
            <div className="space-y-6 animate-slide-in-right">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-dark focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-primary hover:bg-primary-mid text-white py-3.5 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
                </button>
                
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setMode("password")} className="text-gray-500 text-sm font-medium hover:text-dark transition-colors">
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          ) : mode === "password" ? (
            <div className="space-y-6 animate-slide-in-right">
              <form onSubmit={handlePasswordAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-dark focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 px-1">
                    <label className="block text-sm font-bold text-gray-700">Password</label>
                    {!isSignUp && (
                      <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary font-bold hover:underline">
                        Forgot Password?
                      </button>
                    )}
                  </div>
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
                
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full bg-primary hover:bg-primary-mid text-white py-3.5 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : isSignUp ? "Create Account" : "Sign In"}
                </button>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                  <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-bold ml-1 hover:underline">
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </form>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-in-right">
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-dark focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-primary hover:bg-primary-mid text-white py-3.5 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>Send Magic Link <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === "email" && mode !== "forgot" && (
            <>
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-dark py-3.5 rounded-2xl font-bold transition-all shadow-sm flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}

          <p className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
            By signing in, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. <br/>
            Need help? <Link href="/contact-vet-lahore" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
