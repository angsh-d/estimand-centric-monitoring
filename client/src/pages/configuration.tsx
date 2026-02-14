import { AppShell } from "@/components/layout/app-shell";
import { useState } from "react";
import { 
  Settings, 
  Save, 
  Database, 
  Users, 
  FileText, 
  Sliders, 
  Shield, 
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const settingsSections = [
  {
    id: "data-sources",
    title: "Data Source Mappings",
    icon: Database,
    description: "Configure ingestion paths and field mapping logic.",
    active: true
  },
  {
    id: "identity",
    title: "Identity Resolution",
    icon: Users,
    description: "Rules for subject matching across disparate data systems.",
    active: false
  },
  {
    id: "reconciliation",
    title: "Reconciliation Thresholds",
    icon: Sliders,
    description: "Set tolerance levels for auto-reconciliation.",
    active: false
  },
  {
    id: "mvr-templates",
    title: "MVR Templates",
    icon: FileText,
    description: "Manage section structures and standard text.",
    active: false
  },
  {
    id: "access",
    title: "Access & Security",
    icon: Shield,
    description: "Role-based permissions and audit log settings.",
    active: false
  }
];

export default function Configuration() {
  const [activeSection, setActiveSection] = useState("data-sources");
  const [autoMap, setAutoMap] = useState(true);

  return (
    <div className="space-y-8 pb-10 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Configuration</h1>
        <p className="text-slate-500 text-[13px]">
          Manage study-level settings and data integration rules.
        </p>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <div className="w-64 shrink-0 space-y-1">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all",
                activeSection === section.id 
                  ? "bg-slate-200/60 text-slate-900 font-medium" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "h-6 w-6 rounded-md flex items-center justify-center transition-colors",
                activeSection === section.id ? "bg-white shadow-sm text-slate-900" : "bg-transparent text-slate-400"
              )}>
                <section.icon className="h-3.5 w-3.5" />
              </div>
              <div className="text-[13px]">{section.title}</div>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="h-14 px-6 border-b border-slate-100 flex justify-between items-center bg-white">
             <h2 className="font-semibold text-[13px] text-slate-900 flex items-center gap-2">
               Data Source Mappings
             </h2>
             <div className="flex gap-2">
               <button className="px-3 py-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                 Discard
               </button>
               <button className="px-3 py-1.5 text-[11px] font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5">
                 <Save className="h-3 w-3" />
                 Save Changes
               </button>
             </div>
          </div>

          {/* Content Form */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
             <div className="max-w-2xl mx-auto space-y-8">
               
               {/* Section 1 */}
               <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h3 className="text-[13px] font-semibold text-slate-900">Auto-Mapping Logic</h3>
                     <p className="text-[11px] text-slate-500 mt-0.5">Automatically map fields based on SDTM standard variable names.</p>
                   </div>
                   <button onClick={() => setAutoMap(!autoMap)} className="text-slate-900 hover:opacity-80 transition-opacity">
                     {autoMap ? <ToggleRight className="h-8 w-8 text-blue-600" /> : <ToggleLeft className="h-8 w-8 text-slate-300" />}
                   </button>
                 </div>
               </section>

               {/* Section 2 */}
               <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-[13px] font-semibold text-slate-900">Connected Systems</h3>
                   <button className="text-[11px] font-medium text-blue-600 hover:text-blue-700">+ Add System</button>
                 </div>
                 
                 <div className="space-y-2">
                   {[
                     { name: "Medidata Rave (EDC)", status: "Active", sync: "Daily", icon: Database },
                     { name: "Oracle Argus (Safety)", status: "Active", sync: "Hourly", icon: Shield },
                     { name: "Q2 Lab Central", status: "Warning", sync: "Manual", icon: FileText }
                   ].map((sys, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                            <sys.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-slate-900">{sys.name}</div>
                            <div className="text-[10px] text-slate-500">Sync: {sys.sync}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className={cn("flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border",
                             sys.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                           )}>
                             <div className={cn("h-1.5 w-1.5 rounded-full", sys.status === 'Active' ? "bg-emerald-500" : "bg-amber-500")} />
                             {sys.status}
                           </div>
                           <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
                        </div>
                     </div>
                   ))}
                 </div>
               </section>

               {/* Section 3 */}
               <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                 <h3 className="text-[13px] font-semibold text-slate-900 mb-4">Transformation Rules</h3>
                 <div className="space-y-2">
                   {["Convert all dates to ISO 8601 (YYYY-MM-DD)", "Normalize unit codes to UCUM standards", "Map 'Unknown' values to NULL"].map((rule, i) => (
                     <div key={i} className="flex items-start gap-3 p-3 text-[12px] text-slate-600 border border-slate-100 rounded-lg bg-slate-50/30">
                       <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5" />
                       {rule}
                     </div>
                   ))}
                 </div>
               </section>

             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
