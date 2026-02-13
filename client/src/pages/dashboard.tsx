import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CardSkeleton, TableSkeleton } from "@/components/ui/skeleton-loader";
import { 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const metrics = [
  { 
    label: "Total Active Signals", 
    value: "24", 
    subtext: "5 Critical (P1)", 
    breakdown: { p1: 5, p2: 12, p3: 7 },
    status: "critical" // red accent
  },
  { 
    label: "Sites Requiring Attention", 
    value: "3", 
    subtext: "Sites with P1 Signals", 
    status: "warning" // amber accent
  },
  { 
    label: "Safety Signals Pending", 
    value: "8", 
    subtext: "Mandatory Review", 
    status: "critical" // red accent
  },
  { 
    label: "Data Currency", 
    value: "15 min ago", 
    subtext: "Last Export", 
    status: "good" // green/neutral
  },
];

const sites = [
  { id: "102", name: "Memorial Sloan Kettering", signals: 8, p1: 2, p2: 4, trend: [2, 4, 5, 8], status: "critical" },
  { id: "109", name: "Charité Berlin", signals: 5, p1: 1, p2: 2, trend: [1, 2, 3, 5], status: "critical" },
  { id: "402", name: "Mass General", signals: 4, p1: 1, p2: 1, trend: [2, 2, 3, 4], status: "critical" },
  { id: "331", name: "University of Tokyo", signals: 3, p1: 0, p2: 2, trend: [4, 3, 3, 3], status: "warning" },
  { id: "205", name: "Gustave Roussy", signals: 2, p1: 0, p2: 1, trend: [1, 1, 2, 2], status: "warning" },
  { id: "512", name: "MD Anderson", signals: 1, p1: 0, p2: 0, trend: [0, 1, 1, 1], status: "good" },
  { id: "115", name: "Mayo Clinic", signals: 1, p1: 0, p2: 0, trend: [2, 1, 0, 1], status: "good" },
  { id: "601", name: "Seoul National", signals: 0, p1: 0, p2: 0, trend: [0, 0, 0, 0], status: "good" },
];

function Sparkline({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data, 5); // Minimum scale of 5
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Simulate loading
  setTimeout(() => setLoading(false), 2000);

  return (
    <AppShell>
      <div className="space-y-8 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Signal Dashboard</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Operational view of all active signals across sites. Prioritized by urgency and impact on Critical Data Elements.
          </p>
        </div>

        {/* Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            metrics.map((metric, i) => (
              <div key={i} className="group p-5 rounded-xl border border-border/60 bg-card shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden">
                <div className={cn("absolute top-0 left-0 w-1 h-full", 
                  metric.status === 'critical' ? 'bg-red-500' : 
                  metric.status === 'warning' ? 'bg-amber-500' : 
                  'bg-emerald-500'
                )} />
                <div className="pl-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{metric.label}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-tighter text-foreground">{metric.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">{metric.subtext}</div>
                  
                  {metric.breakdown && (
                    <div className="flex gap-1 mt-3">
                      <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${(metric.breakdown.p1 / 24) * 100}%` }} />
                      <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${(metric.breakdown.p2 / 24) * 100}%` }} />
                      <div className="h-1.5 rounded-full bg-slate-300" style={{ width: `${(metric.breakdown.p3 / 24) * 100}%` }} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Signal Map (Site Grid) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Site Signal Map</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-2">Sort by: Urgency</span>
              <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {Array(8).fill(0).map((_, i) => <div key={i} className="h-32 bg-secondary/30 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sites.map((site) => (
                <div key={site.id} className={cn(
                  "p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md relative overflow-hidden",
                  site.status === 'critical' ? "bg-red-50/10 border-red-100 hover:border-red-200" :
                  site.status === 'warning' ? "bg-amber-50/10 border-amber-100 hover:border-amber-200" :
                  "bg-card border-border/60 hover:border-border"
                )}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-2xl font-semibold text-foreground">{site.id}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[120px]">{site.name}</div>
                    </div>
                    {site.p1 > 0 ? (
                      <div className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold border border-red-200 shadow-sm">
                        P1 Signal
                      </div>
                    ) : (
                      <div className="px-2 py-1 rounded bg-secondary text-muted-foreground text-xs font-medium border border-border/50">
                        {site.signals} Signals
                      </div>
                    )}
                  </div>
                  
                  {/* Sparkline Area */}
                  <div className="mt-4">
                    <Sparkline 
                      data={site.trend} 
                      color={
                        site.status === 'critical' ? 'text-red-500' : 
                        site.status === 'warning' ? 'text-amber-500' : 
                        'text-emerald-500'
                      } 
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>4 weeks ago</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}