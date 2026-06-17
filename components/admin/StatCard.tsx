import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: { value: number; label: string };
  variant?: "default" | "primary" | "emergency" | "success" | "warning";
  className?: string;
}

const variantStyles = {
  default: { card: "bg-white", icon: "bg-gray-100", text: "text-dark" },
  primary: { card: "bg-hero-gradient text-white", icon: "bg-white/20", text: "text-white" },
  emergency: { card: "bg-emergency-gradient text-white", icon: "bg-white/20", text: "text-white" },
  success: { card: "bg-success text-white", icon: "bg-white/20", text: "text-white" },
  warning: { card: "bg-warning text-white", icon: "bg-white/20", text: "text-white" },
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];
  const isColored = variant !== "default";

  return (
    <div
      className={cn(
        "rounded-2xl p-6 shadow-card hover-lift",
        styles.card,
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl", styles.icon)}>
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-1 rounded-lg",
              trend.value >= 0
                ? isColored
                  ? "bg-white/20 text-white"
                  : "bg-success/10 text-success"
                : isColored
                ? "bg-white/20 text-white"
                : "bg-emergency/10 text-emergency"
            )}
          >
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      <div>
        <p
          className={cn(
            "text-3xl font-display font-bold mb-1",
            isColored ? "text-white" : "text-dark"
          )}
        >
          {value}
        </p>
        <p
          className={cn(
            "text-sm font-medium",
            isColored ? "text-white/70" : "text-dark/60"
          )}
        >
          {title}
        </p>
        {trend && (
          <p
            className={cn(
              "text-xs mt-1",
              isColored ? "text-white/50" : "text-dark/40"
            )}
          >
            {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
