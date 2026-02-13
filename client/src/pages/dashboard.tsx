import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CardSkeleton, TableSkeleton } from "@/components/ui/skeleton-loader";
import { 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  MoreHorizontal 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const stats = [
  { label: "Active Signals", value: "24", change: "+4", trend: "up" },
  { label: "Critical Data Elements", value: "158", change: "0", trend: "neutral" },
  { label: "Sites with Issues", value: "12", change: "-2", trend: "down" },
  { label: "Pending Reviews", value: "8", change: "+1", trend: "up" },
];

const signals = [
  {
    id: "SIG-2025-089",
    severity: "critical",
    type: "Missing Assessment",
    description: "Primary Endpoint (PFS) assessment missing for Subject 102-004 at Visit 6",
    site: "102 - Memorial Sloan Kettering",
    age: "2 days",
    status: "Open"
  },
  {
    id: "SIG-2025-092",
    severity: "high",
    type: "Cross-System Discrepancy",
    description: "Concomitant medication dates in EDC do not match Safety Database narrative",
    site: "109 - Charité Berlin",
    age: "4 hours",
    status: "Investigating"
  },
  {
    id: "SIG-2025-085",
    severity: "medium",
    type: "Protocol Deviation",
    description: "Lab kit processed outside temperature excursion window",
    site: "402 - Mass General",
    age: "5 days",
    status: "Pending Action"
  },
  {
    id: "SIG-2025-094",
    severity: "low",
    type: "Data Quality",
    description: "Unusual vital sign entry pattern detected across multiple subjects",
    site: "331 - University of Tokyo",
    age: "1 week",
    status: "Open"
  }
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Simulate loading
  setTimeout(() => setLoading(false), 2000);

  return (
    <AppShell>
      <div className="space-y-8 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Proactive Signal Detection</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Monitoring intelligence across heterogeneous data sources. Focused on Critical Data Elements per protocol ONC-2025-001.
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            stats.map((stat, i) => (
              <div key={i} className="group p-5 rounded-xl border border-border/60 bg-card shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                  {stat.trend === "up" && <ArrowUpRight className="h-4 w-4 text-orange-500/70" />}
                  {stat.trend === "down" && <CheckCircle2 className="h-4 w-4 text-emerald-500/70" />}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tighter text-foreground">{stat.value}</span>
                  <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-full", 
                    stat.trend === "up" ? "bg-orange-50 text-orange-600" : 
                    stat.trend === "down" ? "bg-emerald-50 text-emerald-600" : 
                    "bg-gray-100 text-gray-600"
                  )}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Main Signal Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Detected Signals</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-xs font-medium text-muted-foreground hover:text-foreground hover:border-gray-300 transition-colors shadow-sm">
                <Filter className="h-3 w-3" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-xs font-medium text-muted-foreground hover:text-foreground hover:border-gray-300 transition-colors shadow-sm">
                Last 24 Hours
              </button>
            </div>
          </div>

          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/30 border-b border-border/60">
                  <tr>
                    <th className="px-6 py-3 font-medium text-muted-foreground w-12"></th>
                    <th className="px-6 py-3 font-medium text-muted-foreground">Type</th>
                    <th className="px-6 py-3 font-medium text-muted-foreground">Description</th>
                    <th className="px-6 py-3 font-medium text-muted-foreground">Site</th>
                    <th className="px-6 py-3 font-medium text-muted-foreground">Age</th>
                    <th className="px-6 py-3 font-medium text-muted-foreground text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {signals.map((signal) => (
                    <tr key={signal.id} className="group hover:bg-secondary/30 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className={cn("h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-sm", 
                          signal.severity === 'critical' ? 'bg-red-500' :
                          signal.severity === 'high' ? 'bg-orange-500' :
                          signal.severity === 'medium' ? 'bg-amber-400' :
                          'bg-slate-300'
                        )} />
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{signal.type}</td>
                      <td className="px-6 py-4 text-muted-foreground max-w-md truncate">{signal.description}</td>
                      <td className="px-6 py-4 text-muted-foreground">{signal.site}</td>
                      <td className="px-6 py-4 text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3 w-3 opacity-50" />
                        {signal.age}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                           signal.status === 'Open' ? "bg-red-50 text-red-700 border border-red-100" :
                           signal.status === 'Investigating' ? "bg-blue-50 text-blue-700 border border-blue-100" :
                           "bg-gray-100 text-gray-700 border border-gray-200"
                         )}>
                           {signal.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-secondary/10 px-6 py-3 border-t border-border/60 flex justify-center">
                 <button className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors">
                   View All Signals
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
