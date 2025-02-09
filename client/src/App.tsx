/**
 * Main application component for Voyage Genius travel planning platform.
 * Handles routing, global state management, and layout structure.
 */
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Nav } from "@/components/nav";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Search from "@/pages/search";

/**
 * Router component that defines the application's routes.
 * Uses wouter for lightweight client-side routing.
 */
function Router() {
  return (
    <Switch>
      {/* Home page with travel recommendations and featured destinations */}
      <Route path="/" component={Home} />
      {/* Search page for finding and comparing travel routes */}
      <Route path="/search" component={Search} />
      {/* Fallback route for undefined paths */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Root application component that sets up:
 * - React Query for data fetching and caching
 * - Navigation bar
 * - Routing
 * - Toast notifications
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Nav />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;