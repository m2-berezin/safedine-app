import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReviewStars from "./ReviewStars";
import ReviewForm from "./ReviewForm";
import ReviewSkeleton from "./skeletons/ReviewSkeleton";
import FadeInUp from "./animations/FadeInUp";
import { EmptyState, LoadingCard } from "./LoadingStates";
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  ThumbsUp, 
  User, 
  Plus,
  TrendingUp,
  Award
} from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  food_rating: number | null;
  service_rating: number | null;
  atmosphere_rating: number | null;
  would_recommend: boolean;
  visit_date: string | null;
  created_at: string;
}

interface ReviewsListProps {
  restaurantId: string;
  currentUserId?: string;
}

export default function ReviewsList({ restaurantId, currentUserId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingStats, setRatingStats] = useState({
    totalReviews: 0,
    averageFood: 0,
    averageService: 0,
    averageAtmosphere: 0,
    recommendationRate: 0
  });
  const { toast } = useToast();

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews_public')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setReviews(data || []);
      
      // Calculate statistics
      if (data && data.length > 0) {
        const avgRating = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        const foodRatings = data.filter(r => r.food_rating).map(r => r.food_rating!);
        const serviceRatings = data.filter(r => r.service_rating).map(r => r.service_rating!);
        const atmosphereRatings = data.filter(r => r.atmosphere_rating).map(r => r.atmosphere_rating!);
        const recommendations = data.filter(r => r.would_recommend).length;

        setAverageRating(avgRating);
        setRatingStats({
          totalReviews: data.length,
          averageFood: foodRatings.length > 0 ? foodRatings.reduce((a, b) => a + b) / foodRatings.length : 0,
          averageService: serviceRatings.length > 0 ? serviceRatings.reduce((a, b) => a + b) / serviceRatings.length : 0,
          averageAtmosphere: atmosphereRatings.length > 0 ? atmosphereRatings.reduce((a, b) => a + b) / atmosphereRatings.length : 0,
          recommendationRate: data.length > 0 ? (recommendations / data.length) * 100 : 0
        });
      } else {
        setAverageRating(0);
        setRatingStats({
          totalReviews: 0,
          averageFood: 0,
          averageService: 0,
          averageAtmosphere: 0,
          recommendationRate: 0
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    fetchReviews();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserInitials = () => {
    // For privacy, we'll just show generic initials for all users
    return "U";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingCard title="Loading Reviews..." description="Fetching customer experiences and ratings" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      {ratingStats.totalReviews > 0 && (
        <FadeInUp>
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Reviews Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <ReviewStars rating={Math.round(averageRating)} size="sm" />
                    <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{ratingStats.totalReviews} reviews</p>
                </div>

                {ratingStats.averageFood > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="font-semibold">{ratingStats.averageFood.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Food Quality</p>
                  </div>
                )}

                {ratingStats.averageService > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">{ratingStats.averageService.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Service</p>
                  </div>
                )}

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">{ratingStats.recommendationRate.toFixed(0)}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Recommend</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>
      )}

      {/* Add Review Button */}
      {currentUserId && !showReviewForm && (
        <FadeInUp delay={100}>
          <Button 
            onClick={() => setShowReviewForm(true)}
            className="w-full hover:scale-105 transition-all duration-300"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        </FadeInUp>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <FadeInUp delay={200}>
          <ReviewForm
            restaurantId={restaurantId}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        </FadeInUp>
      )}

      {/* Reviews List */}
      <FadeInUp delay={300}>
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Customer Reviews ({ratingStats.totalReviews})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No reviews yet"
                description="Be the first to share your experience!"
              />
            ) : (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <FadeInUp key={review.id} delay={index * 50}>
                    <div className="border-b border-muted last:border-0 pb-6 last:pb-0">
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <ReviewStars rating={review.rating} size="sm" />
                              <span className="text-sm font-medium">{review.rating}/5</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {review.visit_date ? formatDate(review.visit_date) : formatDate(review.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        {review.would_recommend && (
                          <Badge variant="secondary" className="text-xs animate-fade-in">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Recommends
                          </Badge>
                        )}
                      </div>

                      {/* Review Title */}
                      {review.title && (
                        <h4 className="font-semibold mb-2">{review.title}</h4>
                      )}

                      {/* Review Comment */}
                      {review.comment && (
                        <p className="text-muted-foreground mb-3">{review.comment}</p>
                      )}

                      {/* Detailed Ratings */}
                      {(review.food_rating || review.service_rating || review.atmosphere_rating) && (
                        <div className="flex flex-wrap gap-4 text-sm">
                          {review.food_rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Food:</span>
                              <ReviewStars rating={review.food_rating} size="sm" />
                            </div>
                          )}
                          {review.service_rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Service:</span>
                              <ReviewStars rating={review.service_rating} size="sm" />
                            </div>
                          )}
                          {review.atmosphere_rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Atmosphere:</span>
                              <ReviewStars rating={review.atmosphere_rating} size="sm" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </FadeInUp>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeInUp>
    </div>
  );
}