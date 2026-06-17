"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";

interface CopyUIDProps {
  uid: string;
  prefix?: string;
  className?: string;
}

export default function CopyUID({ uid, prefix = "UID", className }: CopyUIDProps) {
  const [copied, setCopied] = useState(false);

  const shortUid = uid.split("-")[0].toUpperCase();

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(uid);
    setCopied(true);
    toast.success("Copied to clipboard", { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        "group relative flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase border transition-all duration-300",
        copied
          ? "bg-success/10 border-success/20 text-success"
          : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-gray-200 hover:text-dark hover:shadow-sm",
        className
      )}
      title="Click to copy full UID"
      aria-label="Copy full UID"
    >
      <span className="font-medium">
        {prefix}: {shortUid}
      </span>
      {copied ? (
        <Check size={12} className="text-success animate-in zoom-in" />
      ) : (
        <Copy size={12} className="text-gray-400 group-hover:text-primary transition-colors" />
      )}
    </button>
  );
}
