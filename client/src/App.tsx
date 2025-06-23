// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";

// Page components
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/components/AdminDashboard";
import ContactUs from "@/pages/contact";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
