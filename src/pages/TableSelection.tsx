import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "@/components/ui/use-toast";

interface DiningTable {
  id: string;
  restaurant_id: string;
  code: string;
}

export default function TableSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<DiningTable | null>(null);
  const [loading, setLoading] = useState(true);

  // Get restaurant from localStorage
  const restaurantId = localStorage.getItem("safedine.restaurantId");
  const restaurantName = localStorage.getItem("safedine.restaurantName");

  useEffect(() => {
    // Clear any previously stored table data so users can always select a new table
    localStorage.removeItem("safedine.tableId");
    localStorage.removeItem("safedine.tableCode");

    // Check for QR code table detection from URL only
    const tableIdFromUrl = searchParams.get("tableId");
    const tableCodeFromUrl = searchParams.get("tableCode");

    if (tableIdFromUrl || tableCodeFromUrl) {
      const code = tableCodeFromUrl;
      if (code) {
        toast({
          title: `Table ${code} detected`,
          description: "Redirecting to consent...",
        });
        setTimeout(() => navigate("/consent"), 1500);
        return;
      }
    }

    fetchTables();
  }, [navigate, searchParams]);

  const fetchTables = async () => {
    try {
      setLoading(true);

      console.log("Fetching tables for restaurant:", restaurantName);

      // Filter tables by restaurant name using a join query
      const { data, error: fetchError } = await supabase
        .from("dining_tables")
        .select(`
          *,
          restaurants!inner(name)
        `)
        .eq("restaurants.name", restaurantName || "")
        .order("code::integer");

      if (fetchError) {
        console.error("Supabase error:", fetchError);
        // If filtering by name fails, show all tables as fallback
        const { data: allTables } = await supabase
          .from("dining_tables")
          .select("*")
          .order("code::integer");
        setTables(allTables || []);
        return;
      }
      
      console.log("Fetched tables:", data);
      setTables(data || []);
    } catch (err) {
      console.error("Error fetching tables:", err);
      // Always ensure we don't show errors to customers - just show empty state
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (table: DiningTable) => {
    setSelectedTable(table);
    
    // Save to localStorage
    localStorage.setItem("safedine.tableId", table.id);
    localStorage.setItem("safedine.tableCode", table.code);
    
    toast({
      title: `Table ${table.code} selected`,
      description: "Ready to continue",
    });
  };

  const handleContinue = () => {
    if (selectedTable) {
      navigate("/consent");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-soft border-b">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Select your table
            </h1>
            <p className="text-muted-foreground">
              Tap your table number to continue.
            </p>
          </div>
        </header>

        <main className="px-4 py-6">
          {/* Skeleton Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted animate-pulse rounded-lg h-20 shadow-soft"
              />
            ))}
          </div>

          {/* Continue Button Skeleton */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
            <div className="w-full h-12 bg-muted animate-pulse rounded-md"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-soft border-b">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Select your table
          </h1>
          <p className="text-muted-foreground">
            Tap your table number to continue.
          </p>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Tables Grid */}
        {tables.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No tables available for this restaurant.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {tables.map((table) => (
              <Card
                key={table.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-medium active:scale-95 rounded-lg border ${
                  selectedTable?.code === table.code
                    ? "ring-2 ring-primary bg-primary/10 border-primary shadow-medium"
                    : "border-border hover:border-primary/30 hover:bg-primary/5 shadow-soft"
                }`}
                onClick={() => handleTableSelect(table)}
                role="button"
                tabIndex={0}
                aria-label={`Select table ${table.code}`}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleTableSelect(table);
                  }
                }}
              >
                <CardContent className="p-6 text-center min-h-[60px] flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">
                    {table.code}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Selected Table Summary */}
        {selectedTable && (
          <div className="bg-gradient-primary/10 border border-primary/20 rounded-lg p-4 mb-6 shadow-soft">
            <p className="text-sm text-muted-foreground mb-1">Selected table:</p>
            <p className="font-bold text-primary text-lg">Table {selectedTable.code}</p>
          </div>
        )}

        {/* Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <Button
            onClick={handleContinue}
            disabled={!selectedTable}
            className="w-full h-12 text-base"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </main>
    </div>
  );
}