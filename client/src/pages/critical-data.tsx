import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton-loader";
import { useState } from "react";
import { ChevronRight, Database, FileSpreadsheet, ArrowRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const criticalElements = [
  {
    estimand: "Primary Endpoint: Progression Free Survival (PFS)",
    definition: "Time from randomization to first documented progression or death",
    population: "ITT Population",
    derivation: [
      {
        step: "Analysis Variable",
        name: "AVAL",
        description: "Derived PFS Time (Months)",
        source: "ADaM.ADPFS"
      },
      {
        step: "Source Domain",
        name: "RS / TU",
        description: "Response / Tumor Identification",
        source: "SDTM.RS"
      },
      {
        step: "Critical Data Field",
        name: "RSDTC",
        description: "Date of Assessment",
        form: "Tumor Assessment (RECIST 1.1)",
        criticality: "High"
      }
    ]
  },
  {
    estimand: "Key Secondary: Overall Survival (OS)",
    definition: "Time from randomization to death from any cause",
    population: "ITT Population",
    derivation: [
      {
        step: "Analysis Variable",
        name: "AVAL",
        description: "Derived OS Time (Months)",
        source: "ADaM.ADOS"
      },
      {
        step: "Source Domain",
        name: "DS / AE",
        description: "Disposition / Adverse Events",
        source: "SDTM.DS"
      },
      {
        step: "Critical Data Field",
        name: "DSSTDTC",
        description: "Date of Death",
        form: "Death Report / End of Study",
        criticality: "High"
      }
    ]
  }
];

export default function CriticalData() {
  const [loading, setLoading] = useState(true);
  
  // Simulate loading
  setTimeout(() => setLoading(false), 1500);

  return (
    <AppShell>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col gap-1">
           <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest font-medium mb-2">
             <Layers className="h-3 w-3" />
             Feature 0
           </div>
           <h1 className="text-3xl font-semibold tracking-tight text-foreground">Critical Data Elements</h1>
           <p className="text-muted-foreground text-sm max-w-2xl">
             Traceable derivation chains from Estimand through Analysis to Source.
             Identified via digitized protocol analysis.
           </p>
        </div>

        <div className="space-y-6">
          {loading ? (
             // Skeleton State
             [1, 2].map((i) => (
               <div key={i} className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
                 <Skeleton height={24} width="40%" />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                   <Skeleton height={120} className="rounded-lg" />
                   <Skeleton height={120} className="rounded-lg" />
                   <Skeleton height={120} className="rounded-lg" />
                 </div>
               </div>
             ))
          ) : (
             criticalElements.map((element, idx) => (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 key={idx} 
                 className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden"
               >
                 {/* Header */}
                 <div className="bg-secondary/20 border-b border-border/60 px-6 py-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-base font-semibold text-foreground">{element.estimand}</h3>
                       <p className="text-sm text-muted-foreground mt-0.5">{element.definition}</p>
                     </div>
                     <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50">
                       {element.population}
                     </span>
                   </div>
                 </div>

                 {/* Derivation Chain */}
                 <div className="p-6">
                   <div className="relative">
                     {/* Connecting Line */}
                     <div className="absolute top-1/2 left-0 right-0 h-px bg-border/60 -translate-y-1/2 hidden md:block" />
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                       {element.derivation.map((step, stepIdx) => (
                         <div key={stepIdx} className="relative group">
                            {/* Card */}
                            <div className={cn(
                              "bg-background border rounded-lg p-4 transition-all duration-300 relative z-10 h-full flex flex-col justify-between",
                              step.criticality === "High" 
                                ? "border-orange-200 bg-orange-50/10 shadow-[0_2px_8px_rgba(249,115,22,0.05)]" 
                                : "border-border/60 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-border"
                            )}>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{step.step}</span>
                                  {step.criticality && (
                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 uppercase tracking-wide">
                                      Critical
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                  {stepIdx === 0 && <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />}
                                  {stepIdx === 1 && <Database className="h-4 w-4 text-muted-foreground" />}
                                  {stepIdx === 2 && <div className="h-4 w-4 rounded-full border-2 border-foreground" />}
                                  <span className="font-mono text-sm font-medium text-foreground">{step.name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-snug">{step.description}</p>
                              </div>
                              
                              <div className="mt-3 pt-3 border-t border-border/40 flex justify-between items-center">
                                <span className="text-xs font-medium text-foreground/80 bg-secondary/50 px-1.5 py-0.5 rounded">
                                  {step.source || step.form}
                                </span>
                              </div>
                            </div>

                            {/* Arrow for desktop */}
                            {stepIdx < 2 && (
                              <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 hidden md:flex items-center justify-center bg-card rounded-full border border-border h-6 w-6 text-muted-foreground shadow-sm">
                                <ChevronRight className="h-3 w-3" />
                              </div>
                            )}
                            
                            {/* Arrow for mobile */}
                            {stepIdx < 2 && (
                              <div className="flex justify-center my-2 md:hidden text-muted-foreground">
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            )}
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </motion.div>
             ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
