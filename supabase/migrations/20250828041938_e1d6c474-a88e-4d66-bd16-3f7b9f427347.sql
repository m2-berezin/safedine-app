-- Enable realtime for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Add orders table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Add more detailed order statuses
ALTER TABLE public.orders 
ALTER COLUMN status TYPE text,
ALTER COLUMN status SET DEFAULT 'pending';

-- Add constraint to ensure valid status values
ALTER TABLE public.orders 
ADD CONSTRAINT valid_order_status 
CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'));

-- Add estimated completion time
ALTER TABLE public.orders 
ADD COLUMN estimated_completion_at timestamp with time zone;

-- Add order notes for kitchen/staff
ALTER TABLE public.orders 
ADD COLUMN notes text;