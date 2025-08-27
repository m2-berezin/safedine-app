import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  return (
    <div
      className={cn(
        "border-4 border-primary/20 border-t-primary rounded-full animate-spin-slow",
        sizeClasses[size],
        className
      )}
    />
  );
};