import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/components/AdminDashboard";
import ContactUs from "@/pages/ContactUs";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div style={{ padding: 40 }}><h1>✅ Router Working</h1></div>} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
