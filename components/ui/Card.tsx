import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  className,
  hover = true,
  gradient = false,
  padding = "md",
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "card",
        hover && "hover-lift",
        gradient && "bg-card-gradient",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function ServiceCard({
  icon,
  name,
  description,
  duration,
  priceRange,
  isEmergency,
  className,
}: {
  icon: string;
  name: string;
  description: string;
  duration: number;
  priceRange?: string;
  isEmergency?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card p-6 hover-lift group cursor-pointer relative overflow-hidden",
        isEmergency && "border-emergency/20",
        className
      )}
    >
      {isEmergency && (
        <div className="absolute top-4 right-4">
          <span className="badge bg-emergency/10 text-emergency border-emergency/30 text-[10px] animate-pulse">
            🚨 Emergency
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110",
          isEmergency ? "bg-emergency/10" : "bg-primary-light"
        )}
      >
        {icon}
      </div>
      <h3 className="font-display font-semibold text-dark text-lg mb-2 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <p className="text-dark/60 text-sm leading-relaxed mb-4">{description}</p>
      <div className="flex items-center justify-between text-xs text-dark/50">
        <span className="flex items-center gap-1">
          ⏱ {duration} min
        </span>
        {priceRange && (
          <span className="text-primary font-semibold">{priceRange}</span>
        )}
      </div>
    </div>
  );
}
