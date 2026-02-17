import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  Download, 
  ChevronRight, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Users,
  FileText,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- Mock Data ---

const SITE_METRICS = {
  dataEntryLag: { value: "4.2 Days", status: "warning", trend: "+15%" },
  queryResponse: { value: "24 Hours", status: "good", trend: "-10%" },
  aeReporting: { value: "100%", status: "good", trend: "Stable" },
  protocolDeviations: { value: "8.5%", status: "critical", trend: "+2.5%" }
};

const SITE_TEAM = [
  { name: "Dr. Klaus Webber", role: "Principal Investigator", initials: "DKW" },
  { name: "Sarah Miller", role: "Study Coordinator", initials: "SM" },
  { name: "James Chen", role: "Pharmacist", initials: "JC" }
];

const ENROLLMENT_STATS = [
  { label: "Screened", value: 18, total: 20, color: "bg-blue-500" },
  { label: "Randomized", value: 12, total: 20, color: "bg-indigo-500" },
  { label: "Active", value: 11, total: 20, color: "bg-emerald-500" },
  { label: "Completed", value: 1, total: 20, color: "bg-slate-400" }
];

const OPEN_SIGNALS = [
  {
    id: "SIG-2026-042",
    title: "ConMed Date Mismatch",
    status: "Due in 2 days",
    severity: "critical",
    category: "Data Integrity"
  },
  {
    id: "SIG-2026-045",
    title: "Incorrect Randomization Stratification",
    status: "Due in 2 days",
    severity: "critical",
    category: "Protocol Compliance"
  },
  {
    id: "SIG-002",
    title: "Missed Tumor Assessment",
    status: "Due in 5 days",
    severity: "warning",
    category: "Clinical"
  },
  {
    id: "SIG-009",
    title: "Informed Consent Version",
    status: "Due in 7 days",
    severity: "info",
    category: "Regulatory"
  }
];

export default function Investigations() {
  return (
    <div className="flex flex-col h-full bg-[#F5F5F7] font-sans text-[#1d1d1f] p-8 overflow-y-auto">
      
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.04] mb-6 flex justify-between items-start">
        <div className="flex items-start gap-6">
          <div className="h-16 w-16 bg-[#1d1d1f] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            109
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">Charité Berlin</h1>
              <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">
                High Risk
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#86868b] font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Berlin, Germany
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> PI: Dr. Klaus Webber
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> 14:30 PM (Local)
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full border-black/10 text-xs font-medium h-9">
            <Mail className="h-3.5 w-3.5 mr-2" /> Contact
          </Button>
          <Button className="rounded-full bg-[#1d1d1f] text-white hover:bg-black/80 text-xs font-medium h-9 shadow-md">
            <Download className="h-3.5 w-3.5 mr-2" /> Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column (Main Content) */}
        <div className="col-span-8 space-y-6">
          
          {/* 2. Intelligence Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/[0.04] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-red-500" />
              <h3 className="text-xs font-bold text-black/40 uppercase tracking-wider">Intelligence Summary</h3>
            </div>
            <p className="text-lg text-[#1d1d1f] leading-relaxed font-medium">
              Site 109 shows emerging risk patterns in <span className="text-red-600 bg-red-50 px-1 rounded">Concomitant Medication reporting</span> and <span className="text-red-600 bg-red-50 px-1 rounded">Stratification accuracy</span>. 
              Cross-system validation between EDC, Safety narratives, and IXRS indicates 2 high-confidence discrepancies affecting the Primary Estimand. 
              While enrollment is on track (12/15 subjects), data entry latency has increased by 15% since the last monitoring visit.
            </p>
          </div>

          {/* 3. Key Risk Indicators */}
          <div className="grid grid-cols-4 gap-4">
             {/* KRI 1 */}
             <div className="bg-white rounded-xl p-5 shadow-sm border border-black/[0.04]">
                <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider mb-2">Data Entry Lag</div>
                <div className="text-2xl font-bold text-[#1d1d1f] mb-1">{SITE_METRICS.dataEntryLag.value}</div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded w-fit">
                   <TrendingUp className="h-3 w-3" /> Warning
                </div>
             </div>
             {/* KRI 2 */}
             <div className="bg-white rounded-xl p-5 shadow-sm border border-black/[0.04]">
                <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider mb-2">Query Response</div>
                <div className="text-2xl font-bold text-[#1d1d1f] mb-1">{SITE_METRICS.queryResponse.value}</div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                   <CheckCircle2 className="h-3 w-3" /> Good
                </div>
             </div>
             {/* KRI 3 */}
             <div className="bg-white rounded-xl p-5 shadow-sm border border-black/[0.04]">
                <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider mb-2">AE Reporting</div>
                <div className="text-2xl font-bold text-[#1d1d1f] mb-1">{SITE_METRICS.aeReporting.value}</div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                   <Activity className="h-3 w-3" /> Good
                </div>
             </div>
             {/* KRI 4 */}
             <div className="bg-white rounded-xl p-5 shadow-sm border border-black/[0.04]">
                <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider mb-2">Protocol Deviations</div>
                <div className="text-2xl font-bold text-[#1d1d1f] mb-1">{SITE_METRICS.protocolDeviations.value}</div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded w-fit">
                   <AlertTriangle className="h-3 w-3" /> Critical
                </div>
             </div>
          </div>

          {/* 4. Open Signals */}
          <div className="bg-white rounded-2xl shadow-sm border border-black/[0.04] overflow-hidden">
             <div className="px-6 py-4 border-b border-black/[0.04] flex justify-between items-center">
                <h3 className="text-xs font-bold text-black/40 uppercase tracking-wider">Open Signals</h3>
             </div>
             <div className="divide-y divide-black/[0.04]">
                {OPEN_SIGNALS.map((signal) => (
                   <div key={signal.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-4">
                         <div className={cn("mt-1.5 h-2 w-2 rounded-full ring-2 ring-white shadow-sm", 
                            signal.severity === 'critical' ? "bg-red-500" :
                            signal.severity === 'warning' ? "bg-amber-500" : "bg-blue-500"
                         )} />
                         <div>
                            <div className="font-semibold text-sm text-[#1d1d1f] mb-0.5">{signal.title}</div>
                            <div className="text-[11px] text-[#86868b] font-mono">ID: {signal.id}</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent font-medium text-[10px]">
                            {signal.status}
                         </Badge>
                         <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                      </div>
                   </div>
                ))}
             </div>
          </div>

        </div>

        {/* Right Column (Side Panel) */}
        <div className="col-span-4 space-y-6">
           
           {/* 5. Enrollment Funnel */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.04]">
              <h3 className="text-xs font-bold text-black/40 uppercase tracking-wider mb-6">Enrollment Funnel</h3>
              <div className="space-y-6">
                 {ENROLLMENT_STATS.map((stat) => (
                    <div key={stat.label}>
                       <div className="flex justify-between text-xs font-medium mb-2">
                          <span className="text-[#1d1d1f]">{stat.label}</span>
                          <span className="text-[#86868b]">{stat.value}</span>
                       </div>
                       <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                             className={cn("h-full rounded-full", stat.color)} 
                             style={{ width: `${(stat.value / stat.total) * 100}%` }} 
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* 6. Site Team */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.04]">
              <h3 className="text-xs font-bold text-black/40 uppercase tracking-wider mb-6">Site Team</h3>
              <div className="space-y-4">
                 {SITE_TEAM.map((member) => (
                    <div key={member.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-black/[0.04]">
                       <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {member.initials}
                       </div>
                       <div>
                          <div className="text-sm font-semibold text-[#1d1d1f]">{member.name}</div>
                          <div className="text-[11px] text-[#86868b]">{member.role}</div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}