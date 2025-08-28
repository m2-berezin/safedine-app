-- Allow guest orders by making user_id nullable
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow guest orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

-- Create new policies that handle both authenticated and guest users
CREATE POLICY "Users can view their own orders or guest orders" 
ON public.orders 
FOR SELECT 
USING (
  -- Authenticated users can see their own orders
  (auth.uid() = user_id) OR 
  -- Allow viewing guest orders (user_id is null) - you might want to restrict this further
  (user_id IS NULL)
);

CREATE POLICY "Users can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Authenticated users must use their own user_id
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  -- Guest users can create orders with null user_id
  (auth.uid() IS NULL AND user_id IS NULL) OR
  -- Authenticated users can also create guest orders if needed
  (auth.uid() IS NOT NULL AND user_id IS NULL)
);