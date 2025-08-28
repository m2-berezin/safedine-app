-- Create restaurant_visits table to track user visits to restaurants
CREATE TABLE public.restaurant_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  restaurant_id UUID NOT NULL,
  first_visit_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_visit_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  visit_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one record per user-restaurant combination
  UNIQUE(user_id, restaurant_id)
);

-- Enable Row Level Security
ALTER TABLE public.restaurant_visits ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own restaurant visits" 
ON public.restaurant_visits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own restaurant visits" 
ON public.restaurant_visits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own restaurant visits" 
ON public.restaurant_visits 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE TRIGGER update_restaurant_visits_updated_at
BEFORE UPDATE ON public.restaurant_visits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_restaurant_visits_user_id ON public.restaurant_visits(user_id);
CREATE INDEX idx_restaurant_visits_restaurant_id ON public.restaurant_visits(restaurant_id);