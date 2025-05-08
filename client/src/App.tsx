import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import MessagesPage from "@/pages/messages-page";
import RecipientsPage from "@/pages/recipients-page";
import SettingsPage from "@/pages/settings-page";
import LandingPage from "@/pages/landing-page";

function Router() {
  console.log("Router rendering, current path:", window.location.pathname);
  
  // Valid paths including the new landing page
  const validPaths = ['/', '/messages', '/recipients', '/settings', '/auth', '/landing'];
  
  // If we're at an unexpected path, redirect to /landing
  if (!validPaths.includes(window.location.pathname)) {
    // For debugging purposes
    console.log("Redirecting from unknown path:", window.location.pathname);
    
    // Redirect to landing page after a short delay (to allow logs to be visible)
    setTimeout(() => {
      window.location.href = "/landing";
    }, 100);
    
    return <div>Redirecting to landing page...</div>;
  }
  
  return (
    <Switch>
      <Route path="/landing">
        <LandingPage />
      </Route>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/messages" component={MessagesPage} />
      <ProtectedRoute path="/recipients" component={RecipientsPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <Route path="/auth">
        <AuthPage />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
