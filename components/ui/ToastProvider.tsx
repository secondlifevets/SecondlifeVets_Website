"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "bg-white border-gray-100 shadow-xl rounded-2xl font-sans",
          title: "text-dark font-bold text-sm",
          description: "text-gray-500 text-xs",
          success: "border-success/20 bg-success/5 text-success",
          error: "border-emergency/20 bg-emergency/5 text-emergency",
          warning: "border-amber-200 bg-amber-50 text-amber-700",
          info: "border-primary/20 bg-primary/5 text-primary",
        },
      }}
    />
  );
}
