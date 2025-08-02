import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import Home from "./pages/home";
import CalendarPage from "./pages/calendar";
import AIInsightsPage from "./pages/ai-insights";
import TeamManagement from "./pages/team-management";
import Landing from "./pages/landing";
import Pricing from "./pages/pricing";
import Billing from "./pages/billing";
import Success from "./pages/success";
import NotFound from "./pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/team" component={TeamManagement} />
          <Route path="/calendar" component={CalendarPage} />
          <Route path="/ai-insights" component={AIInsightsPage} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/billing" component={Billing} />
          <Route path="/success" component={Success} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="socialai-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;