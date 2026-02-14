import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton-loader";
import { useState } from "react";
import { 
  Database, 
  RefreshCw, 
  Workflow,
  Cpu,
  Layers,
  Server,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight
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
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Data Status
            </h1>
            <p className="text-slate-500 text-[13px] mt-1">
              Pipeline monitoring and source system health.
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-medium transition-colors shadow-sm text-slate-700">
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden shadow-sm">
        <h2 className="text-[13px] font-semibold text-slate-900 mb-8 flex items-center gap-2">
          <Workflow className="h-4 w-4 text-slate-400" />
          Batch Processing
        </h2>
        
        <div className="flex items-center justify-between relative px-8">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -z-10" />
          
          {pipelineSteps.map((step, i) => (
            <div key={step.id} className="flex flex-col items-center gap-3 bg-white px-4 relative z-10">
               <div className={cn(
                 "h-12 w-12 rounded-2xl flex items-center justify-center border transition-all shadow-sm",
                 step.status === 'completed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                 step.status === 'processing' ? "bg-blue-50 border-blue-100 text-blue-600 ring-4 ring-blue-50/50" :
                 "bg-slate-50 border-slate-100 text-slate-400"
               )}>
                 <step.icon className="h-5 w-5 stroke-[1.5]" />
               </div>
               <div className="text-center">
                 <div className="text-[13px] font-medium text-slate-900">{step.label}</div>
                 <div className="text-[11px] text-slate-400 font-medium">{step.count}</div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Source System Health Grid */}
      <section>
        <h2 className="text-[13px] font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Server className="h-4 w-4 text-slate-400" />
          Source Systems
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 h-40 animate-pulse" />
            ))
          ) : (
            dataSources.map((source) => (
              <div key={source.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all relative overflow-hidden group cursor-default">
                 <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
                   source.status === 'warning' ? "bg-amber-500" : "bg-emerald-500"
                 )} />
                 
                 <div className="flex justify-between items-start mb-3 pl-3">
                   <div>
                     <h3 className="text-[13px] font-semibold text-slate-900">{source.name}</h3>
                     <p className="text-[11px] text-slate-500 font-medium">{source.type}</p>
                   </div>
                   <div className={cn("h-2 w-2 rounded-full ring-4 ring-opacity-20", 
                     source.status === 'healthy' ? "bg-emerald-500 ring-emerald-500" : "bg-amber-500 ring-amber-500"
                   )} />
                 </div>

                 {source.message && (
                   <div className="mb-4 ml-3 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-1.5 rounded-lg border border-amber-100 flex items-center gap-1.5">
                     <AlertCircle className="h-3 w-3" />
                     {source.message}
                   </div>
                 )}

                 <div className="grid grid-cols-2 gap-4 ml-3 mt-4 pt-4 border-t border-slate-50">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Records</div>
                      <div className="text-[13px] font-medium text-slate-700">{source.records}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Latency</div>
                      <div className="text-[13px] font-medium text-slate-700">{source.latency}</div>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
