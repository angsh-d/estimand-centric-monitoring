import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import CriticalData from "@/pages/critical-data";
import Dossier from "@/pages/dossier";
import Investigations from "@/pages/investigations";
import Landing from "@/pages/landing";
import StudyOverview from "@/pages/study-overview";
import MVRCopilot from "@/pages/mvr";
import DataStatus from "@/pages/data-status";
import Configuration from "@/pages/configuration";
import MySites from "@/pages/my-sites";
import { AppShell } from "@/components/layout/app-shell";

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/study/overview" component={StudyOverview} />
        <Route path="/study/dashboard" component={Dashboard} />
        <Route path="/study/critical-data" component={CriticalData} />
        <Route path="/study/dossier" component={Dossier} />
        <Route path="/study/mvr" component={MVRCopilot} />
        <Route path="/study/data-status" component={DataStatus} />
        <Route path="/study/config" component={Configuration} />
        <Route path="/study/investigations" component={Investigations} />
        <Route path="/sites/my-sites" component={MySites} />
        <Route path="/sites/schedule" component={MySites} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
