
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Article from "./pages/Article";
import FindDonors from "./pages/FindDonors";
import Emergency from "./pages/Emergency";
import Centers from "./pages/Centers";
import Resources from "./pages/Resources";
import SignIn from "./pages/SignIn";
import LearnMore from "./pages/LearnMore";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
