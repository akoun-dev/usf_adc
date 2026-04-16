import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { RTLProvider } from "@/components/RTLProvider";
import AppRouter from "@/app/router/AppRouter";
import { Agentation } from "agentation";
import { agentationConfig } from "@/integrations/agentation/agentationConfig";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <RTLProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRouter />
            </AuthProvider>
          </BrowserRouter>
          <Agentation {...agentationConfig} />
        </TooltipProvider>
      </RTLProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
