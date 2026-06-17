import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "success" | "warning" | "emergency" | "info" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary-light text-primary border-primary/30",
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  emergency: "bg-emergency/10 text-emergency border-emergency/30",
  info: "bg-blue-50 text-blue-600 border-blue-200",
  gray: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function Badge({
  variant = "primary",
  children,
  className,
  pulse = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        variantStyles[variant],
        pulse && "animate-pulse",
        className
      )}
    >
      {children}
    </span>
  );
}
