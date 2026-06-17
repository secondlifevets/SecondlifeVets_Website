import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: "primary" | "white" | "emergency";
}

const sizes = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-4",
};

const colors = {
  primary: "border-primary-mid border-t-transparent",
  white: "border-white border-t-transparent",
  emergency: "border-emergency border-t-transparent",
};

export default function Spinner({ size = "md", className, color = "primary" }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block rounded-full animate-spin",
        sizes[size],
        colors[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function FullPageSpinner({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <div className="relative">
        <Spinner size="lg" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🐾
        </div>
      </div>
      {message && <p className="text-dark/60 text-sm animate-pulse">{message}</p>}
    </div>
  );
}
