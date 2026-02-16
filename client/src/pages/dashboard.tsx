import { useState } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown,
  Layout,
  Target,
  FileText,
  ShieldAlert,
  Zap,
  MoreHorizontal,
  X,
  Clock,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardSkeleton } from "@/components/ui/skeleton-loader";

// --- Mock Data: Estimand-Centric Model ---

const ESTIMANDS = [
  {
    id: "EST-01",
    tier: "Primary",
    name: "Change from Baseline in MADRS Total Score at Week 8",
    status: "warning", // good, warning, critical
    healthScore: 92,
    components: [
      { id: "c1", name: "MADRS Assessment", status: "good", type: "Data Source", isCritical: true },
      { id: "c2", name: "Baseline Definition", status: "good", type: "Derivation", isCritical: true },
      { id: "c3", name: "Visit Windows", status: "warning", count: 3, type: "Logic", isCritical: false },
      { id: "c4", name: "Rescue Medication", status: "critical", count: 1, type: "Intercurrent Event", isCritical: true },
      { id: "c5", name: "Treatment Exposure", status: "good", type: "Variable", isCritical: false }
    ]
  },
  {
    id: "EST-02",
    tier: "Key Secondary",
    name: "MADRS Response Rate (≥50% reduction) at Week 8",
    status: "good",
    healthScore: 98,
    components: [
      { id: "c6", name: "MADRS Assessment", status: "good", type: "Data Source", isCritical: true }, // Shared component
      { id: "c7", name: "Response Logic", status: "good", type: "Derivation", isCritical: false },
      { id: "c8", name: "Dropouts", status: "good", type: "Population", isCritical: false }
    ]
  }
];

const NARRATIVES = {
  "c4": {
    title: "Rescue Medication Misclassification Risk",
    synthesis: "Subject 109-004 at Charité Berlin has a 2-day date discrepancy between EDC and Safety Narrative for a concomitant medication (Lorazepam).",
    impact: "This creates ambiguity in the Intercurrent Event classification. If the earlier date (Jan 12) is correct, this qualifies as 'Rescue Medication' and triggers a composite failure for the Primary Estimand. If the later date (Jan 14) is correct, it remains a standard concomitant med with no estimand impact.",
    recommendation: "Query site 109 immediately to reconcile start dates. Prioritize EDC correction if Safety Narrative is source-verified.",
    signals: ["SIG-991", "SIG-992"],
    criticalDataContext: "Lorazepam Start Date (CM.CMSTDTC) is a Tier 1 Critical Data Element."
  },
  "c3": {
    title: "Visit Window Compliance Drift",
    synthesis: "Emerging trend at Site 331 (Univ. of Tokyo) showing systematic late scheduling for Week 4 visits.",
    impact: "3 subjects have fallen outside the ±3 day window. While currently handled by the MMRM model, continued drift risks pushing subjects into 'Missing Data' classification for the primary endpoint at Week 8 if patterns persist.",
    recommendation: "Contact Site Monitor to retrain study coordinator on scheduling windows. No data exclusions required yet.",
    signals: ["SIG-801", "SIG-802", "SIG-803"],
    criticalDataContext: "Visit Date (SV.SVSTDTC) impacts analysis population assignment."
  }
};

const SIGNAL_QUEUE = [
  {
    id: "SIG-991",
    category: "Primary Estimand Threat",
    title: "Conmed Date Mismatch (Lorazepam)",
    site: "109 - Charité Berlin",
    subject: "109-004",
    severity: "critical",
    age: "2h",
    status: "Open",
    isCriticalData: true
  },
  {
    id: "SIG-801",
    category: "Primary Estimand Threat",
    title: "Week 4 Window Deviation",
    site: "331 - Univ. of Tokyo",
    subject: "331-012",
    severity: "warning",
    age: "1d",
    status: "Investigating",
    isCriticalData: true
  },
  {
    id: "SIG-802",
    category: "Primary Estimand Threat",
    title: "Week 4 Window Deviation",
    site: "331 - Univ. of Tokyo",
    subject: "331-015",
    severity: "warning",
    age: "1d",
    status: "Open",
    isCriticalData: true
  },
  {
    id: "SIG-771",
    category: "Safety Signal",
    title: "Potential SAE Under-reporting",
    site: "402 - Mass General",
    subject: "402-011",
    severity: "critical",
    age: "5h",
    status: "Open",
    isCriticalData: true
  },
  {
    id: "SIG-605",
    category: "Operational",
    title: "Query Aging > 14 Days",
    site: "205 - Gustave Roussy",
    subject: "N/A",
    severity: "info",
    age: "3d",
    status: "Open",
    isCriticalData: false
  }
];

// --- Components ---

const StatusDot = ({ status, className }: { status: string, className?: string }) => (
  <div className={cn("h-2 w-2 rounded-full ring-2 ring-white", 
    status === 'critical' ? "bg-black" : 
    status === 'warning' ? "bg-gray-400" : 
    "bg-gray-200", // "good" is now subtle grey
    className
  )} />
);

const AppleCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div onClick={onClick} className={cn("bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-black/[0.04] overflow-hidden", className)}>
    {children}
  </div>
);

// --- Main Page ---

export default function SignalDashboard() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate initial load
  setTimeout(() => setLoading(false), 1000);

  const activeNarrative = selectedComponent ? NARRATIVES[selectedComponent as keyof typeof NARRATIVES] : null;

  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] overflow-hidden font-sans text-[#1d1d1f]">
      
      {/* Header */}
      <div className="px-8 pt-8 pb-6 shrink-0">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="px-2 py-0.5 rounded-full bg-black/[0.04] border border-black/[0.02] text-[10px] font-bold text-black/60 uppercase tracking-wider">
                 Estimand-Centric Monitoring
               </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-black">Signal Dashboard</h1>
            <p className="text-black/50 text-sm mt-1 max-w-2xl font-medium">
              Monitoring structured by study objectives.
            </p>
          </div>
          
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="bg-white border-black/10 rounded-full text-xs font-medium h-8 text-black/70 hover:text-black">
               <Filter className="h-3.5 w-3.5 mr-2" /> Filter View
             </Button>
             <Button variant="default" size="sm" className="bg-black text-white hover:bg-black/80 rounded-full text-xs font-medium h-8 shadow-lg">
               <FileText className="h-3.5 w-3.5 mr-2" /> Generate Report
             </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-8 scroll-smooth">
        
        {/* LAYER 1: ESTIMAND HEALTH (Strategic View) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <Target className="h-4 w-4 text-black/40" />
             <h2 className="text-sm font-semibold text-black/60 uppercase tracking-wide">Layer 1: Estimand Health</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
               <div className="col-span-2 space-y-4">
                 <CardSkeleton className="h-48 rounded-2xl" />
                 <CardSkeleton className="h-48 rounded-2xl" />
               </div>
            ) : (
              ESTIMANDS.map((est) => (
                <AppleCard key={est.id} className="p-6 relative group transition-all hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)]">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full">{est.tier}</span>
                            {est.status !== 'good' && (
                               <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" /> Integrity Risk
                               </span>
                            )}
                         </div>
                         <h3 className="text-lg font-semibold text-black leading-tight max-w-md">{est.name}</h3>
                      </div>
                      <div className="text-right">
                         <div className="text-3xl font-bold tracking-tight text-black">{est.healthScore}%</div>
                         <div className="text-[10px] font-medium text-black/40 uppercase tracking-wider">Health Score</div>
                      </div>
                   </div>

                   {/* Derivation Chain Visualizer */}
                   <div className="relative">
                      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/[0.06] -z-10" />
                      <div className="flex justify-between items-center relative z-0">
                         {est.components.map((comp, i) => (
                            <div key={comp.id} className="flex flex-col items-center group/node cursor-pointer" onClick={() => setSelectedComponent(comp.id)}>
                               <div className={cn(
                                  "h-3 w-3 rounded-full border-2 transition-all duration-300 relative z-10",
                                  selectedComponent === comp.id ? "scale-150 ring-4 ring-black/[0.05]" : "group-hover/node:scale-125",
                                  comp.status === 'critical' ? "bg-black border-black" :
                                  comp.status === 'warning' ? "bg-gray-400 border-gray-400" :
                                  "bg-white border-gray-300"
                               )}>
                                  {/* Notification Dot for Issues */}
                                  {(comp.status === 'warning' || comp.status === 'critical') && (
                                     <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-white border border-black/[0.1] shadow-sm flex items-center justify-center text-[9px] font-bold text-black">
                                        {comp.count}
                                     </div>
                                  )}
                               </div>
                               <div className="mt-3 text-center">
                                  <div className={cn("text-[10px] font-semibold transition-colors flex flex-col items-center gap-0.5", 
                                     selectedComponent === comp.id ? "text-black" : "text-black/60"
                                  )}>
                                    {comp.name}
                                    {comp.isCritical && (
                                      <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-100">CDE</span>
                                    )}
                                  </div>
                                  <div className="text-[9px] text-black/30 font-medium opacity-0 group-hover/node:opacity-100 transition-opacity absolute w-24 left-1/2 -translate-x-1/2 mt-0.5">
                                     {comp.type}
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </AppleCard>
              ))
            )}
          </div>
        </section>

        {/* LAYER 2: THREAT NARRATIVES (Investigation View) */}
        <AnimatePresence>
          {selectedComponent && activeNarrative && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
               <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-black/40" />
                  <h2 className="text-sm font-semibold text-black/60 uppercase tracking-wide">Layer 2: AI Threat Synthesis</h2>
               </div>

               <div className="bg-white rounded-2xl border border-black/[0.04] shadow-lg shadow-black/[0.02] overflow-hidden flex flex-col md:flex-row">
                  <div className="flex-1 p-8">
                     <div className="flex items-start justify-between mb-6">
                        <div>
                           <div className="flex items-center gap-2 mb-2">
                              <span className="h-2 w-2 rounded-full bg-black animate-pulse" />
                              <span className="text-xs font-bold text-black/50 uppercase tracking-wider">Live Investigation</span>
                           </div>
                           <h3 className="text-2xl font-semibold text-black mb-2">{activeNarrative.title}</h3>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedComponent(null)} className="text-black/40 hover:text-black">
                           <X className="h-5 w-5" />
                        </Button>
                     </div>

                     <div className="space-y-6">
                        <div>
                           <h4 className="text-xs font-bold text-black/40 uppercase tracking-wider mb-2">Narrative Synthesis</h4>
                           <p className="text-base text-black/80 leading-relaxed font-normal">
                              {activeNarrative.synthesis}
                           </p>
                        </div>
                        
                        <div className="p-4 bg-[#F5F5F7] rounded-xl border border-black/[0.02]">
                           <h4 className="text-xs font-bold text-black/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                              <Target className="h-3 w-3" /> Estimand Impact
                           </h4>
                           <p className="text-sm text-black/70 leading-relaxed mb-3">
                              {activeNarrative.impact}
                           </p>
                           {activeNarrative.criticalDataContext && (
                             <div className="flex items-start gap-2 text-[11px] bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 text-emerald-800">
                               <ShieldAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                               <span className="font-medium">{activeNarrative.criticalDataContext}</span>
                             </div>
                           )}
                        </div>

                        <div>
                           <h4 className="text-xs font-bold text-black/40 uppercase tracking-wider mb-2">Recommended Action</h4>
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                                 <Zap className="h-4 w-4" />
                              </div>
                              <p className="text-sm text-black font-medium">{activeNarrative.recommendation}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="w-full md:w-80 bg-[#F9F9FA] border-l border-black/[0.04] p-6 flex flex-col gap-4">
                     <h4 className="text-xs font-bold text-black/40 uppercase tracking-wider">Contributing Signals</h4>
                     {activeNarrative.signals.map(sigId => {
                        const sig = SIGNAL_QUEUE.find(s => s.id === sigId);
                        if (!sig) return null;
                        return (
                           <div key={sig.id} className="bg-white p-3 rounded-xl border border-black/[0.04] shadow-sm">
                              <div className="flex justify-between items-start mb-1">
                                 <span className="text-[10px] font-bold text-black/40">{sig.id}</span>
                                 <span className="text-[10px] font-medium text-black bg-black/[0.05] px-1.5 py-0.5 rounded">{sig.site.split(' - ')[0]}</span>
                              </div>
                              <div className="text-xs font-semibold text-black mb-1">{sig.title}</div>
                              <div className="text-[10px] text-black/60">{sig.subject}</div>
                           </div>
                        )
                     })}
                     <Button variant="outline" className="mt-auto w-full bg-white border-black/10 text-xs font-medium">
                        View Full Evidence Package
                     </Button>
                  </div>
               </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* LAYER 3: SIGNAL QUEUE (Operational View) */}
        <section>
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="h-4 w-4 text-black/40" />
                 <h2 className="text-sm font-semibold text-black/60 uppercase tracking-wide">Layer 3: Signal Queue</h2>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-black/40 bg-white px-3 py-1 rounded-full border border-black/[0.04] shadow-sm">
                 <Clock className="h-3 w-3" /> Sorted by Estimand Risk
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-black/[0.04] shadow-sm overflow-hidden">
              <div className="grid grid-cols-[1fr_1.5fr_1fr_100px_100px_50px] gap-4 p-4 border-b border-black/[0.04] bg-[#FAFAFA] text-[10px] font-bold text-black/40 uppercase tracking-wider">
                 <div>Category / Impact</div>
                 <div>Signal Narrative</div>
                 <div>Site / Subject</div>
                 <div>Created</div>
                 <div>Status</div>
                 <div></div>
              </div>
              
              <div className="divide-y divide-black/[0.04]">
                 {loading ? (
                    <div className="p-8 text-center text-sm text-black/40">Loading signals...</div>
                 ) : (
                    SIGNAL_QUEUE.map((signal, i) => (
                       <motion.div 
                          key={signal.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="grid grid-cols-[1fr_1.5fr_1fr_100px_100px_50px] gap-4 p-4 items-center hover:bg-[#F5F5F7] transition-colors group cursor-pointer"
                       >
                          <div>
                             <div className="flex items-center gap-2">
                                {signal.severity === 'critical' && <div className="h-1.5 w-1.5 rounded-full bg-black shrink-0" />}
                                {signal.severity === 'warning' && <div className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" />}
                                {signal.severity === 'info' && <div className="h-1.5 w-1.5 rounded-full bg-gray-200 shrink-0" />}
                                <span className={cn(
                                   "text-xs font-semibold",
                                   signal.severity === 'critical' ? "text-black" : "text-black/60"
                                )}>{signal.category}</span>
                             </div>
                             {signal.isCriticalData && (
                               <div className="ml-3.5 mt-1 text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                                 <Zap className="h-2.5 w-2.5" /> Critical Data
                               </div>
                             )}
                          </div>
                          <div>
                             <div className="text-sm font-medium text-black mb-0.5">{signal.title}</div>
                             <div className="text-[10px] text-black/40 font-mono">{signal.id}</div>
                          </div>
                          <div>
                             <div className="text-xs text-black/80">{signal.site}</div>
                             <div className="text-[10px] text-black/40 font-medium">{signal.subject}</div>
                          </div>
                          <div className="text-xs text-black/50">{signal.age} ago</div>
                          <div>
                             <Badge variant="secondary" className="bg-white border-black/10 text-black/60 font-medium text-[10px] h-6 px-2.5">
                                {signal.status}
                             </Badge>
                          </div>
                          <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-black/40 hover:text-black">
                                <MoreHorizontal className="h-4 w-4" />
                             </Button>
                          </div>
                       </motion.div>
                    ))
                 )}
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}
