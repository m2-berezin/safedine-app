export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      dining_tables: {
        Row: {
          code: string
          created_at: string
          id: string
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dining_tables_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string | null
          created_at: string
          id: string
          name: string
          region: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          name: string
          region?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_profiles: {
        Row: {
          created_at: string
          id: string
          points: number
          tier: Database["public"]["Enums"]["loyalty_tier"]
          tier_progress: number
          total_earned_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          tier?: Database["public"]["Enums"]["loyalty_tier"]
          tier_progress?: number
          total_earned_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          tier?: Database["public"]["Enums"]["loyalty_tier"]
          tier_progress?: number
          total_earned_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_rewards: {
        Row: {
          cost_points: number
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          min_tier: Database["public"]["Enums"]["loyalty_tier"]
          name: string
          reward_type: Database["public"]["Enums"]["reward_type"]
          reward_value: number | null
          updated_at: string
        }
        Insert: {
          cost_points: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          min_tier?: Database["public"]["Enums"]["loyalty_tier"]
          name: string
          reward_type: Database["public"]["Enums"]["reward_type"]
          reward_value?: number | null
          updated_at?: string
        }
        Update: {
          cost_points?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          min_tier?: Database["public"]["Enums"]["loyalty_tier"]
          name?: string
          reward_type?: Database["public"]["Enums"]["reward_type"]
          reward_value?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          created_at: string
          description: string
          id: string
          points: number
          reference_id: string | null
          reference_type: string | null
          reward_id: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          points: number
          reference_id?: string | null
          reference_type?: string | null
          reward_id?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          points?: number
          reference_id?: string | null
          reference_type?: string | null
          reward_id?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "loyalty_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          menu_id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          menu_id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          menu_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          calories: number | null
          category_id: string
          created_at: string
          description: string | null
          dietary_info: string[] | null
          id: string
          image_url: string | null
          is_available: boolean
          is_popular: boolean
          name: string
          preparation_time: number | null
          price: number
          spice_level: number | null
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          calories?: number | null
          category_id: string
          created_at?: string
          description?: string | null
          dietary_info?: string[] | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_popular?: boolean
          name: string
          preparation_time?: number | null
          price: number
          spice_level?: number | null
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          calories?: number | null
          category_id?: string
          created_at?: string
          description?: string | null
          dietary_info?: string[] | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_popular?: boolean
          name?: string
          preparation_time?: number | null
          price?: number
          spice_level?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menus_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          estimated_completion_at: string | null
          id: string
          items: Json
          notes: string | null
          order_token: string | null
          restaurant_id: string
          status: string
          table_code: string
          table_id: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          estimated_completion_at?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_token?: string | null
          restaurant_id: string
          status?: string
          table_code: string
          table_id: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          estimated_completion_at?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_token?: string | null
          restaurant_id?: string
          status?: string
          table_code?: string
          table_id?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      restaurant_visits: {
        Row: {
          created_at: string
          first_visit_at: string
          id: string
          last_visit_at: string
          restaurant_id: string
          updated_at: string
          user_id: string
          visit_count: number
        }
        Insert: {
          created_at?: string
          first_visit_at?: string
          id?: string
          last_visit_at?: string
          restaurant_id: string
          updated_at?: string
          user_id: string
          visit_count?: number
        }
        Update: {
          created_at?: string
          first_visit_at?: string
          id?: string
          last_visit_at?: string
          restaurant_id?: string
          updated_at?: string
          user_id?: string
          visit_count?: number
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address: string
          created_at: string
          id: string
          image_url: string | null
          location_id: string
          name: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          image_url?: string | null
          location_id: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          image_url?: string | null
          location_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          atmosphere_rating: number | null
          comment: string | null
          created_at: string
          food_rating: number | null
          id: string
          order_id: string | null
          rating: number
          restaurant_id: string
          service_rating: number | null
          title: string | null
          updated_at: string
          user_id: string | null
          visit_date: string | null
          would_recommend: boolean | null
        }
        Insert: {
          atmosphere_rating?: number | null
          comment?: string | null
          created_at?: string
          food_rating?: number | null
          id?: string
          order_id?: string | null
          rating: number
          restaurant_id: string
          service_rating?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          visit_date?: string | null
          would_recommend?: boolean | null
        }
        Update: {
          atmosphere_rating?: number | null
          comment?: string | null
          created_at?: string
          food_rating?: number | null
          id?: string
          order_id?: string | null
          rating?: number
          restaurant_id?: string
          service_rating?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          visit_date?: string | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reward_redemptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_used: boolean
          points_spent: number
          reward_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_used?: boolean
          points_spent: number
          reward_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_used?: boolean
          points_spent?: number
          reward_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "loyalty_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      reviews_public: {
        Row: {
          atmosphere_rating: number | null
          comment: string | null
          created_at: string | null
          food_rating: number | null
          id: string | null
          order_id: string | null
          rating: number | null
          restaurant_id: string | null
          service_rating: number | null
          title: string | null
          updated_at: string | null
          visit_date: string | null
          would_recommend: boolean | null
        }
        Insert: {
          atmosphere_rating?: number | null
          comment?: string | null
          created_at?: string | null
          food_rating?: number | null
          id?: string | null
          order_id?: string | null
          rating?: number | null
          restaurant_id?: string | null
          service_rating?: number | null
          title?: string | null
          updated_at?: string | null
          visit_date?: string | null
          would_recommend?: boolean | null
        }
        Update: {
          atmosphere_rating?: number | null
          comment?: string | null
          created_at?: string | null
          food_rating?: number | null
          id?: string | null
          order_id?: string | null
          rating?: number | null
          restaurant_id?: string | null
          service_rating?: number | null
          title?: string | null
          updated_at?: string | null
          visit_date?: string | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_loyalty_tier: {
        Args: { total_points: number }
        Returns: Database["public"]["Enums"]["loyalty_tier"]
      }
      update_loyalty_profile: {
        Args: { points_change: number; user_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      loyalty_tier: "bronze" | "silver" | "gold" | "platinum"
      reward_type: "discount" | "free_item" | "points_multiplier"
      transaction_type: "earned" | "redeemed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      loyalty_tier: ["bronze", "silver", "gold", "platinum"],
      reward_type: ["discount", "free_item", "points_multiplier"],
      transaction_type: ["earned", "redeemed"],
    },
  },
} as const
