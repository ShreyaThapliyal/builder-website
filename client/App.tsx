import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-primary to-indigo-500 text-white shadow">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm grid place-items-center">
              <span className="text-xs font-bold">SW</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">SpendWise</span>
          </a>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Export
            </Button>
            <div className="h-9 w-9 rounded-full bg-white/20 grid place-items-center font-semibold">
              ST
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t">
        <div className="container py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} SpendWise. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
