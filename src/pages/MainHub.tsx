import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Star
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

const MainHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menu");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantVisit[]>([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    // Load data from localStorage
    const savedCart = localStorage.getItem("safedine.cart");
    const savedFavourites = localStorage.getItem("safedine.favourites");
    const savedHistory = localStorage.getItem("safedine.orderHistory");
    const savedRestaurants = localStorage.getItem("safedine.restaurants");
    const savedRestaurantName = localStorage.getItem("safedine.restaurantName");
    const savedTableCode = localStorage.getItem("safedine.tableCode");

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedFavourites) setFavourites(JSON.parse(savedFavourites));
    if (savedHistory) setOrderHistory(JSON.parse(savedHistory));
    if (savedRestaurants) setRestaurants(JSON.parse(savedRestaurants));
    
    // Set restaurant name and table - in a real app this would come from API
    setRestaurantName(savedRestaurantName || "Acropolis Taverna");
    setTableNumber(savedTableCode || "Unknown");
  }, []);

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
              </CardContent>
            </Card>
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
                      <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
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
                <EmptyState
                  icon={Heart}
                  title="No favourites yet"
                  description="Tap the ♥ on a dish to add it to your favourites for quick reordering."
                />
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