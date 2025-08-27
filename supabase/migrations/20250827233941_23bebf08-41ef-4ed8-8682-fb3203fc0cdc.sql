-- Create dining_tables table
CREATE TABLE public.dining_tables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, code)
);

-- Enable Row Level Security
ALTER TABLE public.dining_tables ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing tables
CREATE POLICY "Tables are viewable by everyone" 
ON public.dining_tables 
FOR SELECT 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_dining_tables_updated_at
BEFORE UPDATE ON public.dining_tables
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample tables for each restaurant (tables 1-35)
DO $$
DECLARE
    restaurant_record RECORD;
    table_num INTEGER;
BEGIN
    FOR restaurant_record IN SELECT id FROM public.restaurants LOOP
        FOR table_num IN 1..35 LOOP
            INSERT INTO public.dining_tables (restaurant_id, code) 
            VALUES (restaurant_record.id, table_num::TEXT);
        END LOOP;
    END LOOP;
END $$;