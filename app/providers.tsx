"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  // intialize auth state
  const initialize = useAuthStore((s) => s.initialize);
  useEffect(() => {
    initialize()
  }, [initialize]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
