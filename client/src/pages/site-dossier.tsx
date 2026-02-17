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
  Stethoscope,
  Microscope,
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
      <div className="bg-white border-b border-black/[0.04] px-8 py-6 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-6">
            <div className="h-16 w-16 bg-[#1d1d1f] rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {SITE_DETAILS.id}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold tracking-tight">{SITE_DETAILS.name}</h1>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-medium px-2 py-0.5 text-[10px] uppercase tracking-wider">
                  {SITE_DETAILS.status}
                </Badge>
                <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-100 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">
                  Targeted Monitoring Triggered
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-[#86868b] font-medium mt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-400" /> {SITE_DETAILS.address}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-gray-400" /> PI: {SITE_DETAILS.pi}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-3">
              <Button variant="outline" className="h-9 text-xs font-medium bg-white hover:bg-gray-50">
                <Mail className="h-3.5 w-3.5 mr-2" /> Email Site
              </Button>
              <Button variant="outline" className="h-9 text-xs font-medium bg-white hover:bg-gray-50">
                <Phone className="h-3.5 w-3.5 mr-2" /> Call PI
              </Button>
              <Button className="h-9 text-xs font-medium bg-[#1d1d1f] hover:bg-black/90 text-white shadow-md">
                <ClipboardList className="h-3.5 w-3.5 mr-2" /> Prep Visit Letter
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-5 gap-8 pt-4 border-t border-gray-100">
           <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Last Visit</div>
             <div className="text-sm font-semibold text-gray-900">{SITE_DETAILS.lastVisit}</div>
           </div>
           <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Next Visit</div>
             <div className="text-sm font-semibold text-red-600 flex items-center gap-1">
                {SITE_DETAILS.nextVisit} <AlertCircle className="h-3 w-3" />
             </div>
           </div>
           <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">IRB Approval</div>
             <div className="text-sm font-semibold text-gray-900">{SITE_DETAILS.irbExpiry}</div>
           </div>
           <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Protocol Version</div>
             <div className="text-sm font-semibold text-gray-900">v4.0 (Current)</div>
           </div>
           <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Recruitment</div>
             <div className="text-sm font-semibold text-gray-900">12 / 15 (80%)</div>
           </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
        
        {/* LEFT COLUMN - Risk & Signals */}
        <div className="col-span-8 space-y-8">
          
          {/* Intelligence Summary - The "Why are we here" */}
          <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] overflow-hidden">
             <div className="bg-red-50/50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <Activity className="h-5 w-5 text-red-600" />
                   <h2 className="text-sm font-bold text-red-900 uppercase tracking-wide">Risk Assessment: High</h2>
                </div>
                <span className="text-[10px] font-medium text-red-600 bg-white px-2 py-1 rounded border border-red-100">
                  Threatens Primary Estimand (ITT)
                </span>
             </div>
             <div className="p-6">
                <p className="text-[#1d1d1f] leading-relaxed">
                   <strong>Critical Finding:</strong> Recent monitoring signals indicate a systemic issue with source data verification for randomized subjects. Specifically, <span className="text-red-600 font-medium">Subject 109-007</span> has a confirmed stratification mismatch (IXRS vs Lab) which invalidates their assignment to the "High PD-L1" stratum.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                     <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Primary Root Cause</div>
                     <div className="text-sm font-medium text-gray-900">Site Coordinator entering unverified lab values into IXRS</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                     <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Recommended Action</div>
                     <div className="text-sm font-medium text-gray-900">100% SDV of Eligibility Criteria for all active subjects</div>
                  </div>
                </div>
             </div>
          </div>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-black/[0.04] flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SDV Progress</span>
                 <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1d1d1f]">{SITE_METRICS.sdvProgress.value}%</div>
                <Progress value={82} className="h-1.5 mt-2 bg-gray-100" indicatorClassName="bg-emerald-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-black/[0.04] flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Query Aging</span>
                 <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1d1d1f]">{SITE_METRICS.queryAging.value} <span className="text-sm text-gray-500 font-normal">days</span></div>
                <div className="text-[10px] text-amber-600 font-medium mt-1">Above limit (7 days)</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-black/[0.04] flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Protocol Deviations</span>
                 <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1d1d1f]">{SITE_METRICS.pdRate.value}</div>
                <div className="text-[10px] text-red-600 font-medium mt-1">Rate per 100 days</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-black/[0.04] flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Missing Pages</span>
                 <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1d1d1f]">{SITE_METRICS.missingPages.value}</div>
                <div className="text-[10px] text-gray-400 font-medium mt-1">Low backlog</div>
              </div>
            </div>
          </div>

          {/* Subject Focus List */}
          <div className="bg-white rounded-xl shadow-sm border border-black/[0.04] overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Key Subjects Requiring Review</h3>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-blue-600 hover:text-blue-700 hover:bg-blue-50">View All Subjects</Button>
             </div>
             <table className="w-full text-sm text-left">
               <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                 <tr>
                   <th className="px-6 py-3 w-[120px]">Subject ID</th>
                   <th className="px-6 py-3">Status</th>
                   <th className="px-6 py-3">Active Alerts</th>
                   <th className="px-6 py-3 text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {KEY_SUBJECTS.map((subj) => (
                   <tr key={subj.id} className="group hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 font-semibold text-[#1d1d1f]">
                       {subj.id}
                       {subj.risk === "high" && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500" />}
                     </td>
                     <td className="px-6 py-4">
                       <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-medium text-[10px]">
                         {subj.status}
                       </Badge>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex flex-col gap-1.5">
                         {subj.alerts.length > 0 ? subj.alerts.map(a => (
                           <div key={a} className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded w-fit">
                             <AlertCircle className="h-3 w-3" /> {a}
                           </div>
                         )) : <span className="text-gray-400 text-xs">No active alerts</span>}
                       </div>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-gray-200">
                         <ChevronRight className="h-4 w-4 text-gray-400" />
                       </Button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>

        </div>

        {/* RIGHT COLUMN - Admin & Activity */}
        <div className="col-span-4 space-y-8">
           
           {/* Action Items */}
           <div className="bg-white rounded-xl shadow-sm border border-black/[0.04] p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ClipboardList className="h-4 w-4" /> Open Action Items
              </h3>
              <div className="space-y-4">
                 {OPEN_ACTION_ITEMS.map((item) => (
                   <div key={item.id} className="p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors bg-white">
                      <div className="flex justify-between items-start mb-1">
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", 
                          item.priority === "High" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                        )}>{item.priority}</span>
                        <span className="text-[10px] text-gray-400">Due {item.dueDate}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 leading-snug mb-2">{item.task}</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold">
                          {item.assignee.charAt(0)}
                        </div>
                        {item.assignee}
                      </div>
                   </div>
                 ))}
                 <Button variant="outline" className="w-full h-8 text-xs text-gray-600 border-dashed border-gray-300">
                   + Add Action Item
                 </Button>
              </div>
           </div>

           {/* Site Team */}
           <div className="bg-white rounded-xl shadow-sm border border-black/[0.04] p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" /> Site Personnel
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-white shadow-sm">DW</div>
                    <div>
                       <div className="text-sm font-semibold text-gray-900">Dr. Klaus Webber</div>
                       <div className="text-xs text-gray-500">Principal Investigator</div>
                    </div>
                    <Button size="icon" variant="ghost" className="ml-auto h-8 w-8 text-gray-400 hover:text-gray-900"><Mail className="h-4 w-4" /></Button>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 border border-white shadow-sm">SM</div>
                    <div>
                       <div className="text-sm font-semibold text-gray-900">Sarah Miller</div>
                       <div className="text-xs text-gray-500">Study Coordinator</div>
                    </div>
                    <Button size="icon" variant="ghost" className="ml-auto h-8 w-8 text-gray-400 hover:text-gray-900"><Mail className="h-4 w-4" /></Button>
                 </div>
              </div>
           </div>

           {/* Recent Activity Stream */}
           <div className="bg-white rounded-xl shadow-sm border border-black/[0.04] p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <History className="h-4 w-4" /> Recent Activity
              </h3>
              <div className="relative border-l border-gray-100 ml-2 space-y-6">
                 {RECENT_ACTIVITY.map((act, i) => (
                   <div key={i} className="pl-4 relative">
                      <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-white border-2 border-gray-200" />
                      <div className="text-[10px] text-gray-400 mb-0.5">{act.date}</div>
                      <div className="text-xs font-medium text-gray-900">{act.action}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">by {act.user}</div>
                   </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}