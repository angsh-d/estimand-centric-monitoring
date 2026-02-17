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
  ArrowUpRight,
  Target
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
  { 
    id: "109-007", 
    status: "Active", 
    alerts: ["Stratification Error", "Eligibility Review Required"], 
    risk: "high",
    estimandImpact: "Primary OS (ITT)"
  },
  { 
    id: "109-004", 
    status: "Active", 
    alerts: ["ConMed Reconciliation"], 
    risk: "medium",
    estimandImpact: "Safety (AEs)" 
  },
  { 
    id: "109-011", 
    status: "Screening", 
    alerts: [], 
    risk: "low",
    estimandImpact: "None"
  },
  { 
    id: "109-001", 
    status: "Completed", 
    alerts: [], 
    risk: "low",
    estimandImpact: "None"
  }
];

const OPEN_ACTION_ITEMS = [
  {
    id: "AI-102",
    task: "Retrain SC on IVRS Stratification Module",
    dueDate: "20-Feb-2026",
    assignee: "CRA (You)",
    priority: "High",
    impact: "Primary OS"
  },
  {
    id: "AI-099",
    task: "Collect missing CV for Sub-I Dr. Muller",
    dueDate: "25-Feb-2026",
    assignee: "Site (Sarah M.)",
    priority: "Medium",
    impact: "Compliance"
  }
];

const RECENT_ACTIVITY = [
  { date: "Today, 09:30", user: "System", action: "New Signal: SAE inconsistency (Subject 109-007)" },
  { date: "Yesterday, 14:15", user: "Dr. Webber", action: "eSigned Visit 3 for Subject 109-004" },
  { date: "15-Feb, 11:00", user: "Sarah Miller", action: "Responded to Query #4421 (Lab Units)" }
];

export default function SiteDossier() {
  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] font-sans text-slate-900 overflow-y-auto">
      
      {/* 1. Header / Site Identity Card */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6 sticky top-0 z-10 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-5">
            <div className="h-14 w-14 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-slate-200">
              {SITE_DETAILS.id}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">{SITE_DETAILS.name}</h1>
                <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 font-semibold px-2 py-0.5 text-[10px] uppercase tracking-wider shadow-sm">
                  {SITE_DETAILS.status}
                </Badge>
                <Badge variant="secondary" className="bg-slate-900 text-white border-slate-900 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider shadow-none">
                  Targeted Monitoring Triggered
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-[13px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {SITE_DETAILS.address}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" /> PI: {SITE_DETAILS.pi}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Button variant="outline" className="h-8 text-[11px] font-medium bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-lg shadow-sm">
                <Mail className="h-3.5 w-3.5 mr-2 text-slate-400" /> Email Site
              </Button>
              <Button variant="outline" className="h-8 text-[11px] font-medium bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-lg shadow-sm">
                <Phone className="h-3.5 w-3.5 mr-2 text-slate-400" /> Call PI
              </Button>
              <Button className="h-8 text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm rounded-lg">
                <ClipboardList className="h-3.5 w-3.5 mr-2" /> Prep Visit Letter
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-5 gap-8 pt-5 border-t border-slate-100">
           <div className="group">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-slate-600 transition-colors">Last Visit</div>
             <div className="text-[13px] font-semibold text-slate-700">{SITE_DETAILS.lastVisit}</div>
           </div>
           <div className="group">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-slate-600 transition-colors">Next Visit</div>
             <div className="text-[13px] font-semibold text-slate-900 flex items-center gap-1.5">
                {SITE_DETAILS.nextVisit} <AlertCircle className="h-3.5 w-3.5 stroke-[2.5]" />
             </div>
           </div>
           <div className="group">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-slate-600 transition-colors">IRB Approval</div>
             <div className="text-[13px] font-semibold text-slate-700">{SITE_DETAILS.irbExpiry}</div>
           </div>
           <div className="group">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-slate-600 transition-colors">Protocol Version</div>
             <div className="text-[13px] font-semibold text-slate-700">v4.0 (Current)</div>
           </div>
           <div className="group">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-slate-600 transition-colors">Recruitment</div>
             <div className="text-[13px] font-semibold text-slate-700">12 / 15 (80%)</div>
           </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
        
        {/* LEFT COLUMN - Risk & Signals */}
        <div className="col-span-8 space-y-6">
          
          {/* Estimand Impact Analysis - Replaces generic Intelligence Summary */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-slate-200 overflow-hidden group hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
             <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                   <div className="bg-white border border-slate-200 rounded-md p-1 shadow-sm">
                    <Target className="h-4 w-4 text-slate-900" />
                   </div>
                   <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Estimand Impact Analysis</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-slate-500">Threat Level:</span>
                  <span className="text-[10px] font-bold text-slate-900 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
                    Critical
                  </span>
                </div>
             </div>
             
             <div className="p-6">
                <div className="grid grid-cols-2 gap-8">
                  {/* Primary Estimand Impact */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Primary Estimand (OS - ITT)</div>
                      <Badge className="bg-slate-900 text-white hover:bg-slate-800 border-slate-900 text-[10px]">At Risk</Badge>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      Data lineage confirms <span className="font-semibold text-slate-900">Stratification Error</span> in Subject 109-007 directly impacts the Intent-to-Treat population definition.
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 text-slate-900 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-bold text-slate-900 mb-0.5">Lineage Trace</div>
                        <div className="text-[11px] text-slate-600 leading-tight">IXRS Randomization → eCRF Demographics → Statistical Analysis Set</div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary/Safety Impact */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Safety Estimand</div>
                      <Badge variant="outline" className="text-slate-600 border-slate-300 bg-white text-[10px]">Warning</Badge>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-900">ConMed Date Mismatch</span> creates temporal ambiguity in Adverse Event attribution window.
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-3">
                      <History className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-bold text-slate-700 mb-0.5">Lineage Trace</div>
                        <div className="text-[11px] text-slate-500 leading-tight">Safety Narrative → AE Log → ConMed Log → MedDRA Coding</div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SDV Progress</span>
                 <CheckCircle2 className="h-4 w-4 text-slate-900" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{SITE_METRICS.sdvProgress.value}%</div>
                <Progress value={82} className="h-1.5 mt-3 bg-slate-100" indicatorClassName="bg-slate-900" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Query Aging</span>
                 <Clock className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
                  {SITE_METRICS.queryAging.value} <span className="text-sm text-slate-400 font-normal">days</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1 bg-slate-100 inline-block px-1.5 py-0.5 rounded">Above limit (7 days)</div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Protocol Deviations</span>
                 <AlertTriangle className="h-4 w-4 text-slate-900" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{SITE_METRICS.pdRate.value}</div>
                <div className="text-[10px] text-slate-900 font-medium mt-1">Rate per 100 days</div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Missing Pages</span>
                 <FileText className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{SITE_METRICS.missingPages.value}</div>
                <div className="text-[10px] text-slate-400 font-medium mt-1">Low backlog</div>
              </div>
            </div>
          </div>

          {/* Subject Focus List - Now with Estimand Impact Column */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Review List</h3>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50">View All Subjects</Button>
             </div>
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                 <tr>
                   <th className="px-6 py-3 w-[120px] text-[11px] uppercase tracking-wide">Subject ID</th>
                   <th className="px-6 py-3 text-[11px] uppercase tracking-wide">Status</th>
                   <th className="px-6 py-3 text-[11px] uppercase tracking-wide">Active Alerts</th>
                   <th className="px-6 py-3 text-[11px] uppercase tracking-wide">Estimand Impact</th>
                   <th className="px-6 py-3 text-right text-[11px] uppercase tracking-wide">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {KEY_SUBJECTS.map((subj) => (
                   <tr key={subj.id} className="group hover:bg-slate-50/80 transition-colors">
                     <td className="px-6 py-4 font-semibold text-slate-700 text-[13px]">
                       {subj.id}
                       {subj.risk === "high" && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-slate-900" />}
                     </td>
                     <td className="px-6 py-4">
                       <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 font-medium text-[10px] shadow-sm">
                         {subj.status}
                       </Badge>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex flex-col gap-2">
                         {subj.alerts.length > 0 ? subj.alerts.map(a => (
                           <div key={a} className="flex items-center gap-2 text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md w-fit border border-slate-200">
                             <AlertCircle className="h-3 w-3" /> {a}
                           </div>
                         )) : <span className="text-slate-400 text-[11px] italic">No active alerts</span>}
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       {subj.estimandImpact && subj.estimandImpact !== "None" ? (
                         <div className="flex items-center gap-1.5">
                           <Target className="h-3.5 w-3.5 text-slate-400" />
                           <span className={cn("text-[11px] font-medium", 
                             subj.estimandImpact.includes("Primary") ? "text-slate-900" : "text-slate-500"
                           )}>
                             {subj.estimandImpact}
                           </span>
                         </div>
                       ) : (
                         <span className="text-slate-300 text-[11px]">-</span>
                       )}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600">
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
           
           {/* Action Items - With Impact Badge */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 stroke-[2]" /> Open Action Items
              </h3>
              <div className="space-y-3">
                 {OPEN_ACTION_ITEMS.map((item) => (
                   <div key={item.id} className="p-4 border border-slate-100 rounded-xl hover:border-slate-300 transition-all bg-white shadow-sm group cursor-pointer relative overflow-hidden">
                      {item.impact === "Primary OS" && <div className="absolute top-0 right-0 w-3 h-3 bg-slate-900 rounded-bl-lg" />}
                      
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", 
                          item.priority === "High" 
                            ? "bg-slate-900 text-white border-slate-900" 
                            : "bg-white text-slate-600 border-slate-200"
                        )}>{item.priority}</span>
                        <span className="text-[10px] text-slate-400 font-medium">Due {item.dueDate}</span>
                      </div>
                      
                      <p className="text-[13px] font-semibold text-slate-800 leading-snug mb-3 group-hover:text-slate-900 transition-colors">{item.task}</p>
                      
                      <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600 border border-white shadow-sm">
                            {item.assignee.charAt(0)}
                          </div>
                          {item.assignee}
                        </div>
                        {item.impact && (
                          <div className="text-[9px] font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <Target className="h-3 w-3" /> {item.impact}
                          </div>
                        )}
                      </div>
                   </div>
                 ))}
                 <Button variant="outline" className="w-full h-9 text-[11px] font-medium text-slate-500 border-dashed border-slate-300 hover:bg-slate-50 hover:text-slate-900 mt-2">
                   + Add Action Item
                 </Button>
              </div>
           </div>

           {/* Site Team */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Users className="h-4 w-4 stroke-[2]" /> Site Personnel
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">DW</div>
                    <div>
                       <div className="text-[13px] font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">Dr. Klaus Webber</div>
                       <div className="text-[11px] text-slate-500 font-medium">Principal Investigator</div>
                    </div>
                    <Button size="icon" variant="ghost" className="ml-auto h-8 w-8 text-slate-300 hover:text-slate-600 hover:bg-slate-50"><Mail className="h-4 w-4" /></Button>
                 </div>
                 <Separator className="bg-slate-50" />
                 <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">SM</div>
                    <div>
                       <div className="text-[13px] font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">Sarah Miller</div>
                       <div className="text-[11px] text-slate-500 font-medium">Study Coordinator</div>
                    </div>
                    <Button size="icon" variant="ghost" className="ml-auto h-8 w-8 text-slate-300 hover:text-slate-600 hover:bg-slate-50"><Mail className="h-4 w-4" /></Button>
                 </div>
              </div>
           </div>

           {/* Recent Activity Stream */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                <History className="h-4 w-4 stroke-[2]" /> Recent Activity
              </h3>
              <div className="relative border-l border-slate-100 ml-2 space-y-7">
                 {RECENT_ACTIVITY.map((act, i) => (
                   <div key={i} className="pl-5 relative group">
                      <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-white border-2 border-slate-200 group-hover:border-slate-400 transition-colors" />
                      <div className="text-[10px] font-medium text-slate-400 mb-0.5">{act.date}</div>
                      <div className="text-[12px] font-medium text-slate-800 leading-snug">{act.action}</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-medium bg-slate-50 inline-block px-1.5 py-0.5 rounded border border-slate-100">by {act.user}</div>
                   </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}