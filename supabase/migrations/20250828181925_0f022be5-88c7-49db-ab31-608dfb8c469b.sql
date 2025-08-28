-- Fix the reviews view security issue by dropping and recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.reviews_public;

-- Create the view with explicit SECURITY INVOKER (default behavior)
CREATE VIEW public.reviews_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  restaurant_id,
  order_id,
  rating,
  food_rating,
  service_rating,
  atmosphere_rating,
  would_recommend,
  title,
  comment,
  visit_date,
  created_at,
  updated_at
FROM public.reviews;

-- Grant access to the view
GRANT SELECT ON public.reviews_public TO anon, authenticated;