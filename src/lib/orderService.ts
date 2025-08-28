import { supabase } from '@/integrations/supabase/client';
import { getGuestOrderTokens } from './orderToken';

/**
 * Fetches orders with proper authentication for both users and guests
 */
export async function fetchUserOrders(userId: string | null) {
  if (userId) {
    // Authenticated user - fetch their orders normally
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        restaurant_id,
        table_code,
        items,
        total_amount,
        status,
        order_token
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
    
    return data;
  } else {
    // Guest user - fetch orders using stored tokens
    const guestTokens = getGuestOrderTokens();
    const tokenList = Object.values(guestTokens);
    
    if (tokenList.length === 0) {
      return [];
    }
    
    // Fetch orders where the order_token matches any of the stored tokens
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        restaurant_id,
        table_code,
        items,
        total_amount,
        status,
        order_token
      `)
      .in('order_token', tokenList)
      .is('user_id', null)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching guest orders:', error);
      return [];
    }
    
    return data;
  }
}