import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
  color?: "primary" | "success" | "warning" | "destructive";
}

export default function ProgressBar({
  progress,
  className,
  showPercentage = false,
  animated = true,
  color = "primary"
}: ProgressBarProps) {
  const colorClasses = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    destructive: "bg-destructive"
  };

  const glowClasses = {
    primary: "shadow-[0_0_10px_hsl(var(--primary)_/_0.5)]",
    success: "shadow-[0_0_10px_rgb(34_197_94_/_0.5)]",
    warning: "shadow-[0_0_10px_rgb(234_179_8_/_0.5)]",
    destructive: "shadow-[0_0_10px_hsl(var(--destructive)_/_0.5)]"
  };

  return (
    <div className={cn("space-y-1", className)}>
      {showPercentage && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorClasses[color],
            animated && "animate-pulse",
            progress > 80 && glowClasses[color]
          )}
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            transition: animated ? "width 0.5s ease-out, box-shadow 0.3s ease-out" : "none"
          }}
        />
      </div>
    </div>
  );
}