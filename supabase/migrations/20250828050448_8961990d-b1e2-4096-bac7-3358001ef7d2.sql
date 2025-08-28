-- Fix security warnings by setting search_path for functions
DROP FUNCTION IF EXISTS public.calculate_loyalty_tier(INTEGER);
DROP FUNCTION IF EXISTS public.update_loyalty_profile(UUID, INTEGER);

-- Recreate functions with proper security settings
CREATE OR REPLACE FUNCTION public.calculate_loyalty_tier(total_points INTEGER)
RETURNS loyalty_tier
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF total_points >= 5000 THEN
    RETURN 'platinum';
  ELSIF total_points >= 2500 THEN
    RETURN 'gold';
  ELSIF total_points >= 1000 THEN
    RETURN 'silver';
  ELSE
    RETURN 'bronze';
  END IF;
END;
$$;

-- Function to update loyalty profile when points change
CREATE OR REPLACE FUNCTION public.update_loyalty_profile(user_id_param UUID, points_change INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;