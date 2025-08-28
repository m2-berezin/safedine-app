-- Create function to delete user account and all associated data
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to delete account';
  END IF;
  
  -- Delete user's data in correct order (referential integrity)
  DELETE FROM public.user_reward_redemptions WHERE user_id = current_user_id;
  DELETE FROM public.loyalty_transactions WHERE user_id = current_user_id;
  DELETE FROM public.loyalty_profiles WHERE user_id = current_user_id;
  DELETE FROM public.user_favorites WHERE user_id = current_user_id;
  DELETE FROM public.restaurant_visits WHERE user_id = current_user_id;
  DELETE FROM public.reviews WHERE user_id = current_user_id;
  DELETE FROM public.orders WHERE user_id = current_user_id;
  
  -- Delete the user from auth.users (this will cascade to other auth-related tables)
  DELETE FROM auth.users WHERE id = current_user_id;
END;
$$;