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
  ArrowRight,
  FileText,
  ShieldCheck,
  Binary,
  BrainCircuit,
  MessagesSquare,
  ScrollText,
  Image as ImageIcon,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const structuredSources = [
  {
    id: "EDC",
    name: "EDC",
    description: "Medidata Rave",
    status: "healthy",
    records: "14,205",
    latency: "450ms"
  },
  {
    id: "IRT",
    name: "IRT",
    description: "Randomization & Supply",
    status: "healthy",
    records: "3,102",
    latency: "120ms"
  },
  {
    id: "LAB",
    name: "Central Lab",
    description: "Q2 Solutions",
    status: "warning",
    message: "Schema mismatch",
    records: "45,102",
    latency: "890ms"
  },
  {
    id: "SFT",
    name: "Safety DB",
    description: "Oracle Argus",
    status: "healthy",
    records: "852",
    latency: "1.2s"
  },
  {
    id: "CTMS",
    name: "CTMS",
    description: "Veeva Vault",
    status: "healthy",
    records: "1,204",
    latency: "200ms"
  },
  {
    id: "IMG",
    name: "Imaging",
    description: "BioClinica",
    status: "healthy",
    records: "4,500",
    latency: "1.5s"
  }
];

const unstructuredSources = [
  { name: "Monitoring reports", icon: FileText, count: "142 docs" },
  { name: "Imaging narratives", icon: ImageIcon, count: "850 docs" },
  { name: "Site correspondence", icon: MessagesSquare, count: "2,400 emails" },
  { name: "Clinical notes", icon: Activity, count: "12,050 notes" },
  { name: "Deviation logs", icon: ScrollText, count: "156 logs" }
];

const pipelineSteps = [
  { id: 1, label: "Ingestion", status: "completed", count: "100%", icon: Database },
  { id: 2, label: "Standardization", status: "processing", count: "98%", icon: Layers },
  { id: 3, label: "Identity Resolution", status: "pending", count: "45%", icon: Workflow },
  { id: 4, label: "Reasoning Engine", status: "pending", count: "0%", icon: BrainCircuit },
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
              No data warehouse required. Connected through identity resolution.
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
          Processing Pipeline
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Structured Data Column */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-[13px] font-semibold text-slate-900 flex items-center gap-2">
              <Binary className="h-4 w-4 text-slate-400" />
              STRUCTURED
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">Deterministic, auditable code</span>
          </div>
         
          <div className="grid grid-cols-2 gap-3">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 h-32 animate-pulse" />
              ))
            ) : (
              structuredSources.map((source) => (
                <div key={source.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all relative overflow-hidden group cursor-default">
                   <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
                     source.status === 'warning' ? "bg-amber-500" : "bg-emerald-500"
                   )} />
                   
                   <div className="flex justify-between items-start mb-2 pl-2">
                     <div>
                       <h3 className="text-[13px] font-semibold text-slate-900">{source.name}</h3>
                       <p className="text-[10px] text-slate-500 font-medium truncate">{source.description}</p>
                     </div>
                     <div className={cn("h-1.5 w-1.5 rounded-full ring-2 ring-opacity-20", 
                       source.status === 'healthy' ? "bg-emerald-500 ring-emerald-500" : "bg-amber-500 ring-amber-500"
                     )} />
                   </div>

                   {source.message && (
                     <div className="mb-2 ml-2 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 inline-flex items-center gap-1">
                       <AlertCircle className="h-2.5 w-2.5" />
                       {source.message}
                     </div>
                   )}

                   <div className="flex items-end justify-between ml-2 mt-3 pt-3 border-t border-slate-50">
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Latency</div>
                        <div className="text-[11px] font-medium text-slate-700">{source.latency}</div>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500">
                   <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                   <h3 className="text-[12px] font-semibold text-slate-900">Audit Trail Data (all systems)</h3>
                   <p className="text-[10px] text-slate-500">Change history • Edit patterns • 21 CFR Part 11</p>
                </div>
             </div>
             <div className="h-2 w-2 bg-emerald-500 rounded-full" />
          </div>
        </section>

        {/* Unstructured Data Column */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
             <h2 className="text-[13px] font-semibold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-slate-400" />
              UNSTRUCTURED
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">LLM reasoning with evidence-cited outputs</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-1">
             {unstructuredSources.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-default">
                   <div className="h-10 w-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-100 group-hover:border-blue-100">
                      <item.icon className="h-5 w-5 stroke-[1.5]" />
                   </div>
                   <div className="flex-1">
                      <h3 className="text-[13px] font-medium text-slate-900">{item.name}</h3>
                      <p className="text-[11px] text-slate-400">Ingested via Vector Store</p>
                   </div>
                   <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      {item.count}
                   </div>
                </div>
             ))}
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
             <h3 className="text-[12px] font-semibold text-indigo-900 mb-2">Why this matters</h3>
             <p className="text-[11px] text-indigo-700/80 leading-relaxed">
                By combining structured clinical data with unstructured narratives, we can detect complex discrepancies like the "ConMed Date Mismatch" (SIG-2026-042) without manual cross-checking.
             </p>
          </div>
        </section>
      </div>

    </div>
  );
}
