import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeInUp({ children, delay = 0, className }: FadeInUpProps) {
  return (
    <div
      className={cn("animate-fade-in", className)}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "both"
      }}
    >
      {children}
    </div>
  );
}