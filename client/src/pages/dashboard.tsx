import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CardSkeleton } from "@/components/ui/skeleton-loader";
import { 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  MoreHorizontal,
  TrendingUp,
  Activity,
  Search,
  ChevronDown,
  XCircle,
  Eye,
  ArrowRight,
  Target,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const metrics = [
  { 
    label: "Critical Signals", 
    value: "5", 
    subtext: "Action required", 
    status: "critical",
    icon: AlertCircle
  },
  { 
    label: "Total Open Signals", 
    value: "24", 
    subtext: "+3 vs yesterday", 
    status: "warning",
    icon: Activity
  },
  { 
    label: "Sites with Issues", 
    value: "3", 
    subtext: "12% of total sites", 
    status: "warning",
    icon: TrendingUp
  },
  { 
    label: "Resolved (7d)", 
    value: "18", 
    subtext: "Avg time: 1.2d", 
    status: "good",
    icon: CheckCircle2
  },
];

const signals = [
  {
    id: "SIG-2026-042",
    type: "Data Quality",
    title: "Concomitant Medication Date Mismatch",
    description: "Start date in EDC (Jan 12) conflicts with Safety Narrative (Jan 14) for Subject 109-004.",
    site: "109 - Charité Berlin",
    priority: "High",
    status: "New",
    created: "2h ago",
    category: "Reconciliation",
    estimand: "PFS Analysis"
  },
  {
    id: "SIG-2026-039",
    type: "Safety",
    title: "Potential SAE Under-reporting",
    description: "AE 'Grade 3 Neutropenia' recorded in Lab Data but missing from AE Log for Subject 402-011.",
    site: "402 - Mass General",
    priority: "Critical",
    status: "Investigating",
    created: "5h ago",
    category: "Safety",
    estimand: "Safety Population"
  },
  {
    id: "SIG-2026-035",
    type: "Protocol",
    title: "Visit Window Deviation Trend",
    description: "3 consecutive subjects at Site 331 missed the Visit 6 window by >3 days.",
    site: "331 - Univ. of Tokyo",
    priority: "Medium",
    status: "Open",
    created: "1d ago",
    category: "Compliance",
    estimand: "Per-Protocol"
  },
  {
    id: "SIG-2026-031",
    type: "Data Quality",
    title: "Duplicate Lab Records",
    description: "Multiple hematology panels received with identical timestamps for Subject 205-003.",
    site: "205 - Gustave Roussy",
    priority: "Low",
    status: "New",
    created: "1d ago",
    category: "Data Mgmt",
    estimand: "Safety Labs"
  }
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // Simulate loading
  setTimeout(() => setLoading(false), 1500);

  return (
    <AppShell>
      <div className="space-y-8 pb-10 h-full flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col gap-1 shrink-0">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Signal Dashboard</h1>
          <p className="text-slate-500 text-[13px] max-w-2xl font-normal">
            Real-time monitoring of data quality, safety, and protocol compliance signals.
          </p>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {loading ? (
            Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            metrics.map((metric, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-md transition-all cursor-default group">
                <div className="flex justify-between items-start mb-3">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    metric.status === 'critical' ? 'bg-red-50 text-red-600' : 
                    metric.status === 'warning' ? 'bg-amber-50 text-amber-600' : 
                    'bg-emerald-50 text-emerald-600'
                  )}>
                    <metric.icon className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  {metric.status === 'critical' && (
                    <div className="h-2 w-2 rounded-full bg-red-500 ring-2 ring-red-100 animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">{metric.value}</div>
                  <div className="text-[13px] font-medium text-slate-500">{metric.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-medium">{metric.subtext}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          
          {/* Signal Feed */}
          <div className="flex-1 flex flex-col bg-transparent overflow-hidden">
            <div className="flex items-center justify-between mb-4 shrink-0 px-1">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search signals..." 
                    className="h-8 w-64 rounded-lg bg-white border border-slate-200 pl-9 pr-4 text-[13px] focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="flex items-center bg-white border border-slate-200/60 rounded-lg p-0.5 shadow-sm">
                  {['All', 'High', 'Critical', 'New'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "px-3 py-1 rounded-md text-[11px] font-medium transition-all",
                        filter === f ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
                <Filter className="h-3 w-3" />
                Filter
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scroll-smooth">
              {loading ? (
                 Array(3).fill(0).map((_, i) => (
                   <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
                 ))
              ) : (
                signals.map((signal, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={signal.id}
                    className="group bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
                      signal.priority === 'Critical' ? "bg-red-500" :
                      signal.priority === 'High' ? "bg-orange-500" :
                      signal.priority === 'Medium' ? "bg-amber-400" :
                      "bg-blue-400"
                    )} />
                    
                    <div className="flex justify-between items-start mb-2 pl-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{signal.id}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          {signal.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          {signal.created}
                        </span>
                        <button className="text-slate-300 hover:text-slate-600 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pl-3 pr-8 relative">
                      <h3 className="text-[15px] font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {signal.title}
                      </h3>
                      <p className="text-[13px] text-slate-500 mb-3 leading-relaxed font-normal">
                        {signal.description}
                      </p>
                      
                      <div className="mb-4 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                        <Target className="h-3 w-3 text-slate-400" />
                        Impacts: <span className="font-medium text-slate-700">{signal.estimand}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                             <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600">
                               {signal.site.split(' ')[0]}
                             </div>
                             {signal.site.substring(5)}
                          </div>
                          {signal.status === 'Investigating' && (
                            <div className="flex items-center gap-1 text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                               <Eye className="h-3 w-3" /> Reviewing
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="px-3 py-1.5 bg-white border border-slate-200 text-[11px] font-medium rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
                             Dismiss
                           </button>
                           <button className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-lg hover:bg-slate-800 shadow-sm flex items-center gap-1 transition-all">
                             Investigate <ArrowRight className="h-3 w-3" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar: Risk Heatmap */}
          <div className="w-72 shrink-0 flex flex-col gap-6">
            
            {/* Heatmap Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="font-semibold text-[13px] text-slate-900">Risk Matrix</h3>
                 <button className="text-[11px] font-medium text-blue-600 hover:text-blue-700">Detail</button>
               </div>
               
               <div className="aspect-square bg-slate-50 rounded-xl border border-slate-100 p-4 relative">
                  {/* Grid Labels */}
                  <div className="absolute left-1 bottom-8 -rotate-90 text-[9px] font-bold text-slate-400 uppercase tracking-wider origin-left">Likelihood</div>
                  <div className="absolute bottom-1 left-8 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Impact</div>

                  {/* Heatmap Grid */}
                  <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full w-full pl-4 pb-4">
                     <div className="bg-orange-50 rounded-lg flex flex-col items-center justify-center relative hover:bg-orange-100 transition-colors cursor-pointer border border-orange-100/50">
                        <span className="text-xl font-bold text-orange-600">3</span>
                        <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wide">Warning</span>
                     </div>
                     
                     <div className="bg-red-50 rounded-lg flex flex-col items-center justify-center relative hover:bg-red-100 transition-colors cursor-pointer border border-red-100/50">
                        <span className="text-xl font-bold text-red-600">5</span>
                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-wide">Critical</span>
                     </div>
                     
                     <div className="bg-white rounded-lg flex flex-col items-center justify-center relative hover:bg-slate-50 transition-colors cursor-pointer border border-slate-100">
                        <span className="text-xl font-bold text-slate-400">12</span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wide">Monitor</span>
                     </div>

                     <div className="bg-amber-50 rounded-lg flex flex-col items-center justify-center relative hover:bg-amber-100 transition-colors cursor-pointer border border-amber-100/50">
                        <span className="text-xl font-bold text-amber-600">4</span>
                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wide">Elevated</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-100/50 rounded-2xl p-5 border border-slate-200/50">
               <h3 className="font-semibold text-[13px] text-slate-900 mb-3">Quick Actions</h3>
               <div className="space-y-2">
                 <button className="w-full text-left px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm text-[11px] font-medium transition-all flex items-center justify-between group text-slate-600 hover:text-blue-600">
                   <span>Export Signal Report</span>
                   <ArrowUpRight className="h-3 w-3 text-slate-400 group-hover:text-blue-500" />
                 </button>
                 <button className="w-full text-left px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm text-[11px] font-medium transition-all flex items-center justify-between group text-slate-600 hover:text-blue-600">
                   <span>Trigger Data Refresh</span>
                   <Zap className="h-3 w-3 text-slate-400 group-hover:text-blue-500" />
                 </button>
               </div>
            </div>

          </div>

        </div>
      </div>
    </AppShell>
  );
}
