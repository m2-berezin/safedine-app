import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  ShoppingCart, 
  Heart, 
  User, 
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
  Trash2
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderHistory {
  id: string;
  date: string;
  restaurant: string;
  items: string[];
  total: number;
}

interface RestaurantVisit {
  id: string;
  name: string;
  visitDate: string;
  tableNumber: string;
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

  useEffect(() => {
    // Load data from localStorage
    const savedCart = localStorage.getItem("safedine.cart");
    const savedFavourites = localStorage.getItem("safedine.favourites");
    const savedHistory = localStorage.getItem("safedine.orderHistory");
    const savedRestaurants = localStorage.getItem("safedine.restaurants");
    const savedRestaurantId = localStorage.getItem("safedine.restaurantId");
    const savedRestaurantName = localStorage.getItem("safedine.restaurantName");
    const savedTableCode = localStorage.getItem("safedine.tableCode");
    const savedPreferences = localStorage.getItem("safedine.preferences");

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedFavourites) setFavourites(JSON.parse(savedFavourites));
    if (savedHistory) setOrderHistory(JSON.parse(savedHistory));
    if (savedRestaurants) setRestaurants(JSON.parse(savedRestaurants));
    if (savedPreferences) setUserPreferences(JSON.parse(savedPreferences));
    
    // Set restaurant ID and table
    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    } else if (savedRestaurantName) {
      // Fallback: if only restaurant name exists, try to find ID by name
      // This will be handled by the fallback query below
      setRestaurantName(savedRestaurantName);
    }
    setTableNumber(savedTableCode || "Unknown");
  }, []);

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

  const toggleFavourite = (itemId: string) => {
    const updatedFavourites = favourites.includes(itemId)
      ? favourites.filter(id => id !== itemId)
      : [...favourites, itemId];
    
    setFavourites(updatedFavourites);
    localStorage.setItem("safedine.favourites", JSON.stringify(updatedFavourites));
  };

  const currentMenu = menus?.find(menu => menu.id === selectedMenu);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span>£{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                      </div>
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
                  <User className="h-5 w-5 text-primary" />
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
                {orderHistory.length === 0 ? (
                  <EmptyState
                    icon={Clock}
                    title="No past orders found"
                    description="Your order history will appear here after you place your first order."
                  />
                ) : (
                  <div className="space-y-3">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{order.restaurant}</h4>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                          <p className="font-semibold">£{order.total.toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {order.items.join(", ")}
                        </p>
                        <Button size="sm" variant="outline">
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
                        <h4 className="font-medium">{restaurant.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {restaurant.visitDate} • Table {restaurant.tableNumber}
                        </p>
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
              <Card className="shadow-soft">
                <CardContent className="p-4 text-center">
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
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Restaurant
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Form
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQs
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
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
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainHub;