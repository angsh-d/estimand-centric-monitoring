import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import CriticalityAnalysis from "@/pages/critical-data/criticality-analysis";
import ProtocolAnalysis from "@/pages/critical-data/protocol-analysis";
import SapAnalysis from "@/pages/critical-data/sap-analysis";
import SiteDossier from "@/pages/site-dossier";
import Dossier from "@/pages/dossier";
import Investigations from "@/pages/investigations";
import Landing from "@/pages/landing";
import StudyOverview from "@/pages/study-overview";
import MVRCopilot from "@/pages/mvr";
import DataStatus from "@/pages/data-status";
import Configuration from "@/pages/configuration";
import MySites from "@/pages/my-sites";
import { AppShell } from "@/components/layout/app-shell";
import { GlobalNavbar } from "@/components/layout/global-navbar";

function Router() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <GlobalNavbar />
      <div className="flex-1 overflow-hidden relative">
        <Switch>
          <Route path="/" component={Landing} />
          <Route>
            <AppShell>
              <Switch>
                <Route path="/study/overview" component={StudyOverview} />
                <Route path="/study/dashboard" component={Dashboard} />
                
                {/* Criticality Model Builder Sub-routes */}
                <Route path="/study/critical-data" component={() => <ProtocolAnalysis />} /> {/* Redirect/Default */}
                <Route path="/study/critical-data/protocol" component={ProtocolAnalysis} />
                <Route path="/study/critical-data/sap" component={SapAnalysis} />
                <Route path="/study/critical-data/criticality" component={CriticalityAnalysis} />

                <Route path="/study/site-dossier/:siteId" component={SiteDossier} />
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
          </Route>
        </Switch>
      </div>
    </div>
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
