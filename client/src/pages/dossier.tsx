import { AppShell } from "@/components/layout/app-shell";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Download, 
  Share2, 
  Printer, 
  AlertTriangle, 
  CheckCircle, 
  MapPin,
  Mail,
  Clock,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

export default function Dossier() {
  const [loading, setLoading] = useState(true);
  
  // Simulate loading
  setTimeout(() => setLoading(false), 2000);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      
      {/* Site Header Profile */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shrink-0 shadow-sm flex items-start justify-between">
        <div className="flex gap-6">
           <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-slate-200">
             109
           </div>
           <div>
             <div className="flex items-center gap-3 mb-1">
               <h1 className="text-xl font-bold tracking-tight text-slate-900">Charité Berlin</h1>
               <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                 High Risk
               </span>
             </div>
             <div className="flex items-center gap-4 text-[13px] text-slate-500 font-medium">
               <div className="flex items-center gap-1.5">
                 <MapPin className="h-3.5 w-3.5 text-slate-400" /> Berlin, Germany
               </div>
               <div className="h-1 w-1 rounded-full bg-slate-300" />
               <div className="flex items-center gap-1.5">
                 <span className="text-slate-900">PI: Dr. Klaus Webber</span>
               </div>
               <div className="h-1 w-1 rounded-full bg-slate-300" />
               <div className="flex items-center gap-1.5">
                 <Clock className="h-3.5 w-3.5 text-slate-400" /> 14:30 PM (Local)
               </div>
             </div>
           </div>
        </div>

        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-medium transition-colors shadow-sm text-slate-700">
             <Mail className="h-3.5 w-3.5" />
             Contact
           </button>
           <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-[11px] font-medium transition-colors shadow-sm">
             <Download className="h-3.5 w-3.5" />
             Download
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden gap-6">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
           
           {/* Executive Summary Card */}
           <section className="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm group">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
             <h2 className="text-[13px] font-semibold mb-3 text-slate-900 uppercase tracking-wide">Intelligence Summary</h2>
             <p className="text-[13px] text-slate-600 leading-relaxed">
               Site 109 shows emerging risk patterns in <strong className="text-slate-900 font-medium">Concomitant Medication reporting</strong> and <strong className="text-slate-900 font-medium">RECIST 1.1 assessment windows</strong>. Cross-system validation between EDC and Safety narratives indicates 3 high-confidence discrepancies. While enrollment is on track (12/15 subjects), data entry latency has increased by 15% since the last monitoring visit.
             </p>
           </section>

           <div className="space-y-6">
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">Key Risk Indicators</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <KRICard label="Data Entry Lag" value="4.2 Days" trend="up" status="warning" />
                  <KRICard label="Query Response" value="24 Hours" trend="flat" status="good" />
                  <KRICard label="AE Reporting" value="100%" trend="flat" status="good" />
                  <KRICard label="Protocol Deviations" value="8.5%" trend="up" status="critical" />
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">Open Signals</h3>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  {[
                    { title: "ConMed Date Mismatch", id: "SIG-004", severity: "High", due: "2 days" },
                    { title: "Missed Tumor Assessment", id: "SIG-002", severity: "Medium", due: "5 days" },
                    { title: "Informed Consent Version", id: "SIG-009", severity: "Low", due: "7 days" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-3">
                         <div className={cn("h-1.5 w-1.5 rounded-full ring-2 ring-opacity-20", 
                           item.severity === "High" ? "bg-red-500 ring-red-500" :
                           item.severity === "Medium" ? "bg-amber-500 ring-amber-500" : "bg-blue-500 ring-blue-500"
                         )} />
                         <div>
                           <div className="text-[13px] font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</div>
                           <div className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {item.id}</div>
                         </div>
                       </div>
                       <div className="flex items-center gap-4">
                         <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">Due in {item.due}</span>
                         <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                       </div>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>

        {/* Side Stats */}
        <div className="w-80 space-y-6 shrink-0">
           <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Enrollment Funnel</h3>
              <div className="space-y-5">
                 <FunnelStage label="Screened" value={18} total={20} color="bg-blue-500" />
                 <FunnelStage label="Randomized" value={12} total={18} color="bg-indigo-500" />
                 <FunnelStage label="Active" value={11} total={12} color="bg-emerald-500" />
                 <FunnelStage label="Completed" value={1} total={12} color="bg-slate-500" />
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Site Team</h3>
              <div className="space-y-1">
                 <TeamMember name="Dr. Klaus Webber" role="Principal Investigator" />
                 <TeamMember name="Sarah Miller" role="Study Coordinator" />
                 <TeamMember name="James Chen" role="Pharmacist" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function UserAvatar({ name }: { name: string }) {
  return (
    <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold border border-slate-200">
      {name.split(' ').map(n => n[0]).join('')}
    </div>
  );
}

function KRICard({ label, value, trend, status }: { label: string, value: string, trend: string, status: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-default group">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-xl font-semibold text-slate-900 tracking-tight">{value}</div>
        <div className={cn("text-[10px] font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded", 
          status === "critical" ? "bg-red-50 text-red-600" :
          status === "warning" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
        )}>
          {trend === "up" ? <TrendingUp className="h-3 w-3" /> : trend === "down" ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          {status === "critical" ? "Critical" : status === "warning" ? "Warning" : "Good"}
        </div>
      </div>
    </div>
  );
}

function FunnelStage({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
  const width = (value / 20) * 100; // Normalized to max screening
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1.5 font-medium">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function TeamMember({ name, role }: { name: string, role: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
      <UserAvatar name={name} />
      <div className="overflow-hidden">
        <div className="text-[13px] font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">{name}</div>
        <div className="text-[10px] text-slate-400 truncate font-medium">{role}</div>
      </div>
    </div>
  );
}
