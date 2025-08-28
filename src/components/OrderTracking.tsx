import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, ChefHat, CheckCircle, AlertCircle, Package } from "lucide-react";

interface Order {
  id: string;
  status: string;
  created_at: string;
  total_amount: number;
  items: any;
  estimated_completion_at: string | null;
  notes: string | null;
  restaurant_id: string;
  table_code: string;
  table_id: string;
  user_id: string | null;
}

interface OrderTrackingProps {
  userId?: string;
}

const statusConfig = {
  pending: { label: "Order Placed", icon: Clock, color: "bg-yellow-500", progress: 20 },
  confirmed: { label: "Order Confirmed", icon: CheckCircle, color: "bg-blue-500", progress: 40 },
  preparing: { label: "Preparing", icon: ChefHat, color: "bg-orange-500", progress: 70 },
  ready: { label: "Ready for Pickup", icon: Package, color: "bg-green-500", progress: 90 },
  completed: { label: "Completed", icon: CheckCircle, color: "bg-green-600", progress: 100 },
  cancelled: { label: "Cancelled", icon: AlertCircle, color: "bg-red-500", progress: 0 },
};

export default function OrderTracking({ userId }: OrderTrackingProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial orders
    const fetchOrders = async () => {
      try {
        let query = supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching orders:', error);
          return;
        }
        
        setOrders(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('order-tracking')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Real-time order update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order;
            if (!userId || newOrder.user_id === userId) {
              setOrders(prev => [newOrder, ...prev.slice(0, 4)]);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new as Order;
            if (!userId || updatedOrder.user_id === userId) {
              setOrders(prev => 
                prev.map(order => 
                  order.id === updatedOrder.id ? updatedOrder : order
                )
              );
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedOrder = payload.old as Order;
            setOrders(prev => prev.filter(order => order.id !== deletedOrder.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEstimatedTime = (order: Order) => {
    if (order.estimated_completion_at) {
      return formatTime(order.estimated_completion_at);
    }
    
    // Calculate estimated time based on status and created time
    const createdTime = new Date(order.created_at);
    let estimatedMinutes = 25; // Default estimation
    
    switch (order.status) {
      case 'confirmed':
        estimatedMinutes = 20;
        break;
      case 'preparing':
        estimatedMinutes = 10;
        break;
      case 'ready':
        estimatedMinutes = 0;
        break;
      default:
        estimatedMinutes = 25;
    }
    
    const estimatedTime = new Date(createdTime.getTime() + estimatedMinutes * 60000);
    return formatTime(estimatedTime.toISOString());
  };

  if (loading) {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Order Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No recent orders found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Place an order to see real-time tracking updates
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        Live Order Tracking
      </h3>
      
      {orders.map((order) => {
        const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
        const IconComponent = config.icon;
        
        return (
          <Card key={order.id} className="shadow-soft border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="secondary" 
                      className={`${config.color} text-white hover:${config.color}/80`}
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Table {order.table_code}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Order #{order.id.slice(0, 8)} • {formatTime(order.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">£{Number(order.total_amount).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.status === 'ready' ? 'Ready now!' : `Est. ${getEstimatedTime(order)}`}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <Progress value={config.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Ordered</span>
                  <span>Confirmed</span>
                  <span>Preparing</span>
                  <span>Ready</span>
                </div>
              </div>
              
              {/* Order Items Summary */}
              <div className="text-sm text-muted-foreground">
                {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                  <p>
                    {order.items.slice(0, 2).map((item: any) => item.name || 'Item').join(', ')}
                    {order.items.length > 2 && ` +${order.items.length - 2} more`}
                  </p>
                ) : (
                  <p>No items listed</p>
                )}
              </div>
              
              {/* Notes */}
              {order.notes && (
                <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                  <strong>Note:</strong> {order.notes}
                </div>
              )}
              
              {/* Real-time indicator */}
              <div className="flex items-center justify-end gap-1 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live updates</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}