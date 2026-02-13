import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton-loader";
import { useState } from "react";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileBarChart,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Overview
const kriMetrics = [
  {
    id: "KRI-001",
    label: "SAE Reporting Latency",
    value: "2.4 days",
    target: "< 24 hours",
    status: "warning",
    trend: "up"
  },
  {
    id: "KRI-002",
    label: "Protocol Deviations",
    value: "4.2%",
    target: "< 5%",
    status: "good",
    trend: "stable"
  },
  {
    id: "KRI-003",
    label: "Query Response Time",
    value: "12 days",
    target: "< 14 days",
    status: "good",
    trend: "down"
  },
  {
    id: "KRI-004",
    label: "Lost to Follow-up",
    value: "1.8%",
    target: "< 2%",
    status: "warning",
    trend: "up"
  }
];

export default function StudyOverview() {
  const [loading, setLoading] = useState(true);

  // Simulate loading
  setTimeout(() => setLoading(false), 1500);

  return (
    <AppShell>
      <div className="space-y-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Study Overview</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            High-level performance metrics, KRI monitoring, and enrollment status for PEARL (NCT03003962).
          </p>
        </div>

        {/* Enrollment Tracker */}
        <section className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Enrollment Progress
            </h2>
            <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              On Track
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton height={20} width="100%" />
              <Skeleton height={40} width="100%" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Randomized: 315 / 680</span>
                <span className="font-medium text-foreground">46%</span>
              </div>
              <div className="h-4 w-full bg-secondary/50 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[46%] rounded-full relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-white/10 animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/40">
                <div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Screening</div>
                   <div className="text-2xl font-semibold">428</div>
                </div>
                <div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Screen Failures</div>
                   <div className="text-2xl font-semibold text-muted-foreground">113</div>
                </div>
                <div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Discontinued</div>
                   <div className="text-2xl font-semibold text-muted-foreground">12</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* KRI Dashboard */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              Key Risk Indicators (KRIs)
            </h2>
            <button className="text-sm text-primary hover:underline">View All Metrics</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-card rounded-xl border border-border/60 p-4 space-y-3">
                  <Skeleton height={20} width="60%" />
                  <Skeleton height={40} width="40%" />
                </div>
              ))
            ) : (
              kriMetrics.map((kri) => (
                <div key={kri.id} className="p-5 rounded-xl border border-border/60 bg-card hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate pr-2" title={kri.label}>
                      {kri.label}
                    </span>
                    {kri.status === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-semibold tracking-tighter">{kri.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                    Target: <span className="font-medium text-foreground">{kri.target}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quality Tolerance Limits */}
        <section className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
           <h2 className="text-lg font-medium flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-muted-foreground" />
              Quality Tolerance Limits (QTLs)
           </h2>
           
           <div className="space-y-6">
             {loading ? (
               <Skeleton height={100} width="100%" />
             ) : (
               <div className="relative pt-6 pb-2">
                 {/* Timeline / Range Visual */}
                 <div className="h-2 bg-secondary rounded-full w-full relative">
                    {/* Safe Zone */}
                    <div className="absolute left-[20%] right-[20%] top-0 bottom-0 bg-emerald-500/20 rounded-sm" />
                    
                    {/* Current Value Marker */}
                    <div className="absolute left-[35%] top-1/2 -translate-y-1/2 flex flex-col items-center">
                       <div className="h-4 w-4 bg-primary rounded-full border-2 border-white shadow-sm mb-1" />
                       <span className="text-xs font-bold text-foreground absolute top-6 whitespace-nowrap">Current: 3.5%</span>
                    </div>

                    {/* Threshold Markers */}
                    <div className="absolute left-[20%] top-1/2 -translate-y-1/2 h-4 w-0.5 bg-muted-foreground/50" />
                    <div className="absolute right-[20%] top-1/2 -translate-y-1/2 h-4 w-0.5 bg-muted-foreground/50" />
                 </div>
                 
                 <div className="flex justify-between mt-8 text-xs text-muted-foreground">
                   <span>0%</span>
                   <span className="font-medium text-amber-600">Lower Limit: 2%</span>
                   <span className="font-medium text-emerald-600">Target Zone</span>
                   <span className="font-medium text-amber-600">Upper Limit: 8%</span>
                   <span>10%</span>
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-border/40 text-sm">
                    <span className="font-semibold text-foreground">Primary QTL:</span> Proportion of patients excluded from Per-Protocol Population due to major deviations.
                 </div>
               </div>
             )}
           </div>
        </section>
      </div>
    </AppShell>
  );
}
