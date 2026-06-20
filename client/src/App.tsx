import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Verify from "@/pages/Verify";
import Pricing from "@/pages/Pricing";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import PayGate from "@/pages/PayGate";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/verify" component={Verify} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/dashboard">
            {() => localStorage.getItem("paid") === "true" ? <Dashboard /> : <PayGate />}
          </Route>
          <Route path="/auth" component={Auth} />
          <Route path="/paygate" component={PayGate} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
