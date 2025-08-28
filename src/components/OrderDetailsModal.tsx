import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ReviewForm from "./ReviewForm";
import ReviewStars from "./ReviewStars";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Receipt, 
  Star, 
  MessageSquare,
  ChevronLeft
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderDetailsProps {
  id: string;
  created_at: string;
  restaurant_id: string;
  table_code: string;
  items: any; // Changed from OrderItem[] to any to match Json type
  total_amount: number;
  status: string;
}

interface OrderDetailsModalProps {
  order: OrderDetailsProps | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
}

export default function OrderDetailsModal({ 
  order, 
  isOpen, 
  onClose, 
  currentUserId 
}: OrderDetailsModalProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false); // In a real app, check if user already reviewed this order

  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ready':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setHasReviewed(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Order Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(order.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Table {order.table_code}
                    </span>
                  </div>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  £{Number(order.total_amount).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Amount
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.isArray(order.items) && order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {item.quantity}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">£{item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="font-semibold">
                      £{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span>£{Number(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Section */}
          {order.status === 'completed' && currentUserId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="h-5 w-5 text-primary" />
                  Share Your Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasReviewed ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Thank you for your review!</h4>
                    <p className="text-muted-foreground text-sm">
                      Your feedback helps improve the dining experience for everyone.
                    </p>
                  </div>
                ) : !showReviewForm ? (
                  <div className="text-center py-6">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h4 className="font-semibold mb-2">How was your experience?</h4>
                    <p className="text-muted-foreground text-sm mb-4">
                      Share your feedback about this order to help others and improve service.
                    </p>
                    <Button onClick={() => setShowReviewForm(true)} className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      Write a Review
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowReviewForm(false)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Reviewing Order #{order.id.slice(0, 8)}
                      </span>
                    </div>
                    <ReviewForm
                      restaurantId={order.restaurant_id}
                      orderId={order.id}
                      onReviewSubmitted={handleReviewSubmitted}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}