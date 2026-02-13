import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton-loader";
import { useState } from "react";
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Server,
  FileJson,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Workflow,
  Cpu,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const dataSources = [
  {
    id: "EDC-rave",
    name: "Medidata Rave EDC",
    type: "Clinical Data",
    lastSync: "15 min ago",
    status: "healthy",
    records: "14,205",
    latency: "450ms"
  },
  {
    id: "SFT-argus",
    name: "Oracle Argus Safety",
    type: "Safety Database",
    lastSync: "1 hour ago",
    status: "healthy",
    records: "852",
    latency: "1.2s"
  },
  {
    id: "LAB-central",
    name: "Central Lab (Q2)",
    type: "Lab Data",
    lastSync: "4 hours ago",
    status: "warning",
    message: "Schema mismatch in latest batch",
    records: "45,102",
    latency: "890ms"
  }
];

const pipelineSteps = [
  { id: 1, label: "Ingestion", status: "completed", count: "100%", icon: Database },
  { id: 2, label: "Standardization", status: "processing", count: "98%", icon: Layers },
  { id: 3, label: "Reconciliation", status: "pending", count: "45%", icon: Workflow },
  { id: 4, label: "Analytics Ready", status: "pending", count: "0%", icon: Cpu },
];

export default function DataStatus() {
  const [loading, setLoading] = useState(true);

  // Simulate loading
  setTimeout(() => setLoading(false), 1500);

  return (
    <AppShell>
      <div className="space-y-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
                Data Status
              </h1>
              <p className="text-muted-foreground text-sm max-w-2xl mt-1">
                End-to-end data pipeline monitoring, from source ingestion to analytics readiness.
              </p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-white hover:bg-secondary/50 text-sm font-medium transition-colors shadow-sm">
              <RefreshCw className="h-3 w-3" />
              Refresh Now
            </button>
          </div>
        </div>

        {/* Pipeline Visualization */}
        <section className="bg-card border border-border/60 rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50" />
          <h2 className="text-lg font-medium mb-8 flex items-center gap-2">
            <Workflow className="h-5 w-5 text-muted-foreground" />
            Current Batch Processing
          </h2>
          
          <div className="flex items-center justify-between relative px-4">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border/60 -z-10" />
            
            {pipelineSteps.map((step, i) => (
              <div key={step.id} className="flex flex-col items-center gap-3 bg-card px-4 relative z-10">
                 <div className={cn(
                   "h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all shadow-sm",
                   step.status === 'completed' ? "bg-emerald-50 border-emerald-500 text-emerald-600" :
                   step.status === 'processing' ? "bg-blue-50 border-blue-500 text-blue-600 animate-pulse" :
                   "bg-secondary border-border text-muted-foreground"
                 )}>
                   <step.icon className="h-5 w-5" />
                 </div>
                 <div className="text-center">
                   <div className="text-sm font-medium text-foreground">{step.label}</div>
                   <div className="text-xs text-muted-foreground">{step.count}</div>
                 </div>
                 
                 {/* Status Indicator */}
                 <div className={cn(
                   "absolute -top-1 -right-1 h-3 w-3 rounded-full border border-white",
                   step.status === 'completed' ? "bg-emerald-500" :
                   step.status === 'processing' ? "bg-blue-500" :
                   "bg-gray-300"
                 )} />
              </div>
            ))}
          </div>
        </section>

        {/* Source System Health Grid */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            Source System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-card border border-border/60 rounded-xl p-5 h-40 animate-pulse bg-secondary/20" />
              ))
            ) : (
              dataSources.map((source) => (
                <div key={source.id} className="bg-card border border-border/60 rounded-xl p-5 hover:shadow-sm transition-all relative overflow-hidden group">
                   {source.status === 'warning' ? (
                     <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                   ) : (
                     <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                   )}
                   
                   <div className="flex justify-between items-start mb-2 pl-2">
                     <div>
                       <h3 className="font-semibold text-foreground">{source.name}</h3>
                       <p className="text-xs text-muted-foreground">{source.type}</p>
                     </div>
                     <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium uppercase border", 
                       source.status === 'healthy' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                       "bg-amber-50 text-amber-700 border-amber-100"
                     )}>
                       {source.status}
                     </div>
                   </div>

                   {source.message && (
                     <div className="mb-4 pl-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 flex items-center gap-2">
                       <AlertCircle className="h-3 w-3" />
                       {source.message}
                     </div>
                   )}

                   <div className="grid grid-cols-2 gap-4 pl-2 mt-4 pt-4 border-t border-border/40">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Records</div>
                        <div className="text-sm font-medium">{source.records}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Last Sync</div>
                        <div className="text-sm font-medium">{source.lastSync}</div>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </AppShell>
  );
}
