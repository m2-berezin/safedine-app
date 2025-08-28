import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderRequest {
  restaurant_id: string;
  table_id: string;
  table_code: string;
  items: any[];
  total_amount: number;
  notes?: string;
  user_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const orderData: OrderRequest = await req.json();
    
    // Basic validation
    if (!orderData.restaurant_id || !orderData.table_id || !orderData.items || orderData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate total amount is reasonable (not negative, not extremely high)
    if (orderData.total_amount < 0 || orderData.total_amount > 10000) {
      return new Response(
        JSON.stringify({ error: 'Invalid order amount' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate secure order token for guest orders
    let orderToken = null;
    if (!orderData.user_id) {
      const tokenArray = new Uint8Array(32);
      crypto.getRandomValues(tokenArray);
      orderToken = Array.from(tokenArray, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Insert the order
    const { data: order, error } = await supabaseClient
      .from('orders')
      .insert({
        restaurant_id: orderData.restaurant_id,
        table_id: orderData.table_id,
        table_code: orderData.table_code,
        items: orderData.items,
        total_amount: orderData.total_amount,
        notes: orderData.notes,
        user_id: orderData.user_id || null,
        order_token: orderToken,
        status: 'pending'
      })
      .select('id, created_at, status, order_token')
      .single();

    if (error) {
      console.error('Order insertion failed:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to place order' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Order placed successfully:', { orderId: order.id, hasToken: !!orderToken });

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          created_at: order.created_at,
          status: order.status,
          order_token: orderToken // Only returned for guest orders
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Secure order placement failed:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});