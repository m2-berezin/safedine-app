import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Settings, RefreshCw } from "lucide-react";

interface OrderStatusDemoProps {
  onCreateTestOrder?: () => void;
}

export default function OrderStatusDemo({ onCreateTestOrder }: OrderStatusDemoProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const { toast } = useToast();

  const statusOptions = [
    { value: "pending", label: "Order Placed" },
    { value: "confirmed", label: "Order Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready for Pickup" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const updateOrderStatus = async () => {
    if (!selectedOrderId || !newStatus) {
      toast({
        title: "Missing Information",
        description: "Please select both an order ID and status",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          // Add estimated completion time based on status
          estimated_completion_at: newStatus === 'ready' 
            ? new Date().toISOString() 
            : new Date(Date.now() + (newStatus === 'confirmed' ? 20 : 10) * 60000).toISOString()
        })
        .eq('id', selectedOrderId);

      if (error) {
        throw error;
      }

      toast({
        title: "Order Updated",
        description: `Order status changed to ${statusOptions.find(s => s.value === newStatus)?.label}`,
      });

      setSelectedOrderId("");
      setNewStatus("");
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const createTestOrder = async () => {
    setIsCreatingOrder(true);
    try {
      const testOrder = {
        restaurant_id: "123e4567-e89b-12d3-a456-426614174000", // Mock restaurant ID
        table_id: "123e4567-e89b-12d3-a456-426614174001", // Mock table ID
        table_code: `T${Math.floor(Math.random() * 99) + 1}`,
        total_amount: Number((Math.random() * 50 + 10).toFixed(2)),
        status: 'pending',
        items: [
          { id: "1", name: "Margherita Pizza", price: 12.99, quantity: 1 },
          { id: "2", name: "Caesar Salad", price: 8.50, quantity: 1 },
        ],
        user_id: null, // For demo purposes - guest order
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([testOrder])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Test Order Created",
        description: `Order #${data.id.slice(0, 8)} created successfully`,
      });

      onCreateTestOrder?.();
    } catch (error) {
      console.error('Error creating test order:', error);
      toast({
        title: "Error",
        description: "Failed to create test order",
        variant: "destructive"
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Order Status Demo Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Test Order */}
        <div>
          <Button 
            onClick={createTestOrder}
            disabled={isCreatingOrder}
            className="w-full"
          >
            {isCreatingOrder ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Create Test Order
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Creates a sample order to demonstrate real-time tracking
          </p>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Update Order Status</h4>
          
          {/* Order ID Input */}
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              placeholder="Enter order ID (first 8 chars work)"
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
            />
          </div>

          {/* Status Select */}
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Update Button */}
          <Button 
            onClick={updateOrderStatus}
            disabled={isUpdating || !selectedOrderId || !newStatus}
            className="w-full mt-3"
            variant="outline"
          >
            {isUpdating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Update Status
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="font-medium mb-1">Demo Instructions:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Create a test order using the button above</li>
            <li>Copy the Order ID from the tracking card</li>
            <li>Use the controls to update the order status</li>
            <li>Watch the real-time updates in the tracking section!</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}