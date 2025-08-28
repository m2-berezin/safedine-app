import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Preferences {
  allergens: string[];
  diets: string[];
}

const AllergenPreferences = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<Preferences>({
    allergens: [],
    diets: []
  });

  const allergens = [
    { code: "D", label: "Dairy" },
    { code: "MU", label: "Mustard" },
    { code: "N", label: "Nuts" },
    { code: "L", label: "Lupin" },
    { code: "S", label: "Sesame" },
    { code: "G", label: "Gluten" },
    { code: "E", label: "Egg" },
    { code: "C", label: "Celery" },
    { code: "CR", label: "Crustaceans" },
    { code: "F", label: "Fish" },
    { code: "M", label: "Molluscs" },
    { code: "SO", label: "Soya" },
    { code: "SD", label: "Sulphur Dioxide" },
    { code: "P", label: "Peanuts" }
  ];

  const diets = [
    { code: "V", label: "Vegetarian" },
    { code: "VG", label: "Vegan" }
  ];

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPrefs = localStorage.getItem("safedine.preferences");
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setPreferences(parsed);
      } catch (error) {
        console.error("Error parsing saved preferences:", error);
      }
    }
  }, []);

  const toggleAllergen = (code: string) => {
    setPreferences(prev => ({
      ...prev,
      allergens: prev.allergens.includes(code)
        ? prev.allergens.filter(a => a !== code)
        : [...prev.allergens, code]
    }));
  };

  const toggleDiet = (code: string) => {
    setPreferences(prev => ({
      ...prev,
      diets: prev.diets.includes(code)
        ? prev.diets.filter(d => d !== code)
        : [...prev.diets, code]
    }));
  };

  const resetSelections = () => {
    setPreferences({ allergens: [], diets: [] });
  };

  const handleSaveAndContinue = async () => {
    // Save to localStorage
    localStorage.setItem("safedine.preferences", JSON.stringify(preferences));

    // Check if user is logged in and save to Supabase if needed
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // TODO: Implement Supabase customer_preferences table upsert when needed
        // This would require a customer_preferences table to be created first
      }
    } catch (error) {
      console.error("Error checking auth session:", error);
    }

    toast({
      title: "Preferences saved",
      description: "Your dietary preferences have been saved successfully.",
    });

    // Navigate to main hub
    navigate("/main");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Tell us your preferences
          </h1>
          <p className="text-muted-foreground">
            We'll filter the menu so you only see safe options.
          </p>
        </div>

        {/* Allergens Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Allergens
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allergens.map((allergen) => (
              <button
                key={allergen.code}
                onClick={() => toggleAllergen(allergen.code)}
                className="text-left"
                aria-label={`${allergen.code} – ${allergen.label}`}
              >
                <Badge
                  variant={preferences.allergens.includes(allergen.code) ? "default" : "secondary"}
                  className="w-full justify-start py-2 px-3 h-auto min-h-[44px] cursor-pointer transition-colors"
                >
                  <span className="font-medium">{allergen.code}</span>
                  <span className="mx-1">–</span>
                  <span>{allergen.label}</span>
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Preferences Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Dietary Preferences
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {diets.map((diet) => (
              <button
                key={diet.code}
                onClick={() => toggleDiet(diet.code)}
                className="text-left"
                aria-label={`${diet.code} – ${diet.label}`}
              >
                <Badge
                  variant={preferences.diets.includes(diet.code) ? "default" : "secondary"}
                  className="w-full justify-start py-2 px-3 h-auto min-h-[44px] cursor-pointer transition-colors"
                >
                  <span className="font-medium">{diet.code}</span>
                  <span className="mx-1">–</span>
                  <span>{diet.label}</span>
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button 
            onClick={handleSaveAndContinue}
            className="w-full"
            size="lg"
          >
            Save & Continue
          </Button>
          
          <button
            onClick={resetSelections}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset selections
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllergenPreferences;