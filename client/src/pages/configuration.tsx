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
  ToggleRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const settingsSections = [
  {
    id: "data-sources",
    title: "Data Source Mappings",
    icon: Database,
    description: "Configure ingestion paths and field mapping logic for EDC, Safety, and Lab data.",
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
    description: "Set tolerance levels for auto-reconciliation of dates and values.",
    active: false
  },
  {
    id: "mvr-templates",
    title: "MVR Templates",
    icon: FileText,
    description: "Manage section structures and standard text for Monitoring Visit Reports.",
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
    <AppShell>
      <div className="space-y-8 pb-10 h-[calc(100vh-140px)] flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col gap-1 shrink-0">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
            Configuration
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Study-level settings for data integration, reconciliation logic, and reporting templates.
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
                  "w-full text-left px-4 py-3 rounded-lg flex items-start gap-3 transition-colors",
                  activeSection === section.id 
                    ? "bg-secondary text-foreground font-medium" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <section.icon className={cn("h-5 w-5 mt-0.5", activeSection === section.id ? "text-primary" : "text-muted-foreground")} />
                <div>
                  <div className="text-sm">{section.title}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-border/60 bg-secondary/10 flex justify-between items-center">
               <h2 className="font-medium text-sm flex items-center gap-2">
                 <Database className="h-4 w-4 text-muted-foreground" />
                 Data Source Mappings
               </h2>
               <div className="flex gap-2">
                 <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-white border border-border/60 rounded-md shadow-sm transition-colors">
                   Reset
                 </button>
                 <button className="px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-colors flex items-center gap-2">
                   <Save className="h-3 w-3" />
                   Save Changes
                 </button>
               </div>
            </div>

            {/* Content Form */}
            <div className="flex-1 overflow-y-auto p-8">
               <div className="max-w-2xl space-y-8">
                 
                 {/* Section 1 */}
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-base font-medium text-foreground">Auto-Mapping</h3>
                       <p className="text-sm text-muted-foreground">Automatically map fields based on SDTM standard variable names.</p>
                     </div>
                     <button onClick={() => setAutoMap(!autoMap)} className="text-primary hover:text-primary/80 transition-colors">
                       {autoMap ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8 text-muted-foreground" />}
                     </button>
                   </div>
                 </div>

                 <div className="h-px bg-border/60 w-full" />

                 {/* Section 2 */}
                 <div className="space-y-4">
                   <h3 className="text-base font-medium text-foreground">Source Systems</h3>
                   
                   <div className="space-y-3">
                     {[
                       { name: "Medidata Rave (EDC)", status: "Connected", sync: "Daily" },
                       { name: "Oracle Argus (Safety)", status: "Connected", sync: "Hourly" },
                       { name: "Q2 Lab Central", status: "Warning", sync: "Manual" }
                     ].map((sys, i) => (
                       <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-background">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium">{sys.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Sync: {sys.sync}</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                       </div>
                     ))}
                     
                     <button className="w-full py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:bg-secondary/20 hover:text-foreground transition-colors">
                       + Add New Source System
                     </button>
                   </div>
                 </div>

                 <div className="h-px bg-border/60 w-full" />

                 {/* Section 3 */}
                 <div className="space-y-4">
                   <h3 className="text-base font-medium text-foreground">Transformation Rules</h3>
                   <div className="p-4 bg-secondary/20 rounded-lg text-sm text-muted-foreground border border-border/40">
                     <p className="mb-2">Active transformations:</p>
                     <ul className="list-disc list-inside space-y-1 ml-1">
                       <li>Convert all dates to ISO 8601 (YYYY-MM-DD)</li>
                       <li>Normalize unit codes to UCUM standards</li>
                       <li>Map "Unknown" or "Missing" values to NULL in analytics layer</li>
                     </ul>
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
