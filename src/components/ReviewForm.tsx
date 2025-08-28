import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReviewStars from "./ReviewStars";
import { Calendar, Star, MessageSquare } from "lucide-react";

interface ReviewFormProps {
  restaurantId: string;
  orderId?: string;
  onReviewSubmitted?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ restaurantId, orderId, onReviewSubmitted, onCancel }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
    foodRating: 0,
    serviceRating: 0,
    atmosphereRating: 0,
    wouldRecommend: true,
    visitDate: new Date().toISOString().split('T')[0]
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select an overall rating",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to submit a review",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          restaurant_id: restaurantId,
          order_id: orderId || null,
          rating: formData.rating,
          title: formData.title || null,
          comment: formData.comment || null,
          food_rating: formData.foodRating || null,
          service_rating: formData.serviceRating || null,
          atmosphere_rating: formData.atmosphereRating || null,
          would_recommend: formData.wouldRecommend,
          visit_date: formData.visitDate || null
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });

      // Reset form
      setFormData({
        rating: 0,
        title: "",
        comment: "",
        foodRating: 0,
        serviceRating: 0,
        atmosphereRating: 0,
        wouldRecommend: true,
        visitDate: new Date().toISOString().split('T')[0]
      });

      onReviewSubmitted?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Share Your Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Overall Rating *</Label>
            <div className="flex items-center gap-3">
              <ReviewStars
                rating={formData.rating}
                interactive
                size="lg"
                onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
              />
              <span className="text-sm text-muted-foreground">
                {formData.rating > 0 ? `${formData.rating} of 5 stars` : "Select rating"}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              placeholder="Summarize your experience"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Detailed Ratings</Label>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm">Food Quality</Label>
                <div className="flex items-center gap-2">
                  <ReviewStars
                    rating={formData.foodRating}
                    interactive
                    onRatingChange={(rating) => setFormData(prev => ({ ...prev, foodRating: rating }))}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.foodRating || 0}/5
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Service</Label>
                <div className="flex items-center gap-2">
                  <ReviewStars
                    rating={formData.serviceRating}
                    interactive
                    onRatingChange={(rating) => setFormData(prev => ({ ...prev, serviceRating: rating }))}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.serviceRating || 0}/5
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Atmosphere</Label>
                <div className="flex items-center gap-2">
                  <ReviewStars
                    rating={formData.atmosphereRating}
                    interactive
                    onRatingChange={(rating) => setFormData(prev => ({ ...prev, atmosphereRating: rating }))}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.atmosphereRating || 0}/5
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Date */}
          <div className="space-y-2">
            <Label htmlFor="visitDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Visit Date
            </Label>
            <Input
              id="visitDate"
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Tell us about your dining experience..."
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Recommendation */}
          <div className="flex items-center justify-between">
            <Label htmlFor="recommend" className="text-base font-medium">
              Would you recommend this restaurant?
            </Label>
            <Switch
              id="recommend"
              checked={formData.wouldRecommend}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, wouldRecommend: checked }))}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || formData.rating === 0}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}