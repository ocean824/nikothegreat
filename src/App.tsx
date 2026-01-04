import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SampleKits from "./pages/SampleKits";
import DrumKits from "./pages/DrumKits";
import Terms from "./pages/Terms";
import Credits from "./pages/Credits";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sample-kits" element={<SampleKits />} />
          <Route path="/drum-kits" element={<DrumKits />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
