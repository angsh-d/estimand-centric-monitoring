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
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const metrics = [
  { 
    label: "Critical Signals", 
    value: "5", 
    subtext: "Requires immediate action", 
    status: "critical",
    icon: AlertCircle
  },
  { 
    label: "Total Open Signals", 
    value: "24", 
    subtext: "+3 since yesterday", 
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
    subtext: "Resolution time: 1.2d", 
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
    impact_score: 85,
    status: "New",
    created: "2h ago",
    category: "Reconciliation",
    estimand: "PFS Analysis (Data Integrity)"
  },
  {
    id: "SIG-2026-039",
    type: "Safety",
    title: "Potential SAE Under-reporting",
    description: "AE 'Grade 3 Neutropenia' recorded in Lab Data but missing from AE Log for Subject 402-011.",
    site: "402 - Mass General",
    priority: "Critical",
    impact_score: 92,
    status: "Investigating",
    created: "5h ago",
    category: "Safety",
    estimand: "Safety Population Analysis"
  },
  {
    id: "SIG-2026-035",
    type: "Protocol",
    title: "Visit Window Deviation Trend",
    description: "3 consecutive subjects at Site 331 missed the Visit 6 window by >3 days.",
    site: "331 - Univ. of Tokyo",
    priority: "Medium",
    impact_score: 60,
    status: "Open",
    created: "1d ago",
    category: "Compliance",
    estimand: "Per-Protocol Population"
  },
  {
    id: "SIG-2026-031",
    type: "Data Quality",
    title: "Duplicate Lab Records",
    description: "Multiple hematology panels received with identical timestamps for Subject 205-003.",
    site: "205 - Gustave Roussy",
    priority: "Low",
    impact_score: 35,
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
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Signal Dashboard</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Real-time monitoring of data quality, safety, and protocol compliance signals across all active sites.
          </p>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {loading ? (
            Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            metrics.map((metric, i) => (
              <div key={i} className="p-5 rounded-xl border border-border/60 bg-card shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className={cn(
                    "p-2 rounded-lg",
                    metric.status === 'critical' ? 'bg-red-50 text-red-600' : 
                    metric.status === 'warning' ? 'bg-amber-50 text-amber-600' : 
                    'bg-emerald-50 text-emerald-600'
                  )}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                  {metric.status === 'critical' && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-3xl font-semibold tracking-tighter text-foreground mb-1">{metric.value}</div>
                  <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
                  <div className="text-xs text-muted-foreground/70 mt-1">{metric.subtext}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Priority Heatmap & Signal List Container */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          
          {/* Main Signal Feed */}
          <div className="flex-1 flex flex-col bg-transparent overflow-hidden">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search signals..." 
                    className="h-9 w-64 rounded-lg border border-border/60 bg-white pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center bg-white border border-border/60 rounded-lg p-1">
                  {['All', 'High', 'Critical', 'New'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-medium transition-all",
                        filter === f ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 bg-white text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Filter className="h-3 w-3" />
                Filter View
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {loading ? (
                 Array(3).fill(0).map((_, i) => (
                   <div key={i} className="h-32 bg-secondary/20 rounded-xl animate-pulse" />
                 ))
              ) : (
                signals.map((signal, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={signal.id}
                    className="group bg-white border border-border/60 rounded-xl p-5 hover:shadow-md hover:border-border transition-all relative overflow-hidden cursor-pointer"
                  >
                    <div className={cn("absolute left-0 top-0 bottom-0 w-1 transition-colors", 
                      signal.priority === 'Critical' ? "bg-red-500" :
                      signal.priority === 'High' ? "bg-orange-500" :
                      signal.priority === 'Medium' ? "bg-amber-400" :
                      "bg-blue-400"
                    )} />
                    
                    <div className="flex justify-between items-start mb-2 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{signal.id}</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                          {signal.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {signal.created}
                        </span>
                        <button className="text-muted-foreground hover:text-foreground p-1 hover:bg-secondary rounded">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pl-2 pr-12 relative">
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {signal.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {signal.description}
                      </p>
                      
                      {/* Estimand Impact Tag */}
                      <div className="mb-4 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/40 border border-border/50 text-xs text-muted-foreground">
                        <Target className="h-3 w-3 text-foreground" />
                        Impacts: <span className="font-medium text-foreground">{signal.estimand}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded">
                             <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                             {signal.site}
                          </div>
                          {signal.status === 'Investigating' && (
                            <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                               <Eye className="h-3 w-3" /> Under Review
                            </div>
                          )}
                        </div>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 absolute right-0 bottom-0">
                           <button className="px-3 py-1.5 bg-white border border-border text-xs font-medium rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground shadow-sm">
                             Dismiss
                           </button>
                           <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 shadow-sm flex items-center gap-1">
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
          <div className="w-80 shrink-0 flex flex-col gap-6">
            
            {/* Heatmap Card */}
            <div className="bg-white border border-border/60 rounded-xl p-5 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="font-semibold text-sm">Risk Heatmap</h3>
                 <button className="text-xs text-muted-foreground hover:text-foreground">View Full</button>
               </div>
               
               <div className="aspect-square bg-secondary/10 rounded-lg border border-border/40 p-4 relative">
                  {/* Grid Labels */}
                  <div className="absolute left-1 bottom-8 -rotate-90 text-[10px] text-muted-foreground origin-left font-medium">Likelihood</div>
                  <div className="absolute bottom-1 left-8 text-[10px] text-muted-foreground font-medium">Impact</div>

                  {/* Heatmap Grid */}
                  <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full w-full pl-4 pb-4">
                     {/* Q2: High Impact, Low Likelihood */}
                     <div className="bg-orange-100 rounded flex flex-col items-center justify-center relative hover:bg-orange-200 transition-colors cursor-pointer group">
                        <span className="text-2xl font-bold text-orange-600">3</span>
                        <span className="text-[10px] text-orange-700/70 font-medium">Warning</span>
                     </div>
                     
                     {/* Q1: High Impact, High Likelihood */}
                     <div className="bg-red-100 rounded flex flex-col items-center justify-center relative hover:bg-red-200 transition-colors cursor-pointer group">
                        <span className="text-2xl font-bold text-red-600">5</span>
                        <span className="text-[10px] text-red-700/70 font-medium">Critical</span>
                     </div>
                     
                     {/* Q3: Low Impact, Low Likelihood */}
                     <div className="bg-slate-100 rounded flex flex-col items-center justify-center relative hover:bg-slate-200 transition-colors cursor-pointer group">
                        <span className="text-2xl font-bold text-slate-600">12</span>
                        <span className="text-[10px] text-slate-500 font-medium">Monitor</span>
                     </div>

                     {/* Q4: Low Impact, High Likelihood */}
                     <div className="bg-amber-50 rounded flex flex-col items-center justify-center relative hover:bg-amber-100 transition-colors cursor-pointer group">
                        <span className="text-2xl font-bold text-amber-600">4</span>
                        <span className="text-[10px] text-amber-700/70 font-medium">Elevated</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-secondary/20 rounded-xl p-5 border border-border/40">
               <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
               <div className="space-y-2">
                 <button className="w-full text-left px-3 py-2 rounded-lg bg-white border border-border/60 hover:border-primary/50 text-xs font-medium transition-colors shadow-sm flex items-center justify-between group">
                   <span>Export Signal Report</span>
                   <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                 </button>
                 <button className="w-full text-left px-3 py-2 rounded-lg bg-white border border-border/60 hover:border-primary/50 text-xs font-medium transition-colors shadow-sm flex items-center justify-between group">
                   <span>Trigger Data Refresh</span>
                   <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                 </button>
               </div>
            </div>

          </div>

        </div>
      </div>
    </AppShell>
  );
}
