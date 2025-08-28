import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import { getGuestOrderTokens } from './orderToken';

const SUPABASE_URL = "https://duwcmvvrwvljveidyuvq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1d2NtdnZyd3ZsanZlaWR5dXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMzA1NzYsImV4cCI6MjA3MTkwNjU3Nn0.P9sRvepl9qyPGNpZEBSEwYEGc2v72ZPRl-GwlMuTpi4";

/**
 * Creates a Supabase client with the guest order token header for secure access
 */
export function createSecureOrderClient(orderToken?: string) {
  const headers: Record<string, string> = {};
  
  if (orderToken) {
    headers['x-order-token'] = orderToken;
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers
    },
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

/**
 * Fetches orders with proper authentication for both users and guests
 * This is a secure replacement for the original fetchUserOrders function
 */
export async function fetchUserOrdersSecure(userId: string | null) {
  if (userId) {
    // Authenticated user - fetch their orders normally using default client
    const { supabase } = await import('@/integrations/supabase/client');
    
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
    // Guest user - fetch orders using stored tokens with secure client
    const guestTokens = getGuestOrderTokens();
    const tokenEntries = Object.entries(guestTokens);
    
    if (tokenEntries.length === 0) {
      return [];
    }
    
    // Fetch orders for each token separately to ensure proper token headers
    const allOrders = [];
    
    for (const [orderId, token] of tokenEntries) {
      try {
        const secureClient = createSecureOrderClient(token);
        
        const { data, error } = await secureClient
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
          .eq('order_token', token)
          .is('user_id', null);
        
        if (!error && data) {
          allOrders.push(...data);
        }
      } catch (error) {
        console.error(`Error fetching order ${orderId}:`, error);
      }
    }
    
    // Sort by creation date
    return allOrders.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
}