import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton-loader";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Download, 
  Share2, 
  Printer, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dossier() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Simulate loading
  setTimeout(() => setLoading(false), 2000);

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-140px)]">
        
        {/* Site Header Profile */}
        <div className="bg-card border-b border-border/60 p-6 shrink-0 flex items-start justify-between">
          <div className="flex gap-6">
             <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center border border-indigo-100/50 shadow-sm text-indigo-700 font-bold text-2xl">
               109
             </div>
             <div>
               <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-2xl font-bold tracking-tight text-foreground">Charité Berlin</h1>
                 <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                   <AlertTriangle className="h-3 w-3" /> Risk Level: High
                 </span>
               </div>
               <div className="flex items-center gap-4 text-sm text-muted-foreground">
                 <div className="flex items-center gap-1.5">
                   <MapPin className="h-3.5 w-3.5" /> Berlin, Germany
                 </div>
                 <div className="flex items-center gap-1.5">
                   <UserAvatar name="Dr. Webber" />
                   <span className="font-medium text-foreground">PI: Dr. Klaus Webber</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <Clock className="h-3.5 w-3.5" /> Local Time: 14:30 PM
                 </div>
               </div>
             </div>
          </div>

          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-white hover:bg-secondary/50 text-xs font-medium transition-colors shadow-sm text-foreground">
               <Mail className="h-3.5 w-3.5" />
               Contact Site
             </button>
             <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium transition-colors shadow-sm">
               <Download className="h-3.5 w-3.5" />
               Download Dossier PDF
             </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-secondary/5">
             <div className="max-w-5xl mx-auto space-y-8">
               
               {/* Executive Summary Card */}
               <section className="bg-white rounded-xl border border-border/60 shadow-sm p-6 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                 <h2 className="text-lg font-semibold mb-4 font-serif text-foreground">Executive Intelligence Summary</h2>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   Site 109 shows emerging risk patterns in <strong className="text-foreground">Concomitant Medication reporting</strong> and <strong className="text-foreground">RECIST 1.1 assessment windows</strong>. Cross-system validation between EDC and Safety narratives indicates 3 high-confidence discrepancies. While enrollment is on track (12/15 subjects), data entry latency has increased by 15% since the last monitoring visit. Immediate attention required for Subject 109-004 reconciliation.
                 </p>
               </section>

               <div className="grid grid-cols-3 gap-6">
                 {/* KRI Panel */}
                 <div className="col-span-2 space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Key Risk Indicators</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <KRICard label="Data Entry Lag" value="4.2 Days" trend="up" status="warning" />
                        <KRICard label="Query Response" value="24 Hours" trend="flat" status="good" />
                        <KRICard label="AE Reporting" value="100%" trend="flat" status="good" />
                        <KRICard label="Protocol Deviations" value="8.5%" trend="up" status="critical" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Open Signals & Action Items</h3>
                      <div className="bg-white border border-border/60 rounded-xl overflow-hidden shadow-sm">
                        {[
                          { title: "ConMed Date Mismatch", id: "SIG-004", severity: "High", due: "2 days" },
                          { title: "Missed Tumor Assessment", id: "SIG-002", severity: "Medium", due: "5 days" },
                          { title: "Informed Consent Version", id: "SIG-009", severity: "Low", due: "7 days" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer group">
                             <div className="flex items-center gap-3">
                               <div className={cn("h-2 w-2 rounded-full", 
                                 item.severity === "High" ? "bg-red-500" :
                                 item.severity === "Medium" ? "bg-amber-500" : "bg-blue-500"
                               )} />
                               <div>
                                 <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</div>
                                 <div className="text-xs text-muted-foreground">ID: {item.id}</div>
                               </div>
                             </div>
                             <div className="flex items-center gap-4">
                               <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">Due in {item.due}</span>
                               <ChevronRight className="h-4 w-4 text-muted-foreground" />
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>

                 {/* Side Stats */}
                 <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-border/60 p-5 shadow-sm">
                       <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Enrollment Funnel</h3>
                       <div className="space-y-4">
                          <FunnelStage label="Screened" value={18} total={20} color="bg-blue-100" />
                          <FunnelStage label="Randomized" value={12} total={18} color="bg-indigo-100" />
                          <FunnelStage label="Active" value={11} total={12} color="bg-emerald-100" />
                          <FunnelStage label="Completed" value={1} total={12} color="bg-slate-100" />
                       </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border/60 p-5 shadow-sm">
                       <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Site Team</h3>
                       <div className="space-y-3">
                          <TeamMember name="Dr. Klaus Webber" role="Principal Investigator" />
                          <TeamMember name="Sarah Miller" role="Study Coordinator" />
                          <TeamMember name="James Chen" role="Pharmacist" />
                       </div>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function UserAvatar({ name }: { name: string }) {
  return (
    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/20">
      {name.split(' ').map(n => n[0]).join('')}
    </div>
  );
}

function KRICard({ label, value, trend, status }: { label: string, value: string, trend: string, status: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-border/60 shadow-sm">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-xl font-semibold text-foreground">{value}</div>
        <div className={cn("text-xs font-medium flex items-center gap-0.5", 
          status === "critical" ? "text-red-600" :
          status === "warning" ? "text-amber-600" : "text-emerald-600"
        )}>
          {status === "critical" || status === "warning" ? <TrendingUp className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
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
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color.replace('100', '500'))} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function TeamMember({ name, role }: { name: string, role: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
      <UserAvatar name={name} />
      <div className="overflow-hidden">
        <div className="text-sm font-medium text-foreground truncate">{name}</div>
        <div className="text-[10px] text-muted-foreground truncate">{role}</div>
      </div>
    </div>
  );
}
