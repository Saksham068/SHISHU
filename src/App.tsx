import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import PatientInfoPage from "@/pages/PatientInfoPage";
import SymptomsPage from "@/pages/SymptomsPage";
import RiskResultPage from "@/pages/RiskResultPage";
import TrendPage from "@/pages/TrendPage";
import AboutPage from "@/pages/AboutPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <HashRouter>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-foreground">
              <Navbar />

              <main className="relative">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/screening" element={<PatientInfoPage />} />
                  <Route path="/screening/symptoms" element={<SymptomsPage />} />
                  <Route path="/screening/results" element={<RiskResultPage />} />
                  <Route path="/trend" element={<TrendPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>

            <Toaster />
            <Sonner />
          </HashRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;