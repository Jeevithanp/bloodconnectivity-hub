
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Article from "./pages/Article";
import FindDonors from "./pages/FindDonors";
import Emergency from "./pages/Emergency";
import Centers from "./pages/Centers";
import Resources from "./pages/Resources";
import SignIn from "./pages/SignIn";
import LearnMore from "./pages/LearnMore";
import { AuthProvider } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserProfile from "./pages/UserProfile";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  // Initialize Supabase and check connection
  useEffect(() => {
    async function checkSupabaseConnection() {
      try {
        const { data, error } = await supabase.auth.getUser();
        console.log("Supabase initialized", error ? "with error" : "successfully");
        if (error) console.warn("Supabase auth error:", error.message);
      } catch (err) {
        console.error("Supabase connection error:", err);
      }
    }
    
    checkSupabaseConnection();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/find-donors" element={<FindDonors />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/centers" element={<Centers />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/article" element={<Article />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/learn-more" element={<LearnMore />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
