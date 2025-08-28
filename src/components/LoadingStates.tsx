import { LoadingSpinner } from "./LoadingSpinner";
import MenuItemSkeleton from "./skeletons/MenuItemSkeleton";
import OrderSkeleton from "./skeletons/OrderSkeleton";
import ReviewSkeleton from "./skeletons/ReviewSkeleton";
import FadeInUp from "./animations/FadeInUp";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <FadeInUp>
      <div className={cn("text-center py-12", className)}>
        <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </FadeInUp>
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingCard({ title, description, className }: LoadingCardProps) {
  return (
    <Card className={cn("shadow-soft", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" text={title || "Loading..."} />
        {description && (
          <p className="text-sm text-muted-foreground mt-4 text-center max-w-md">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface SkeletonGridProps {
  type: "menu" | "orders" | "reviews";
  count?: number;
  className?: string;
}

export function SkeletonGrid({ type, count = 3, className }: SkeletonGridProps) {
  const skeletonComponents = {
    menu: MenuItemSkeleton,
    orders: OrderSkeleton,
    reviews: ReviewSkeleton
  };

  const SkeletonComponent = skeletonComponents[type];

  return (
    <div className={cn("space-y-4", type === "menu" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <FadeInUp key={index} delay={index * 100}>
          {type === "reviews" ? (
            <SkeletonComponent />
          ) : (
            <SkeletonComponent />
          )}
        </FadeInUp>
      ))}
    </div>
  );
}

// Enhanced loading spinner with pulsing dots
export function DotLoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="h-3 w-3 bg-primary rounded-full animate-bounce"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: "0.6s"
            }}
          />
        ))}
      </div>
      {text && (
        <p className="text-muted-foreground text-sm animate-pulse">{text}</p>
      )}
    </div>
  );
}