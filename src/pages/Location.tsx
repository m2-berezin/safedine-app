import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Location {
  id: string;
  name: string;
  city: string;
  region: string;
}

interface Restaurant {
  id: string;
  location_id: string;
  name: string;
  address: string;
  image_url?: string;
}

const Location = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);

  useEffect(() => {
    fetchLocations();
    // Check for saved selections
    const savedLocation = localStorage.getItem("safedine.location");
    const savedRestaurant = localStorage.getItem("safedine.restaurant");
    if (savedLocation) setSelectedLocationId(savedLocation);
    if (savedRestaurant) setSelectedRestaurantId(savedRestaurant);
  }, []);

  useEffect(() => {
    if (selectedLocationId) {
      fetchRestaurants(selectedLocationId);
    } else {
      setRestaurants([]);
      setSelectedRestaurantId("");
    }
  }, [selectedLocationId]);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name");

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast({
        title: "Error",
        description: "Failed to load locations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const fetchRestaurants = async (locationId: string) => {
    setIsLoadingRestaurants(true);
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("location_id", locationId)
        .order("name");

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast({
        title: "Error",
        description: "Failed to load restaurants. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
    setSelectedRestaurantId(""); // Reset restaurant selection
    localStorage.setItem("safedine.location", locationId);
    localStorage.removeItem("safedine.restaurant");
  };

  const handleRestaurantSelect = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    localStorage.setItem("safedine.restaurant", restaurantId);
  };

  const handleContinue = () => {
    if (selectedLocationId && selectedRestaurantId) {
      navigate("/table-selection");
    }
  };

  const selectedLocation = locations.find(l => l.id === selectedLocationId);
  const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId);

  if (isLoadingLocations) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Choose your location
          </h1>
          <p className="text-muted-foreground">
            Select where you're dining today
          </p>
        </div>

        {/* Step 1: Location Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            1. Select Location
          </h2>
          <div className="space-y-3">
            {locations.map((location) => (
              <Card
                key={location.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedLocationId === location.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => handleLocationSelect(location.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium text-foreground">
                        {location.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {location.city}, {location.region}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Step 2: Restaurant Selection */}
        {selectedLocationId && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              2. Select Restaurant in {selectedLocation?.name}
            </h2>
            
            {isLoadingRestaurants ? (
              <div className="text-center py-8">
                <LoadingSpinner className="mx-auto mb-2" />
                <p className="text-muted-foreground">Loading restaurants...</p>
              </div>
            ) : restaurants.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    No restaurants available in this location.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {restaurants.map((restaurant) => (
                  <Card
                    key={restaurant.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedRestaurantId === restaurant.id
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => handleRestaurantSelect(restaurant.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {restaurant.image_url ? (
                          <img
                            src={restaurant.image_url}
                            alt={restaurant.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">
                            {restaurant.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {restaurant.address}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Continue Button */}
        <div className="mt-8">
          <Button
            onClick={handleContinue}
            disabled={!selectedLocationId || !selectedRestaurantId}
            className="w-full h-12 text-lg"
            size="lg"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          {selectedLocationId && selectedRestaurantId && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Selected: <span className="font-medium text-foreground">{selectedRestaurant?.name}</span> in{" "}
                <span className="font-medium text-foreground">{selectedLocation?.name}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Location;