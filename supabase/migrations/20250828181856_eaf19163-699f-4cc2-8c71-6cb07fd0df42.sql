-- Fix critical privilege escalation in loyalty function
CREATE OR REPLACE FUNCTION public.update_loyalty_profile(user_id_param uuid, points_change integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY INVOKER  -- Changed from DEFINER to INVOKER to apply RLS
 SET search_path TO 'public'
AS $function$
DECLARE
  current_profile RECORD;
  new_tier loyalty_tier;
  next_tier_threshold INTEGER;
BEGIN
  -- Get current profile or create if doesn't exist
  SELECT * INTO current_profile FROM public.loyalty_profiles WHERE user_id = user_id_param;
  
  IF NOT FOUND THEN
    INSERT INTO public.loyalty_profiles (user_id, points, total_earned_points)
    VALUES (user_id_param, GREATEST(0, points_change), GREATEST(0, points_change));
    RETURN;
  END IF;
  
  -- Update points
  UPDATE public.loyalty_profiles 
  SET 
    points = GREATEST(0, current_profile.points + points_change),
    total_earned_points = CASE 
      WHEN points_change > 0 THEN current_profile.total_earned_points + points_change
      ELSE current_profile.total_earned_points
    END
  WHERE user_id = user_id_param;
  
  -- Get updated profile
  SELECT * INTO current_profile FROM public.loyalty_profiles WHERE user_id = user_id_param;
  
  -- Calculate new tier and progress
  new_tier := public.calculate_loyalty_tier(current_profile.total_earned_points);
  
  -- Calculate progress to next tier
  CASE new_tier
    WHEN 'bronze' THEN next_tier_threshold := 1000;
    WHEN 'silver' THEN next_tier_threshold := 2500;
    WHEN 'gold' THEN next_tier_threshold := 5000;
    ELSE next_tier_threshold := 5000; -- platinum is max
  END CASE;
  
  -- Update tier and progress
  UPDATE public.loyalty_profiles 
  SET 
    tier = new_tier,
    tier_progress = CASE 
      WHEN new_tier = 'platinum' THEN 100.00
      ELSE LEAST(100.00, (current_profile.total_earned_points::DECIMAL / next_tier_threshold) * 100)
    END
  WHERE user_id = user_id_param;
END;
$function$;

-- Create public reviews view to hide user_id
CREATE OR REPLACE VIEW public.reviews_public AS
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