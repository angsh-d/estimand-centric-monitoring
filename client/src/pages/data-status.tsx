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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  },
  {
    id: "IRT-pci",
    name: "Almac IRT",
    type: "Randomization",
    lastSync: "10 min ago",
    status: "healthy",
    records: "315",
    latency: "320ms"
  }
];

const validationJobs = [
  {
    id: "JOB-9921",
    name: "Daily Reconciliation",
    time: "Today, 04:00 AM",
    status: "Completed",
    issues: 0
  },
  {
    id: "JOB-9920",
    name: "Critical Data Integrity",
    time: "Today, 02:00 AM",
    status: "Completed",
    issues: 5
  },
  {
    id: "JOB-9919",
    name: "Lab Range Validation",
    time: "Yesterday, 11:00 PM",
    status: "Failed",
    issues: 12
  }
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
                Ingestion pipeline monitoring, source system health, and validation job history.
              </p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-white hover:bg-secondary/50 text-sm font-medium transition-colors shadow-sm">
              <RefreshCw className="h-3 w-3" />
              Refresh Now
            </button>
          </div>
        </div>

        {/* System Health Grid */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            Source System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-card border border-border/60 rounded-xl p-5 space-y-3">
                   <div className="flex justify-between">
                     <Skeleton height={20} width="40%" />
                     <Skeleton height={20} width="20%" />
                   </div>
                   <Skeleton height={16} width="60%" />
                   <div className="pt-2 flex gap-4">
                     <Skeleton height={40} width="100%" />
                   </div>
                </div>
              ))
            ) : (
              dataSources.map((source) => (
                <div key={source.id} className="bg-card border border-border/60 rounded-xl p-5 hover:shadow-sm transition-all relative overflow-hidden">
                   {source.status === 'warning' && (
                     <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                   )}
                   {source.status === 'healthy' && (
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

                   <div className="grid grid-cols-3 gap-2 pl-2 mt-4 pt-4 border-t border-border/40">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Records</div>
                        <div className="text-sm font-medium">{source.records}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Latency</div>
                        <div className="text-sm font-medium">{source.latency}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Last Sync</div>
                        <div className="text-sm font-medium flex items-center justify-end gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {source.lastSync}
                        </div>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Validation Jobs */}
        <section className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
           <div className="p-4 border-b border-border/60 bg-secondary/10 flex justify-between items-center">
             <h2 className="font-medium text-sm flex items-center gap-2">
               <ShieldCheck className="h-4 w-4 text-muted-foreground" />
               Validation & Reconciliation Jobs
             </h2>
             <button className="text-xs text-primary hover:underline">View Logs</button>
           </div>
           
           <div className="divide-y divide-border/40">
             {loading ? (
                <div className="p-4 space-y-4">
                  <Skeleton height={24} width="100%" />
                  <Skeleton height={24} width="100%" />
                  <Skeleton height={24} width="100%" />
                </div>
             ) : (
                validationJobs.map((job) => (
                  <div key={job.id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className={cn("h-8 w-8 rounded-full flex items-center justify-center border",
                         job.status === 'Completed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                         "bg-red-50 border-red-100 text-red-600"
                       )}>
                         {job.status === 'Completed' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                       </div>
                       <div>
                         <div className="text-sm font-medium text-foreground">{job.name}</div>
                         <div className="text-xs text-muted-foreground">{job.id} • {job.time}</div>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-6">
                       <div className="text-right">
                          <div className="text-xs text-muted-foreground">Issues Found</div>
                          <div className={cn("text-sm font-semibold", job.issues > 0 ? "text-amber-600" : "text-muted-foreground")}>
                            {job.issues}
                          </div>
                       </div>
                       <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
