-- Create locations table
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Locations are viewable by everyone" 
ON public.locations 
FOR SELECT 
USING (true);

CREATE POLICY "Restaurants are viewable by everyone" 
ON public.restaurants 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.locations (name, city, region) VALUES 
  ('Bristol Downtown', 'Bristol', 'South West England'),
  ('London City', 'London', 'Greater London'),
  ('Manchester Centre', 'Manchester', 'North West England');

INSERT INTO public.restaurants (location_id, name, address) VALUES 
  ((SELECT id FROM public.locations WHERE name = 'Bristol Downtown'), 'The Blue Elephant', '123 Park Street, Bristol BS1 5PH'),
  ((SELECT id FROM public.locations WHERE name = 'Bristol Downtown'), 'Pasta Palace', '456 Queen Street, Bristol BS1 4QX'),
  ((SELECT id FROM public.locations WHERE name = 'London City'), 'Green Garden Bistro', '789 Oxford Street, London W1C 1DX'),
  ((SELECT id FROM public.locations WHERE name = 'London City'), 'Spice Route', '321 Baker Street, London NW1 6XE'),
  ((SELECT id FROM public.locations WHERE name = 'Manchester Centre'), 'Northern Lights Cafe', '654 Market Street, Manchester M1 1AA');