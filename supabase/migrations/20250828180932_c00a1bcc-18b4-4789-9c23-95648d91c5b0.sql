-- Add order_token column for guest order security
ALTER TABLE public.orders 
ADD COLUMN order_token TEXT;

-- Create index for performance on order_token lookups
CREATE INDEX idx_orders_order_token ON public.orders(order_token) WHERE order_token IS NOT NULL;

-- Update RLS policy to secure guest orders with token-based access
DROP POLICY "Users can view their own orders or guest orders" ON public.orders;

CREATE POLICY "Users can view their own authenticated orders" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Users can view guest orders with valid token" 
ON public.orders 
FOR SELECT 
USING (
  user_id IS NULL 
  AND order_token IS NOT NULL 
  AND order_token = current_setting('request.headers', true)::json->>'x-order-token'
);

-- Update INSERT policy to ensure order tokens are set for guest orders
DROP POLICY "Users can create orders" ON public.orders;

CREATE POLICY "Authenticated users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Anyone can create guest orders with tokens" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  user_id IS NULL 
  AND order_token IS NOT NULL
);