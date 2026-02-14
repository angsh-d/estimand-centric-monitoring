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
  ArrowRight,
  Target,
  BrainCircuit,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Mock Data
const kriMetrics = [
  { id: "KRI-001", label: "SAE Reporting Latency", value: "2.4 days", target: "< 24h", status: "warning", trend: "up" },
  { id: "KRI-002", label: "Protocol Deviations", value: "4.2%", target: "< 5%", status: "good", trend: "stable" },
  { id: "KRI-003", label: "Query Response Time", value: "12 days", target: "< 14d", status: "good", trend: "down" },
  { id: "KRI-004", label: "Lost to Follow-up", value: "1.8%", target: "< 2%", status: "warning", trend: "up" }
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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Study Overview</h1>
          <p className="text-slate-500 text-[13px] max-w-2xl font-normal">
            High-level performance metrics and estimand health surveillance.
          </p>
        </div>

        {/* Estimand Health Surveillance - Apple Style Card */}
        <section className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Estimand Health</h2>
                <p className="text-[11px] text-slate-500">Real-time data integrity monitoring.</p>
              </div>
            </div>
            <button className="text-[11px] font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-1.5">
              <BrainCircuit className="h-3 w-3" />
              AI Diagnostic
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Endpoint */}
            <div className="group rounded-xl p-5 border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 cursor-default">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Endpoint</div>
                  <h3 className="text-base font-semibold text-slate-900">PFS (Progression Free Survival)</h3>
                </div>
                <div className="h-9 w-9 rounded-full bg-white text-emerald-600 flex items-center justify-center border border-slate-100 font-bold text-xs shadow-sm">
                  98%
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-slate-500">Data Completeness</span>
                    <span className="font-medium text-slate-900">100%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-900 h-full w-full" />
                  </div>
                </div>
                
                <div>
                   <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-slate-500">Event Adjudication</span>
                    <span className="font-medium text-slate-900">92%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-900 h-full w-[92%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Endpoint */}
            <div className="group rounded-xl p-5 border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 cursor-default">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Secondary Endpoint</div>
                  <h3 className="text-base font-semibold text-slate-900">OS (Overall Survival)</h3>
                </div>
                <div className="h-9 w-9 rounded-full bg-white text-amber-500 flex items-center justify-center border border-slate-100 font-bold text-xs shadow-sm">
                  85%
                </div>
              </div>
              
              <div className="space-y-4">
                 <div>
                   <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-slate-500">Survival Status Known</span>
                    <span className="font-medium text-slate-900">88%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[88%]" />
                  </div>
                </div>
                
                <div>
                   <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-slate-500">Loss to Follow-up</span>
                    <span className="font-medium text-amber-600">High (12%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[12%]" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/50 text-[10px] text-amber-600 flex items-center gap-2 font-medium">
                <AlertTriangle className="h-3 w-3" />
                3 Sites showing survival status latency &gt; 7 days.
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Enrollment Tracker */}
            <section className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Enrollment Forecast</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Actual vs. Projected subject accrual</p>
                </div>
                <div className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> On Track
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  <Skeleton height={200} width="100%" />
                </div>
              ) : (
                <div className="relative h-48 w-full mt-4 flex items-end gap-3 px-2">
                   {/* Clean Bars */}
                   {[20, 35, 45, 60, 75, 82, 95, 110, 125, 140, 155, 170].map((val, i) => (
                     <div key={i} className="flex-1 flex flex-col justify-end group relative cursor-pointer">
                       {/* Projected Ghost Bar */}
                       <div 
                         className="w-full bg-slate-100 rounded-t-sm absolute bottom-0 left-0 right-0 transition-colors group-hover:bg-slate-200"
                         style={{ height: `${(val / 200) * 100}%` }}
                       />
                       {/* Actual Bar */}
                       {i < 8 && (
                         <div 
                           className="w-full bg-slate-900 rounded-t-sm relative z-10"
                           style={{ height: `${(val * (0.9 + Math.random() * 0.2)) / val * 100}%` }}
                         />
                       )}
                       {/* Tooltip */}
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20">
                         M{i+1}: {val}
                       </div>
                     </div>
                   ))}
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-8 mt-8 pt-6 border-t border-slate-100">
                <div>
                   <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Randomized</div>
                   <div className="text-2xl font-light text-slate-900">315 <span className="text-sm text-slate-400 font-normal">/ 680</span></div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Screen Fail Rate</div>
                   <div className="text-2xl font-light text-slate-900">26%</div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Active Sites</div>
                   <div className="text-2xl font-light text-slate-900">42</div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: KRIs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-base font-semibold text-slate-900">Risk Indicators</h2>
               <button className="text-slate-400 hover:text-slate-900">
                 <MoreHorizontal className="h-4 w-4" />
               </button>
            </div>
            
            {loading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} height={100} />)
            ) : (
              kriMetrics.map((kri) => (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={kri.id} 
                  className="p-5 rounded-xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide truncate w-[70%]" title={kri.label}>
                      {kri.label}
                    </span>
                    {kri.status === 'warning' ? (
                      <div className="h-2 w-2 rounded-full bg-amber-500 ring-2 ring-amber-100" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                    )}
                  </div>
                  <div className="flex items-baseline justify-between mt-3">
                    <span className="text-2xl font-light tracking-tight text-slate-900">{kri.value}</span>
                    <span className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded",
                      kri.trend === 'up' && kri.status === 'warning' ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"
                    )}>
                      {kri.trend === 'up' ? '↗' : '↘'}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
