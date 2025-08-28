import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Location from "./pages/Location";
import TableSelection from "./pages/TableSelection";
import Consent from "./pages/Consent";
import AllergenPreferences from "./pages/AllergenPreferences";
import MainHub from "./pages/MainHub";
import ContactForm from "./pages/ContactForm";
import FAQs from "./pages/FAQs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/location" element={<Location />} />
            <Route path="/table-selection" element={<TableSelection />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/allergen-preferences" element={<AllergenPreferences />} />
            <Route path="/main" element={<MainHub />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/faqs" element={<FAQs />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
