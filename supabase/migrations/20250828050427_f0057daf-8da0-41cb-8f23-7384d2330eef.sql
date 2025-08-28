-- Create loyalty program tables
CREATE TYPE public.loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE public.reward_type AS ENUM ('discount', 'free_item', 'points_multiplier');
CREATE TYPE public.transaction_type AS ENUM ('earned', 'redeemed');

-- Loyalty profiles table
CREATE TABLE public.loyalty_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  points INTEGER NOT NULL DEFAULT 0,
  tier loyalty_tier NOT NULL DEFAULT 'bronze',
  total_earned_points INTEGER NOT NULL DEFAULT 0,
  tier_progress DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Loyalty rewards table
CREATE TABLE public.loyalty_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cost_points INTEGER NOT NULL,
  reward_type reward_type NOT NULL,
  reward_value DECIMAL(10,2), -- discount amount or points multiplier
  is_active BOOLEAN NOT NULL DEFAULT true,
  min_tier loyalty_tier NOT NULL DEFAULT 'bronze',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Loyalty transactions table
CREATE TABLE public.loyalty_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type transaction_type NOT NULL,
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  reference_id UUID, -- order_id, review_id, etc.
  reference_type TEXT, -- 'order', 'review', 'signup', etc.
  reward_id UUID REFERENCES public.loyalty_rewards(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User reward redemptions table
CREATE TABLE public.user_reward_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL REFERENCES public.loyalty_rewards(id),
  points_spent INTEGER NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loyalty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reward_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own loyalty profile"
  ON public.loyalty_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own loyalty profile"
  ON public.loyalty_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loyalty profile"
  ON public.loyalty_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view active rewards"
  ON public.loyalty_rewards FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view their own loyalty transactions"
  ON public.loyalty_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create loyalty transactions"
  ON public.loyalty_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reward redemptions"
  ON public.user_reward_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reward redemptions"
  ON public.user_reward_redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reward redemptions"
  ON public.user_reward_redemptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_loyalty_profiles_updated_at
  BEFORE UPDATE ON public.loyalty_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loyalty_rewards_updated_at
  BEFORE UPDATE ON public.loyalty_rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_reward_redemptions_updated_at
  BEFORE UPDATE ON public.user_reward_redemptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate tier based on total points
CREATE OR REPLACE FUNCTION public.calculate_loyalty_tier(total_points INTEGER)
RETURNS loyalty_tier
LANGUAGE plpgsql
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

-- Insert some sample rewards
INSERT INTO public.loyalty_rewards (name, description, cost_points, reward_type, reward_value, min_tier) VALUES
('5% Off Next Order', 'Get 5% discount on your next order', 100, 'discount', 5.00, 'bronze'),
('10% Off Next Order', 'Get 10% discount on your next order', 200, 'discount', 10.00, 'silver'),
('Free Appetizer', 'Get a free appetizer with your next order', 300, 'free_item', 0, 'bronze'),
('Free Dessert', 'Get a free dessert with your next order', 250, 'free_item', 0, 'bronze'),
('15% Off Next Order', 'Get 15% discount on your next order', 400, 'discount', 15.00, 'gold'),
('Double Points Week', 'Earn double points for one week', 500, 'points_multiplier', 2.00, 'silver'),
('20% Off Next Order', 'Get 20% discount on your next order', 600, 'discount', 20.00, 'gold'),
('Free Main Course', 'Get a free main course with your next order', 800, 'free_item', 0, 'gold'),
('VIP Status Upgrade', 'Skip to Platinum tier for one month', 1000, 'points_multiplier', 1.00, 'platinum');