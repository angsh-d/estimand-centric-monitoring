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
  BarChart3,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Enrollment Tracker */}
            <section className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    Enrollment Forecast
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">Actual vs. Projected subject accrual</p>
                </div>
                <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> On Track
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  <Skeleton height={200} width="100%" />
                </div>
              ) : (
                <div className="relative h-48 w-full mt-4 flex items-end gap-2 px-2 border-b border-border/40">
                   {/* Simplified Bar Chart Simulation */}
                   {[20, 35, 45, 60, 75, 82, 95, 110, 125, 140, 155, 170].map((val, i) => (
                     <div key={i} className="flex-1 flex flex-col justify-end group relative">
                       <div 
                         className="w-full bg-blue-100 rounded-t-sm relative transition-all group-hover:bg-blue-200"
                         style={{ height: `${(val / 200) * 100}%` }}
                       >
                         {/* Actuals Overlay */}
                         {i < 8 && (
                           <div 
                             className="absolute bottom-0 left-0 w-full bg-primary rounded-t-sm"
                             style={{ height: `${(val * (0.9 + Math.random() * 0.2)) / val * 100}%` }}
                           />
                         )}
                       </div>
                       <div className="text-[10px] text-muted-foreground text-center mt-2 opacity-0 group-hover:opacity-100 absolute -bottom-5 left-0 right-0">
                         M{i+1}
                       </div>
                     </div>
                   ))}
                   
                   {/* Legend */}
                   <div className="absolute top-0 right-0 p-2 bg-white/80 rounded border border-border/40 text-[10px] space-y-1">
                     <div className="flex items-center gap-2">
                       <div className="h-2 w-2 bg-primary rounded-sm" /> Actual
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="h-2 w-2 bg-blue-100 rounded-sm" /> Projected
                     </div>
                   </div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/40">
                <div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Randomized</div>
                   <div className="text-2xl font-semibold">315 <span className="text-sm text-muted-foreground font-normal">/ 680</span></div>
                </div>
                <div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Screen Fail Rate</div>
                   <div className="text-2xl font-semibold text-muted-foreground">26%</div>
                </div>
                <div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Active Sites</div>
                   <div className="text-2xl font-semibold text-muted-foreground">42</div>
                </div>
              </div>
            </section>

            {/* Quality Tolerance Limits */}
            <section className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-medium flex items-center gap-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    Quality Tolerance Limits (QTLs)
                 </h2>
                 <button className="text-xs text-primary hover:underline flex items-center gap-1">
                   View Analysis Plan <ArrowRight className="h-3 w-3" />
                 </button>
               </div>
               
               <div className="space-y-6">
                 {loading ? (
                   <Skeleton height={100} width="100%" />
                 ) : (
                   <div className="relative pt-6 pb-2">
                     <div className="h-2 bg-secondary rounded-full w-full relative">
                        {/* Safe Zone */}
                        <div className="absolute left-[20%] right-[20%] top-0 bottom-0 bg-emerald-500/20 rounded-sm" />
                        
                        {/* Current Value Marker */}
                        <div className="absolute left-[35%] top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                           <div className="h-4 w-4 bg-primary rounded-full border-2 border-white shadow-sm mb-1 group-hover:scale-125 transition-transform" />
                           <div className="absolute -top-8 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                             Current: 3.5% (p=0.04)
                           </div>
                        </div>
                        
                        <div className="absolute left-[20%] top-1/2 -translate-y-1/2 h-4 w-0.5 bg-muted-foreground/50" />
                        <div className="absolute right-[20%] top-1/2 -translate-y-1/2 h-4 w-0.5 bg-muted-foreground/50" />
                     </div>
                     
                     <div className="flex justify-between mt-6 text-xs text-muted-foreground">
                       <span className="font-medium text-amber-600">Lower Limit: 2%</span>
                       <span className="font-medium text-emerald-600">Target Zone</span>
                       <span className="font-medium text-amber-600">Upper Limit: 8%</span>
                     </div>
                     
                     <div className="mt-4 pt-4 border-t border-border/40 text-sm">
                        <span className="font-semibold text-foreground">Primary QTL:</span> Proportion of patients excluded from Per-Protocol Population due to major deviations.
                     </div>
                   </div>
                 )}
               </div>
            </section>
          </div>

          {/* Right Column: KRIs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-lg font-medium flex items-center gap-2">
                 <BarChart3 className="h-5 w-5 text-muted-foreground" />
                 Risk Indicators
               </h2>
            </div>
            
            {loading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} height={100} />)
            ) : (
              kriMetrics.map((kri) => (
                <motion.div 
                  whileHover={{ y: -2 }}
                  key={kri.id} 
                  className="p-5 rounded-xl border border-border/60 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-[70%]" title={kri.label}>
                      {kri.label}
                    </span>
                    {kri.status === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-semibold tracking-tighter text-foreground">{kri.value}</span>
                    <span className={cn(
                      "text-xs font-medium px-1.5 py-0.5 rounded",
                      kri.trend === 'up' && kri.status === 'warning' ? "bg-red-50 text-red-600" : "bg-secondary text-muted-foreground"
                    )}>
                      {kri.trend === 'up' ? '↗ Increasing' : '↘ Decreasing'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
                    <span>Target: {kri.target}</span>
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))
            )}
            
            <button className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:bg-secondary/20 hover:text-foreground transition-colors flex items-center justify-center gap-2">
               View Full Risk Dashboard <ArrowRight className="h-3 w-3" />
            </button>
          </div>

        </div>
      </div>
    </AppShell>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}
