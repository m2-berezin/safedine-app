import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { Json } from "@/integrations/supabase/types";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Menu, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin,
  Bell,
  Settings,
  HelpCircle,
  FileText,
  Shield,
  Plus,
  Star,
  Minus,
  Trash2,
  Moon,
  Sun,
  LogOut,
  Edit,
  Mail,
  Globe,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderHistory {
  id: string;
  created_at: string;
  restaurant_id: string;
  table_code: string;
  items: Json; // Changed from CartItem[] to Json to match Supabase type
  total_amount: number;
  status: string;
}

interface RestaurantVisit {
  id: string;
  restaurant_id: string;
  restaurant_name: string;
  first_visit_at: string;
  last_visit_at: string;
  visit_count: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  allergens: string[];
  dietary_info: string[];
  is_popular: boolean;
  preparation_time?: number;
  calories?: number;
  spice_level?: number;
  is_available: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  items: MenuItem[];
}

interface MenuType {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  categories: MenuCategory[];
}

const MainHub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState("menu");
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantVisit[]>([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [userPreferences, setUserPreferences] = useState<{
    allergens: string[];
    diets: string[];
  }>({ allergens: [], diets: [] });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appSettings, setAppSettings] = useState({
    notifications: true,
    emailNotifications: true,
    language: 'English'
  });
  const { theme, toggleTheme } = useTheme();

  // Fetch restaurant data
  const { data: restaurantData } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, address')
        .eq('id', restaurantId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!restaurantId
  });

  const { data: menus, isLoading: menusLoading, error: menusError } = useQuery({
    queryKey: ['menus', restaurantId],
    queryFn: async () => {
      console.log('Fetching menus for restaurant ID:', restaurantId);
      if (!restaurantId) {
        console.log('No restaurant ID provided');
        return [];
      }
      
      const { data, error } = await supabase
        .from('menus')
        .select(`
          id,
          name,
          description,
          display_order,
          menu_categories(
            id,
            name,
            description,
            display_order,
            menu_items(
              id,
              name,
              description,
              price,
              allergens,
              dietary_info,
              is_popular,
              preparation_time,
              calories,
              spice_level,
              is_available
            )
          )
        `)
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .order('display_order');
      
      console.log('Menu query result:', { data, error });
      if (error) {
        console.error('Menu fetch error:', error);
        throw error;
      }
      
      // Transform the data to match our interface
      const transformedMenus = data.map(menu => ({
        ...menu,
        categories: menu.menu_categories
          .sort((a, b) => a.display_order - b.display_order)
          .map(category => ({
            ...category,
            items: category.menu_items
              .filter(item => item.is_available)
              .sort((a, b) => a.name.localeCompare(b.name))
          }))
      })) as MenuType[];
      
      console.log('Transformed menus:', transformedMenus);
      return transformedMenus;
    },
    enabled: !!restaurantId
  });

  // Fetch user favorites from database
  const { data: userFavoritesData, refetch: refetchFavorites } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('menu_item_id')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }
      
      return data.map(fav => fav.menu_item_id);
    },
    enabled: !!user?.id
  });

  // Fetch user order history from database
  const { data: userOrderHistory, refetch: refetchOrders } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          restaurant_id,
          table_code,
          items,
          total_amount,
          status
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching order history:', error);
        return [];
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch user restaurant visits from database
  const { data: userRestaurantVisits, refetch: refetchRestaurantVisits } = useQuery({
    queryKey: ['user-restaurant-visits', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('restaurant_visits')
        .select(`
          id,
          restaurant_id,
          first_visit_at,
          last_visit_at,
          visit_count
        `)
        .eq('user_id', user.id)
        .order('last_visit_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching restaurant visits:', error);
        return [];
      }
      
      // Fetch restaurant names separately
      const visitData = await Promise.all(
        data.map(async (visit) => {
          const { data: restaurantData, error: restaurantError } = await supabase
            .from('restaurants')
            .select('name')
            .eq('id', visit.restaurant_id)
            .single();
          
          return {
            id: visit.id,
            restaurant_id: visit.restaurant_id,
            restaurant_name: restaurantData?.name || 'Unknown Restaurant',
            first_visit_at: visit.first_visit_at,
            last_visit_at: visit.last_visit_at,
            visit_count: visit.visit_count,
          };
        })
      );
      
      return visitData;
    },
    enabled: !!user?.id
  });

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle navigation state (e.g., from contact form)
  useEffect(() => {
    const state = (location as any).state;
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
      // Clear the state to prevent it from affecting future navigations
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    // Load data from localStorage
    const savedCart = localStorage.getItem("safedine.cart");
    const savedHistory = localStorage.getItem("safedine.orderHistory");
    const savedRestaurants = localStorage.getItem("safedine.restaurants");
    const savedRestaurantId = localStorage.getItem("safedine.restaurantId");
    const savedRestaurantName = localStorage.getItem("safedine.restaurantName");
    const savedTableCode = localStorage.getItem("safedine.tableCode");
    const savedPreferences = localStorage.getItem("safedine.preferences");
    const savedAppSettings = localStorage.getItem("safedine.appSettings");

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedHistory) setOrderHistory(JSON.parse(savedHistory));
    if (savedRestaurants) setRestaurants(JSON.parse(savedRestaurants));
    if (savedPreferences) setUserPreferences(JSON.parse(savedPreferences));
    if (savedAppSettings) {
      const settings = JSON.parse(savedAppSettings);
      // Remove darkMode from settings since it's handled by theme context
      const { darkMode, ...filteredSettings } = settings;
      setAppSettings(filteredSettings);
    }
    
    // Set restaurant ID and table
    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    } else if (savedRestaurantName) {
      // Fallback: if only restaurant name exists, try to find ID by name
      // This will be handled by the fallback query below
      setRestaurantName(savedRestaurantName);
    }
    setTableNumber(savedTableCode || "Unknown");

    // Load favorites from localStorage for guest users or as fallback
    const savedFavourites = localStorage.getItem("safedine.favourites");
    if (savedFavourites && !user?.id) {
      setFavourites(JSON.parse(savedFavourites));
    }
  }, [user?.id]);

  // Update restaurants when user restaurant visits data loads
  useEffect(() => {
    if (user?.id && userRestaurantVisits) {
      setRestaurants(userRestaurantVisits);
    }
  }, [user?.id, userRestaurantVisits]);

  // Fallback query to find restaurant by name if no ID is stored
  const { data: restaurantByName } = useQuery({
    queryKey: ['restaurant-by-name', restaurantName],
    queryFn: async () => {
      if (!restaurantName || restaurantId) return null; // Only run if we have name but no ID
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, address')
        .eq('name', restaurantName)
        .maybeSingle(); // Use maybeSingle to avoid errors if not found
      
      if (error) {
        console.error('Error finding restaurant by name:', error);
        return null;
      }
      return data;
    },
    enabled: !!restaurantName && !restaurantId
  });

  useEffect(() => {
    // If we found restaurant by name, update the ID
    if (restaurantByName) {
      setRestaurantId(restaurantByName.id);
      localStorage.setItem("safedine.restaurantId", restaurantByName.id);
    }
  }, [restaurantByName]);

  useEffect(() => {
    // Update restaurant name when restaurant data loads
    if (restaurantData) {
      setRestaurantName(restaurantData.name);
    }
  }, [restaurantData]);

  useEffect(() => {
    // Set first menu as default when menus load
    if (menus && menus.length > 0 && !selectedMenu) {
      setSelectedMenu(menus[0].id);
    }
  }, [menus, selectedMenu]);

  // Helper functions
  const isItemSafeForUser = (item: MenuItem) => {
    // Check if item contains any allergens the user wants to avoid
    const hasAllergens = userPreferences.allergens.some(allergen => 
      item.allergens.includes(allergen)
    );
    
    // Check dietary preferences
    let matchesDietaryPrefs = true;
    
    if (userPreferences.diets.length > 0) {
      const hasVegan = userPreferences.diets.includes('VG');
      const hasVegetarian = userPreferences.diets.includes('V');
      const itemHasV = item.dietary_info.includes('V');
      const itemHasVG = item.dietary_info.includes('VG');
      
      // Animal-derived allergens that vegans cannot have
      const animalAllergens = ['D', 'E', 'M']; // Dairy, Eggs, Mollusks
      const itemHasAnimalProducts = item.allergens.some(allergen => 
        animalAllergens.includes(allergen)
      );
      
      const hasNeitherVNorVG = !itemHasV && !itemHasVG;
      
      if (hasVegan) {
        // Vegans can see items with VG symbol OR items with neither V nor VG symbols
        // BUT NOT items with any animal-derived allergens
        matchesDietaryPrefs = (itemHasVG || hasNeitherVNorVG) && !itemHasAnimalProducts;
      } else if (hasVegetarian) {
        // Vegetarians can see items with V or VG symbols OR items with neither V nor VG symbols
        matchesDietaryPrefs = itemHasV || itemHasVG || hasNeitherVNorVG;
      }
    }
    
    return !hasAllergens && matchesDietaryPrefs;
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      const updatedCart = cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartItems(updatedCart);
      localStorage.setItem("safedine.cart", JSON.stringify(updatedCart));
    } else {
      const newCartItem: CartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      };
      const updatedCart = [...cartItems, newCartItem];
      setCartItems(updatedCart);
      localStorage.setItem("safedine.cart", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(cartItem => cartItem.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("safedine.cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    const updatedCart = cartItems.map(cartItem =>
      cartItem.id === itemId
        ? { ...cartItem, quantity: newQuantity }
        : cartItem
    );
    setCartItems(updatedCart);
    localStorage.setItem("safedine.cart", JSON.stringify(updatedCart));
  };

  const toggleFavourite = async (itemId: string) => {
    const isCurrentlyFavourite = favourites.includes(itemId);
    
    if (user?.id) {
      // User is authenticated - save to database
      try {
        if (isCurrentlyFavourite) {
          // Remove from database
          const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('menu_item_id', itemId);
          
          if (error) throw error;
          
          // Update local state
          const updatedFavourites = favourites.filter(id => id !== itemId);
          setFavourites(updatedFavourites);
          
          toast({
            title: "Removed from favorites",
            description: "Item removed from your favorites.",
          });
        } else {
          // Add to database
          const { error } = await supabase
            .from('user_favorites')
            .insert({
              user_id: user.id,
              menu_item_id: itemId
            });
          
          if (error) throw error;
          
          // Update local state
          const updatedFavourites = [...favourites, itemId];
          setFavourites(updatedFavourites);
          
          toast({
            title: "Added to favorites",
            description: "Item added to your favorites.",
          });
        }
        
        // Refetch to ensure consistency
        refetchFavorites();
        
      } catch (error) {
        console.error('Error updating favorites:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update favorites. Please try again.",
        });
      }
    } else {
      // Guest user - use localStorage
      const updatedFavourites = isCurrentlyFavourite
        ? favourites.filter(id => id !== itemId)
        : [...favourites, itemId];
      
      setFavourites(updatedFavourites);
      localStorage.setItem("safedine.favourites", JSON.stringify(updatedFavourites));
      
      toast({
        title: isCurrentlyFavourite ? "Removed from favorites" : "Added to favorites",
        description: isCurrentlyFavourite 
          ? "Item removed from your favorites." 
          : "Item added to your favorites. Sign in to save across devices!",
      });
    }
  };

  const currentMenu = menus?.find(menu => menu.id === selectedMenu);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleReorder = (order: OrderHistory) => {
    // Clear current cart
    setCartItems([]);
    
    // Add items from the order to cart - properly handle Json type
    const orderItems = Array.isArray(order.items) ? (order.items as unknown as CartItem[]) : [];
    const reorderedItems = orderItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));
    
    setCartItems(reorderedItems);
    localStorage.setItem("safedine.cart", JSON.stringify(reorderedItems));
    
    // Switch to cart tab
    setActiveTab("cart");
    
    // Show success message
    const itemCount = reorderedItems.reduce((sum, item) => sum + item.quantity, 0);
    toast({
      title: "Items Added to Cart",
      description: `${itemCount} item${itemCount !== 1 ? 's' : ''} from your previous order have been added to your cart.`,
    });
  };

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setAppSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Save to localStorage
    const newSettings = { ...appSettings, [setting]: value };
    localStorage.setItem("safedine.appSettings", JSON.stringify(newSettings));
    
    // Handle specific settings
    if (setting === 'notifications' || setting === 'emailNotifications') {
      toast({
        title: `${setting === 'notifications' ? 'Push' : 'Email'} notifications ${value ? 'enabled' : 'disabled'}`,
        description: "Your notification preferences have been updated.",
      });
    }
  };

  const handleDarkModeToggle = () => {
    toggleTheme();
    toast({
      title: theme === 'light' ? "Dark mode enabled" : "Light mode enabled",
      description: "App theme updated successfully.",
    });
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear local data
      localStorage.removeItem("safedine.cart");
      localStorage.removeItem("safedine.favourites");
      localStorage.removeItem("safedine.appSettings");
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      
      // Navigate to auth or home page
      navigate("/auth");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "Failed to sign out. Please try again.",
      });
    }
  };

  const handlePlaceOrder = async () => {
    console.log('Starting order placement...');
    console.log('User:', user?.id);
    console.log('Cart items:', cartItems);
    
    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "Please add items to your cart before ordering.",
      });
      return;
    }

    const storedTableId = localStorage.getItem("safedine.tableId");
    const tableCode = localStorage.getItem("safedine.tableCode");
    
    console.log('Table info from storage:', { storedTableId, tableCode, restaurantId });

    if (!storedTableId || !tableCode) {
      toast({
        variant: "destructive",
        title: "Table Information Missing",
        description: "Please select a table first.",
      });
      return;
    }

    if (!restaurantId) {
      toast({
        variant: "destructive",
        title: "Restaurant Information Missing",
        description: "Restaurant information is required to place an order.",
      });
      return;
    }

    try {
      let actualTableId = storedTableId;
      
      // If the stored table ID is a temporary ID (starts with "temp-"), look up the real table
      if (storedTableId.startsWith("temp-")) {
        console.log('Looking up actual table ID for code:', tableCode);
        
        const { data: tableData, error: tableError } = await supabase
          .from('dining_tables')
          .select('id')
          .eq('code', tableCode)
          .eq('restaurant_id', restaurantId)
          .maybeSingle();
        
        if (tableError) {
          console.error('Error looking up table:', tableError);
          throw new Error('Could not find table information');
        }
        
        if (tableData) {
          actualTableId = tableData.id;
          console.log('Found actual table ID:', actualTableId);
        } else {
          throw new Error('Table not found in database');
        }
      }
      
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const orderData = {
        user_id: user?.id || null,
        restaurant_id: restaurantId,
        table_id: actualTableId,
        table_code: tableCode,
        items: JSON.parse(JSON.stringify(cartItems)), // Convert to plain JSON
        total_amount: totalAmount,
        status: 'pending'
      };
      
      console.log('Order data being sent:', orderData);
      
      const { error, data } = await supabase
        .from('orders')
        .insert(orderData)
        .select();

      console.log('Supabase response:', { error, data });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      // Clear cart after successful order
      setCartItems([]);
      localStorage.removeItem("safedine.cart");

      // Save restaurant visit for authenticated users
      if (user?.id) {
        try {
          // First check if this is a new visit
          const { data: existingVisit } = await supabase
            .from('restaurant_visits')
            .select('visit_count')
            .eq('user_id', user.id)
            .eq('restaurant_id', restaurantId)
            .maybeSingle();
          
          if (existingVisit) {
            // Update existing visit
            const { error: visitError } = await supabase
              .from('restaurant_visits')
              .update({
                last_visit_at: new Date().toISOString(),
                visit_count: existingVisit.visit_count + 1
              })
              .eq('user_id', user.id)
              .eq('restaurant_id', restaurantId);
            
            if (visitError) {
              console.error('Error updating restaurant visit:', visitError);
            }
          } else {
            // Create new visit record
            const { error: visitError } = await supabase
              .from('restaurant_visits')
              .insert({
                user_id: user.id,
                restaurant_id: restaurantId,
                first_visit_at: new Date().toISOString(),
                last_visit_at: new Date().toISOString(),
                visit_count: 1
              });
            
            if (visitError) {
              console.error('Error creating restaurant visit:', visitError);
            }
          }
          
          // Refetch restaurant visits to update the UI
          refetchRestaurantVisits();
        } catch (error) {
          console.error('Error in restaurant visit logic:', error);
        }
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order has been sent to Table ${tableCode}. Total: £${totalAmount.toFixed(2)}`,
      });

      // Refetch order history to show the new order
      refetchOrders();
      
      // Switch to profile tab to show order confirmation
      setActiveTab("profile");

    } catch (error: any) {
      console.error('Error placing order:', error);
      console.error('Error message:', error?.message);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: `Failed to place your order: ${error?.message || 'Unknown error'}. Please try again.`,
      });
    }
  };

  const EmptyState = ({ icon: Icon, title, description }: { 
    icon: any, 
    title: string, 
    description: string 
  }) => (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <Icon className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Welcome to SafeDine</h1>
            <p className="text-primary-foreground/90 text-sm">
              {restaurantName} • Table {tableNumber}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setActiveTab("profile")}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatar-placeholder.png" />
              <AvatarFallback className="bg-primary-foreground text-primary text-sm">
                U
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      {/* Floating Cart FAB */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-20 right-4 z-50">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-strong bg-primary hover:bg-primary-dark"
            onClick={() => setActiveTab("cart")}
          >
            <ShoppingCart className="h-6 w-6" />
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground p-0 flex items-center justify-center text-xs">
              {cartItemCount}
            </Badge>
          </Button>
        </div>
      )}

      {/* Main Content with Tabs */}
      <div className="px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="menu" className="mt-6 space-y-4">
            {menusLoading ? (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Menu className="h-5 w-5 text-primary" />
                    Loading Menu...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ) : !menus || menus.length === 0 ? (
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Menu className="h-5 w-5 text-primary" />
                      Menu (Safe for You)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyState
                      icon={Menu}
                      title="Menu Coming Soon"
                      description="Your personalized safe menu will appear here based on your dietary preferences."
                    />
                    {/* Debug info for troubleshooting */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-4 p-3 bg-muted rounded-lg text-xs space-y-1">
                        <p><strong>Debug Info:</strong></p>
                        <p>Restaurant ID: {restaurantId || "Not set"}</p>
                        <p>Restaurant Name: {restaurantName || "Not set"}</p>
                        <p>Menus Loading: {menusLoading ? "Yes" : "No"}</p>
                        <p>Menus Found: {menus?.length || 0}</p>
                        <p>Menu Error: {menusError ? String(menusError) : "None"}</p>
                        {localStorage.getItem("safedine.restaurantId") && (
                          <p>LocalStorage ID: {localStorage.getItem("safedine.restaurantId")}</p>
                        )}
                      </div>
                    )}
                    {/* Always show debug info for now */}
                    <div className="mt-4 p-3 bg-muted rounded-lg text-xs space-y-1">
                      <p><strong>Debug Info:</strong></p>
                      <p>Restaurant ID: {restaurantId || "Not set"}</p>
                      <p>Restaurant Name: {restaurantName || "Not set"}</p>
                      <p>Menus Loading: {menusLoading ? "Yes" : "No"}</p>
                      <p>Menus Found: {menus?.length || 0}</p>
                      <p>Menu Error: {menusError ? String(menusError) : "None"}</p>
                      {localStorage.getItem("safedine.restaurantId") && (
                        <p>LocalStorage ID: {localStorage.getItem("safedine.restaurantId")}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
            ) : (
              <>
                {/* Menu Type Selector */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {menus.map((menu) => (
                    <Button
                      key={menu.id}
                      variant={selectedMenu === menu.id ? "default" : "outline"}
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => setSelectedMenu(menu.id)}
                    >
                      {menu.name}
                    </Button>
                  ))}
                </div>

                {/* Current Menu Content */}
                {currentMenu && (
                  <div className="space-y-6">
                    {/* Menu Header */}
                    <Card className="shadow-soft">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Menu className="h-5 w-5 text-primary" />
                          {currentMenu.name} Menu
                        </CardTitle>
                        {currentMenu.description && (
                          <p className="text-sm text-muted-foreground">
                            {currentMenu.description}
                          </p>
                        )}
                        {userPreferences.allergens.length > 0 && (
                          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <Shield className="h-4 w-4 text-primary" />
                            <p className="text-sm text-primary font-medium">
                              Filtering out: {userPreferences.allergens.join(", ")}
                            </p>
                          </div>
                        )}
                      </CardHeader>
                    </Card>

                    {/* Menu Categories */}
                    {currentMenu.categories.map((category) => {
                      const safeItems = category.items.filter(isItemSafeForUser);
                      const unsafeItems = category.items.filter(item => !isItemSafeForUser(item));
                      
                      return (
                        <Card key={category.id} className="shadow-soft">
                          <CardHeader>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            {category.description && (
                              <p className="text-sm text-muted-foreground">
                                {category.description}
                              </p>
                            )}
                            <div className="flex gap-2 text-sm">
                              <span className="text-green-600 font-medium">
                                {safeItems.length} safe items
                              </span>
                              {unsafeItems.length > 0 && (
                                <span className="text-orange-600">
                                  • {unsafeItems.length} filtered out
                                </span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Safe Items */}
                            {safeItems.map((item) => (
                              <div
                                key={item.id}
                                className="p-4 border border-green-200 bg-green-50/50 rounded-lg relative"
                              >
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-foreground">
                                        {item.name}
                                      </h4>
                                      {item.is_popular && (
                                        <Badge variant="secondary" className="text-xs">
                                          <Star className="h-3 w-3 mr-1" />
                                          Popular
                                        </Badge>
                                      )}
                                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                        ✓ Safe
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {item.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="font-semibold text-lg text-foreground">
                                        £{item.price.toFixed(2)}
                                      </span>
                                      {item.preparation_time && (
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {item.preparation_time}min
                                        </span>
                                      )}
                                      {item.calories && (
                                        <span>{item.calories} cal</span>
                                      )}
                                      {item.spice_level && item.spice_level > 0 && (
                                        <span className="text-red-600">
                                          🌶️ {item.spice_level}/5
                                        </span>
                                      )}
                                    </div>
                                    {(item.dietary_info.length > 0 || item.allergens.length > 0) && (
                                      <div className="flex gap-1 mt-2 flex-wrap">
                                        {item.dietary_info.map((diet) => (
                                          <Badge key={diet} variant="outline" className="text-xs">
                                            {diet}
                                          </Badge>
                                        ))}
                                        {item.allergens.map((allergen) => (
                                          <Badge key={allergen} variant="destructive" className="text-xs">
                                            {allergen}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => addToCart(item)}
                                      className="whitespace-nowrap"
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Add
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => toggleFavourite(item.id)}
                                      className={favourites.includes(item.id) ? "text-red-600" : ""}
                                    >
                                      <Heart className="h-4 w-4" fill={favourites.includes(item.id) ? "currentColor" : "none"} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {safeItems.length === 0 && (
                              <div className="text-center py-8 text-muted-foreground">
                                <p>No safe items in this category based on your preferences.</p>
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => navigate("/allergen-preferences")}
                                  className="mt-2"
                                >
                                  Update Preferences
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="cart" className="mt-6 space-y-4">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Your Cart
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <EmptyState
                    icon={ShoppingCart}
                    title="Your cart is empty"
                    description="Start exploring the menu to add delicious dishes to your cart."
                  />
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">£{item.price.toFixed(2)} each</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {/* Total Price */}
                          <p className="font-semibold min-w-[4rem] text-right">
                            £{(item.price * item.quantity).toFixed(2)}
                          </p>
                          
                          {/* Remove Button */}
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Cart Total */}
                    <div className="border-t pt-3 mt-4">
                      <div className="flex justify-between items-center text-lg font-semibold mb-4">
                        <span>Total:</span>
                        <span>£{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                      </div>
                      
                      {/* Order Button */}
                      <Button 
                        onClick={handlePlaceOrder}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                        disabled={cartItems.length === 0}
                      >
                        Order to Table
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favourites" className="mt-6 space-y-4">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Your Favourites
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favourites.length === 0 ? (
                  <EmptyState
                    icon={Heart}
                    title="No favourites yet"
                    description="Tap the ♥ on a dish to add it to your favourites for quick reordering."
                  />
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      // Get all favourite items from all menus
                      const favouriteItems: MenuItem[] = [];
                      menus?.forEach(menu => {
                        menu.categories.forEach(category => {
                          category.items
                            .filter(item => favourites.includes(item.id) && isItemSafeForUser(item))
                            .forEach(item => favouriteItems.push(item));
                        });
                      });
                      
                      return favouriteItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{item.name}</h4>
                              {item.is_popular && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                              {item.dietary_info.length > 0 && (
                                <div className="flex gap-1">
                                  {item.dietary_info.map((diet) => (
                                    <Badge key={diet} variant="outline" className="text-xs">
                                      {diet}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="font-semibold text-primary">£{item.price.toFixed(2)}</span>
                              {item.preparation_time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {item.preparation_time} min
                                </span>
                              )}
                              {item.calories && (
                                <span>{item.calories} cal</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleFavourite(item.id)}
                              className="text-red-600"
                            >
                              <Heart className="h-4 w-4" fill="currentColor" />
                            </Button>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6 space-y-4">
            {/* Profile Summary */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  My Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/avatar-placeholder.png" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">Guest User</h3>
                    <p className="text-muted-foreground">Dining anonymously</p>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/allergen-preferences")}
                >
                  Edit Dietary Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Order History */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!user?.id ? (
                  <EmptyState
                    icon={Clock}
                    title="Sign in to see your orders"
                    description="Create an account to track your order history across visits."
                  />
                ) : (!userOrderHistory || userOrderHistory.length === 0) ? (
                  <EmptyState
                    icon={Clock}
                    title="No past orders found"
                    description="Your order history will appear here after you place your first order."
                  />
                ) : (
                  <div className="space-y-3">
                    {userOrderHistory.map((order) => (
                      <div key={order.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">Table {order.table_code}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {order.status}
                            </Badge>
                          </div>
                          <p className="font-semibold">£{order.total_amount.toFixed(2)}</p>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {Array.isArray(order.items) && (order.items as unknown as CartItem[]).map((item: CartItem, index: number) => (
                            <span key={index}>
                              {item.quantity}x {item.name}
                              {index < (order.items as unknown as CartItem[]).length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleReorder(order)}>
                          Reorder
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Restaurants Visited */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Restaurants Visited
                </CardTitle>
              </CardHeader>
              <CardContent>
                {restaurants.length === 0 ? (
                  <EmptyState
                    icon={MapPin}
                    title="No restaurants visited"
                    description="Your restaurant history will appear here as you dine at different locations."
                  />
                ) : (
                  <div className="space-y-3">
                    {restaurants.map((restaurant) => (
                      <div key={restaurant.id} className="p-3 bg-muted rounded-lg">
                        <h4 className="font-medium">{restaurant.restaurant_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          First visited: {new Date(restaurant.first_visit_at).toLocaleDateString()} • {restaurant.visit_count} visit{restaurant.visit_count !== 1 ? 's' : ''}
                        </p>
                        {restaurant.visit_count > 1 && (
                          <p className="text-xs text-muted-foreground">
                            Last visit: {new Date(restaurant.last_visit_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-soft">
                <CardContent className="p-4 text-center">
                  <Bell className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Notifications</p>
                </CardContent>
              </Card>
              <Card className="shadow-soft cursor-pointer" onClick={() => setSettingsOpen(true)}>
                <CardContent className="p-4 text-center hover:bg-primary/5 transition-colors">
                  <Settings className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Settings</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact & Support */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => {
                    window.open('tel:+441202123456');
                    toast({
                      title: "Calling Restaurant",
                      description: `Connecting you to ${restaurantName || 'the restaurant'} at +44 1202 123 456`,
                    });
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Restaurant
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => navigate("/contact")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Form
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => navigate("/faqs")}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQs
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => navigate("/privacy-policy")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => navigate("/terms-and-conditions")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Terms & Conditions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "menu" 
                ? "text-primary bg-primary/5" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs font-medium">Menu</span>
          </button>
          
          <button
            onClick={() => setActiveTab("cart")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
              activeTab === "cart" 
                ? "text-primary bg-primary/5" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs font-medium">Cart</span>
            {cartItemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground p-0 flex items-center justify-center text-xs">
                {cartItemCount}
              </Badge>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("favourites")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "favourites" 
                ? "text-primary bg-primary/5" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs font-medium">Favourites</span>
          </button>
          
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "profile" 
                ? "text-primary bg-primary/5" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserIcon className="h-5 w-5" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Settings Sheet */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Profile Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile</h3>
              
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase() || 'G'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user?.email || 'Guest User'}</p>
                  <p className="text-sm text-muted-foreground">
                    {user ? 'Signed in' : 'Anonymous user'}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => {
                  setSettingsOpen(false);
                  navigate("/allergen-preferences");
                }}
              >
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Dietary Preferences
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            {/* App Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">App Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <span>Dark Mode</span>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch
                    checked={appSettings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch
                    checked={appSettings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Language</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{appSettings.language}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account</h3>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/privacy-policy")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/terms-and-conditions")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Terms of Service
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Help & Support",
                      description: "Contact us at support@safedine.com or call +44 800 123 456 for assistance.",
                    });
                  }}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    window.open('mailto:feedback@safedine.com?subject=SafeDine Feedback');
                    toast({
                      title: "Feedback",
                      description: "Thank you for helping us improve SafeDine!",
                    });
                  }}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Send Feedback
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Emergency Contact",
                      description: "For dining emergencies, please contact restaurant staff immediately or call 999.",
                    });
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Contact
                </Button>
              </div>
              
              {user && (
                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>

            {/* App Info & Support */}
            <div className="pt-4 space-y-3">
              <Separator />
              
              <div className="text-center space-y-2">
                <div className="text-sm font-medium">SafeDine v1.0.0</div>
                <div className="text-xs text-muted-foreground">Safe dining for everyone</div>
              </div>
              
              <div className="bg-muted rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-medium">Support Contacts</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span>General Support:</span>
                    <span className="text-primary">support@safedine.com</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Emergency Hotline:</span>
                    <span className="text-primary">+44 800 123 456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Business Hours:</span>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>© 2024 SafeDine Ltd. All rights reserved.</p>
                <p>Making dining safe and accessible for everyone</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MainHub;