import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "@/components/ui/use-toast";
import { Search, AlertCircle, RefreshCw } from "lucide-react";

interface DiningTable {
  id: string;
  restaurant_id: string;
  code: string;
}

export default function TableSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [filteredTables, setFilteredTables] = useState<DiningTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<DiningTable | null>(null);
  const [searchCode, setSearchCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    // Filter tables based on search
    if (searchCode.trim() === "") {
      setFilteredTables(tables);
    } else {
      setFilteredTables(
        tables.filter(table =>
          table.code.toLowerCase().includes(searchCode.toLowerCase())
        )
      );
    }
  }, [tables, searchCode]);

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching tables for restaurant:", restaurantId);

      // Always fetch all tables to ensure customers can always select one
      const { data, error: fetchError } = await supabase
        .from("dining_tables")
        .select("*")
        .order("code::integer");

      if (fetchError) {
        console.error("Supabase error:", fetchError);
        // Don't throw error, just log it and continue with empty array
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

  const handleManualCodeSubmit = (code: string) => {
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    // Try to find the table in current restaurant
    const foundTable = tables.find(table => 
      table.code.toLowerCase() === trimmedCode.toLowerCase()
    );

    if (foundTable) {
      handleTableSelect(foundTable);
    } else {
      // Allow proceeding with code even if not found in database
      localStorage.setItem("safedine.tableCode", trimmedCode);
      localStorage.removeItem("safedine.tableId");
      
      toast({
        title: `Table ${trimmedCode} selected`,
        description: "Code will be verified with restaurant",
      });
      
      setSelectedTable({ id: "", restaurant_id: restaurantId!, code: trimmedCode });
    }
  };

  const handleContinue = () => {
    if (selectedTable) {
      navigate("/consent");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchCode.trim()) {
      handleManualCodeSubmit(searchCode);
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
          {/* Search Input Skeleton */}
          <div className="relative mb-6">
            <div className="h-12 bg-muted animate-pulse rounded-md"></div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 12 }).map((_, i) => (
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
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search table code (e.g., 12)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 text-base h-12"
            aria-label="Search for table by code"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 border border-destructive/20 bg-destructive/5 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-destructive mb-2">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTables}
                className="h-8"
              >
                <RefreshCw className="w-3 h-3 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Tables Grid */}
        {!error && (
          <>
            {filteredTables.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {tables.length === 0 
                    ? "No tables available for this restaurant."
                    : "No tables match your search. Try a different code."
                  }
                </p>
                {searchCode.trim() && (
                  <Button
                    variant="outline"
                    onClick={() => handleManualCodeSubmit(searchCode)}
                    className="mt-2"
                  >
                    Use code "{searchCode}"
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {filteredTables.map((table) => (
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
          </>
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