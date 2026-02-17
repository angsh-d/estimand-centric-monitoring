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
  AlertCircle,
  ClipboardList,
  History,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// --- Real-world CRA Data ---

const SITE_DETAILS = {
  id: "109",
  name: "Charité - Universitätsmedizin Berlin",
  status: "Active - Recruiting",
  pi: "Dr. Klaus Webber",
  address: "Charitéplatz 1, 10117 Berlin, Germany",
  timezone: "CET (UTC+1)",
  lastVisit: "12-Jan-2026 (Remote)",
  nextVisit: "19-Feb-2026 (On-site - Targeted)",
  contractStatus: "Executed",
  irbExpiry: "15-Aug-2026"
};

const SITE_METRICS = {
  sdvProgress: { value: 82, label: "SDV Complete", status: "good" },
  queryAging: { value: 14, label: "Avg Query Age (Days)", status: "warning" },
  missingPages: { value: 3, label: "Missing Pages", status: "good" },
  pdRate: { value: 12.5, label: "PD Rate / 100 Subj Days", status: "critical" }
};

const KEY_SUBJECTS = [
  { id: "109-007", status: "Active", alerts: ["Stratification Error", "Eligibility Review Required"], risk: "high" },
  { id: "109-004", status: "Active", alerts: ["ConMed Reconciliation"], risk: "medium" },
  { id: "109-011", status: "Screening", alerts: [], risk: "low" },
  { id: "109-001", status: "Completed", alerts: [], risk: "low" }
];

const OPEN_ACTION_ITEMS = [
  {
    id: "AI-102",
    task: "Retrain SC on IVRS Stratification Module",
    dueDate: "20-Feb-2026",
    assignee: "CRA (You)",
    priority: "High"
  },
  {
    id: "AI-099",
    task: "Collect missing CV for Sub-I Dr. Muller",
    dueDate: "25-Feb-2026",
    assignee: "Site (Sarah M.)",
    priority: "Medium"
  }
];

const RECENT_ACTIVITY = [
  { date: "Today, 09:30", user: "System", action: "New Signal: SAE inconsistency (Subject 109-007)" },
  { date: "Yesterday, 14:15", user: "Dr. Webber", action: "eSigned Visit 3 for Subject 109-004" },
  { date: "15-Feb, 11:00", user: "Sarah Miller", action: "Responded to Query #4421 (Lab Units)" }
];

export default function SiteDossier() {
  return (
    <div className="flex flex-col h-full bg-[#F5F5F7] font-sans text-[#1d1d1f] overflow-y-auto">
      
      {/* 1. Header / Site Identity Card */}
      <div className="bg-white border-b border-black/[0.05] px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-5">
            <div className="h-14 w-14 bg-[#1d1d1f] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              {SITE_DETAILS.id}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-xl font-bold tracking-tight text-[#1d1d1f]">{SITE_DETAILS.name}</h1>
                <Badge variant="outline" className="border-black/10 text-[#1d1d1f] font-semibold px-2 py-0.5 text-[10px] uppercase tracking-wider bg-transparent">
                  {SITE_DETAILS.status}
                </Badge>
                <Badge variant="secondary" className="bg-red-50 text-red-600 border border-red-100 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider shadow-none">
                  Targeted Monitoring Triggered
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-[13px] text-[#86868b] font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {SITE_DETAILS.address}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> PI: {SITE_DETAILS.pi}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Button variant="outline" className="h-8 text-[11px] font-medium bg-white hover:bg-gray-50 border-black/10 text-[#1d1d1f] rounded-md shadow-sm">
                <Mail className="h-3.5 w-3.5 mr-2 text-[#86868b]" /> Email Site
              </Button>
              <Button variant="outline" className="h-8 text-[11px] font-medium bg-white hover:bg-gray-50 border-black/10 text-[#1d1d1f] rounded-md shadow-sm">
                <Phone className="h-3.5 w-3.5 mr-2 text-[#86868b]" /> Call PI
              </Button>
              <Button className="h-8 text-[11px] font-medium bg-[#1d1d1f] hover:bg-black/90 text-white shadow-sm rounded-md border border-transparent">
                <ClipboardList className="h-3.5 w-3.5 mr-2" /> Prep Visit Letter
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-5 gap-8 pt-5 border-t border-black/[0.05]">
           <div className="group">
             <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-1">Last Visit</div>
             <div className="text-[13px] font-semibold text-[#1d1d1f]">{SITE_DETAILS.lastVisit}</div>
           </div>
           <div className="group">
             <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-1">Next Visit</div>
             <div className="text-[13px] font-semibold text-red-600 flex items-center gap-1.5">
                {SITE_DETAILS.nextVisit} <AlertCircle className="h-3.5 w-3.5 stroke-[2.5]" />
             </div>
           </div>
           <div className="group">
             <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-1">IRB Approval</div>
             <div className="text-[13px] font-semibold text-[#1d1d1f]">{SITE_DETAILS.irbExpiry}</div>
           </div>
           <div className="group">
             <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-1">Protocol Version</div>
             <div className="text-[13px] font-semibold text-[#1d1d1f]">v4.0 (Current)</div>
           </div>
           <div className="group">
             <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-1">Recruitment</div>
             <div className="text-[13px] font-semibold text-[#1d1d1f]">12 / 15 (80%)</div>
           </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
        
        {/* LEFT COLUMN - Risk & Signals */}
        <div className="col-span-8 space-y-6">
          
          {/* Intelligence Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-black/[0.05] overflow-hidden">
             <div className="bg-gray-50/50 px-6 py-4 border-b border-black/[0.05] flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                   <Activity className="h-4 w-4 text-red-600" />
                   <h2 className="text-[13px] font-bold text-[#1d1d1f] uppercase tracking-wide">Risk Assessment: High</h2>
                </div>
                <span className="text-[10px] font-medium text-red-600 bg-red-50/50 px-2.5 py-1 rounded-full border border-red-100">
                  Threatens Primary Estimand (ITT)
                </span>
             </div>
             <div className="p-6">
                <p className="text-[#1d1d1f] leading-relaxed text-[15px]">
                   <strong className="font-semibold">Critical Finding:</strong> Recent monitoring signals indicate a systemic issue with source data verification for randomized subjects. Specifically, <span className="text-red-600 font-medium">Subject 109-007</span> has a confirmed stratification mismatch (IXRS vs Lab) which invalidates their assignment to the "High PD-L1" stratum.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="bg-[#F5F5F7] rounded-lg p-4 border border-black/[0.04]">
                     <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-1.5">Primary Root Cause</div>
                     <div className="text-[13px] font-medium text-[#1d1d1f]">Site Coordinator entering unverified lab values into IXRS</div>
                  </div>
                  <div className="bg-[#F5F5F7] rounded-lg p-4 border border-black/[0.04]">
                     <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider mb-1.5">Recommended Action</div>
                     <div className="text-[13px] font-medium text-[#1d1d1f]">100% SDV of Eligibility Criteria for all active subjects</div>
                  </div>
                </div>
             </div>
          </div>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-black/[0.05] flex flex-col justify-between h-32 hover:border-black/10 transition-colors">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">SDV Progress</span>
                 <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight">{SITE_METRICS.sdvProgress.value}%</div>
                <Progress value={82} className="h-1.5 mt-3 bg-[#F5F5F7]" indicatorClassName="bg-[#1d1d1f]" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-black/[0.05] flex flex-col justify-between h-32 hover:border-black/10 transition-colors">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Query Aging</span>
                 <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight flex items-baseline gap-1">
                  {SITE_METRICS.queryAging.value} <span className="text-sm text-[#86868b] font-normal">days</span>
                </div>
                <div className="text-[10px] text-amber-600 font-medium mt-1">Above limit (7 days)</div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-black/[0.05] flex flex-col justify-between h-32 hover:border-black/10 transition-colors">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Protocol Deviations</span>
                 <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight">{SITE_METRICS.pdRate.value}</div>
                <div className="text-[10px] text-red-600 font-medium mt-1">Rate per 100 days</div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-black/[0.05] flex flex-col justify-between h-32 hover:border-black/10 transition-colors">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Missing Pages</span>
                 <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight">{SITE_METRICS.missingPages.value}</div>
                <div className="text-[10px] text-[#86868b] font-medium mt-1">Low backlog</div>
              </div>
            </div>
          </div>

          {/* Subject Focus List */}
          <div className="bg-white rounded-xl shadow-sm border border-black/[0.05] overflow-hidden">
             <div className="px-6 py-5 border-b border-black/[0.05] flex justify-between items-center">
                <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Key Subjects Requiring Review</h3>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-medium text-[#1d1d1f] hover:bg-[#F5F5F7]">View All Subjects</Button>
             </div>
             <table className="w-full text-sm text-left">
               <thead className="bg-[#F5F5F7] text-[#86868b] font-medium border-b border-black/[0.05]">
                 <tr>
                   <th className="px-6 py-3 w-[140px] text-[11px] uppercase tracking-wide">Subject ID</th>
                   <th className="px-6 py-3 text-[11px] uppercase tracking-wide">Status</th>
                   <th className="px-6 py-3 text-[11px] uppercase tracking-wide">Active Alerts</th>
                   <th className="px-6 py-3 text-right text-[11px] uppercase tracking-wide">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-black/[0.05]">
                 {KEY_SUBJECTS.map((subj) => (
                   <tr key={subj.id} className="group hover:bg-[#F5F5F7]/50 transition-colors">
                     <td className="px-6 py-4 font-semibold text-[#1d1d1f] text-[13px]">
                       {subj.id}
                       {subj.risk === "high" && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-red-600" />}
                     </td>
                     <td className="px-6 py-4">
                       <Badge variant="outline" className="bg-white text-[#86868b] border-black/10 font-medium text-[10px] shadow-sm">
                         {subj.status}
                       </Badge>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex flex-col gap-2">
                         {subj.alerts.length > 0 ? subj.alerts.map(a => (
                           <div key={a} className="flex items-center gap-2 text-[11px] font-medium text-red-600 bg-red-50/50 px-2.5 py-1 rounded-md w-fit border border-red-100">
                             <AlertCircle className="h-3 w-3" /> {a}
                           </div>
                         )) : <span className="text-[#86868b] text-[11px] italic">No active alerts</span>}
                       </div>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-black/5 text-[#86868b]">
                         <ChevronRight className="h-4 w-4" />
                       </Button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>

        </div>

        {/* RIGHT COLUMN - Admin & Activity */}
        <div className="col-span-4 space-y-6">
           
           {/* Action Items */}
           <div className="bg-white rounded-xl shadow-sm border border-black/[0.05] p-6">
              <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-5 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 stroke-[2]" /> Open Action Items
              </h3>
              <div className="space-y-3">
                 {OPEN_ACTION_ITEMS.map((item) => (
                   <div key={item.id} className="p-4 border border-black/[0.05] rounded-xl hover:border-black/10 transition-all bg-white shadow-sm cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", 
                          item.priority === "High" 
                            ? "bg-red-50 text-red-600 border-red-100" 
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>{item.priority}</span>
                        <span className="text-[10px] text-[#86868b] font-medium">Due {item.dueDate}</span>
                      </div>
                      <p className="text-[13px] font-semibold text-[#1d1d1f] leading-snug mb-3">{item.task}</p>
                      <div className="flex items-center gap-2 text-[11px] text-[#86868b] pt-2 border-t border-black/[0.04]">
                        <div className="h-5 w-5 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[9px] font-bold text-[#1d1d1f] border border-white shadow-sm">
                          {item.assignee.charAt(0)}
                        </div>
                        {item.assignee}
                      </div>
                   </div>
                 ))}
                 <Button variant="outline" className="w-full h-9 text-[11px] font-medium text-[#86868b] border-dashed border-black/20 hover:bg-[#F5F5F7] hover:text-[#1d1d1f] mt-2">
                   + Add Action Item
                 </Button>
              </div>
           </div>

           {/* Site Team */}
           <div className="bg-white rounded-xl shadow-sm border border-black/[0.05] p-6">
              <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-5 flex items-center gap-2">
                <Users className="h-4 w-4 stroke-[2]" /> Site Personnel
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-[#F5F5F7] flex items-center justify-center text-xs font-bold text-[#1d1d1f] border border-black/[0.05] shadow-sm">DW</div>
                    <div>
                       <div className="text-[13px] font-semibold text-[#1d1d1f]">Dr. Klaus Webber</div>
                       <div className="text-[11px] text-[#86868b] font-medium">Principal Investigator</div>
                    </div>
                    <Button size="icon" variant="ghost" className="ml-auto h-8 w-8 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#F5F5F7]"><Mail className="h-4 w-4" /></Button>
                 </div>
                 <Separator className="bg-black/[0.04]" />
                 <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-[#F5F5F7] flex items-center justify-center text-xs font-bold text-[#1d1d1f] border border-black/[0.05] shadow-sm">SM</div>
                    <div>
                       <div className="text-[13px] font-semibold text-[#1d1d1f]">Sarah Miller</div>
                       <div className="text-[11px] text-[#86868b] font-medium">Study Coordinator</div>
                    </div>
                    <Button size="icon" variant="ghost" className="ml-auto h-8 w-8 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#F5F5F7]"><Mail className="h-4 w-4" /></Button>
                 </div>
              </div>
           </div>

           {/* Recent Activity Stream */}
           <div className="bg-white rounded-xl shadow-sm border border-black/[0.05] p-6">
              <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-5 flex items-center gap-2">
                <History className="h-4 w-4 stroke-[2]" /> Recent Activity
              </h3>
              <div className="relative border-l border-black/[0.08] ml-2 space-y-7">
                 {RECENT_ACTIVITY.map((act, i) => (
                   <div key={i} className="pl-5 relative group">
                      <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-white border-2 border-[#86868b] group-hover:border-[#1d1d1f] transition-colors" />
                      <div className="text-[10px] font-medium text-[#86868b] mb-0.5">{act.date}</div>
                      <div className="text-[12px] font-medium text-[#1d1d1f] leading-snug">{act.action}</div>
                      <div className="text-[10px] text-[#86868b] mt-1 font-medium bg-[#F5F5F7] inline-block px-1.5 py-0.5 rounded border border-black/[0.04]">by {act.user}</div>
                   </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}