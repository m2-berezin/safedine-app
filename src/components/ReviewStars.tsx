import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function ReviewStars({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  interactive = false,
  onRatingChange 
}: ReviewStarsProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const isPartiallyFilled = starValue - 0.5 <= rating && rating < starValue;
        
        return (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(starValue)}
              disabled={!interactive}
              className={cn(
                sizeClasses[size],
                interactive ? "cursor-pointer hover:scale-110 transition-all duration-200 hover:drop-shadow-md" : "cursor-default",
                "relative"
              )}
            >
            <Star 
              className={cn(
                "absolute inset-0 transition-all duration-200",
                isFilled || isPartiallyFilled ? "fill-amber-400 text-amber-400 drop-shadow-sm" : "text-muted-foreground hover:text-amber-300"
              )}
            />
            {isPartiallyFilled && (
              <Star 
                className="absolute inset-0 text-muted-foreground"
                style={{ 
                  clipPath: "inset(0 50% 0 0)" 
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}