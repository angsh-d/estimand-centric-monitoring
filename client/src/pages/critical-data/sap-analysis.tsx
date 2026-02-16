import { useState } from "react";
import { 
  ArrowRight, 
  CheckCircle2, 
  Database, 
  FileText, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  GitBranch, 
  AlertTriangle, 
  Lightbulb, 
  Layers, 
  Activity, 
  Microscope,
  Stethoscope,
  Network
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppleCard, SkeletonLine } from "@/components/criticality/shared";
import { cn } from "@/lib/utils";

// --- Mock Data for the Wizard Steps ---

const ESTIMANDS_DEMO = [
  { id: "E1", tier: "Primary", label: "Overall Survival (OS) in ITT Population", desc: "Hazard Ratio (Stratified Cox PH)", type: "Time-to-Event", status: "Critical" },
  { id: "E2", tier: "Co-Primary", label: "Overall Survival (OS) in LREM Population", desc: "Hazard Ratio (Stratified Cox PH)", type: "Time-to-Event", status: "Critical" },
  { id: "E3", tier: "Secondary", label: "OS in PD-L1 ≥ 50%", desc: "Hazard Ratio", type: "Time-to-Event", status: "Important" },
  { id: "E4", tier: "Secondary", label: "PFS in ITT", desc: "Hazard Ratio", type: "Time-to-Event", status: "Important" },
  { id: "E5", tier: "Secondary", label: "ORR in ITT", desc: "Proportion Difference", type: "Binary", status: "Important" },
  // ... implied 6 others
];

const LINEAGE_PATH_E1 = [
  { id: "E1", label: "Primary Estimand (OS)", type: "estimand" },
  { id: "M1", label: "Cox PH Model", type: "method" },
  { id: "V9", label: "AVAL_OS (Survival Days)", type: "derived" },
  { id: "V7", label: "Death Date", type: "source" },
  { id: "V8", label: "Last Known Alive", type: "source" },
  { id: "V1", label: "Rand Date", type: "source" }
];

const LREM_CHAIN = [
  { stage: "Source Data", items: ["Neutrophils", "Lymphocytes", "Albumin", "LDH", "GGT", "AST"] },
  { stage: "Derived", items: ["V17: Early Mortality Risk Score"] },
  { stage: "Flag", items: ["V18: LREM Flag (Y/N)"] },
  { stage: "Population", items: ["POP3: Low Risk Analysis Set"] },
  { stage: "Estimand", items: ["E2: Co-Primary OS in LREM"] }
];

const CRITICALITY_TIER1 = [
  { id: "SH_RAND", field: "Randomization Date", reason: "Anchor for ALL TTE calculations" },
  { id: "SH_DTH", field: "Death Date", reason: "Event date for primary endpoint" },
  { id: "SH_LSTALV", field: "Last Known Alive", reason: "Censoring date for primary endpoint" },
  { id: "SH_LAB", field: "6 Lab Parameters", reason: "Define LREM population for co-primary" },
  { id: "SH_STRATA", field: "Stratification Factors", reason: "Covariates in primary Cox model" }
];

const GAPS_CONFLICTS = [
  { type: "Conflict", title: "Strata Source Mismatch", desc: "IVRS vs eCRF strata source definition conflict.", severity: "medium" },
  { type: "Gap", title: "Treatment Start Date", desc: "Implied by Safety Population definition but not explicitly defined in SAP.", severity: "low" }
];


export default function SapAnalysis() {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const steps = [
    { id: "intro", title: "Clinical Question" },
    { id: "estimands", title: "Estimand Framework" },
    { id: "lineage", title: "Lineage Trace" },
    { id: "lrem", title: "Complex Derivation" },
    { id: "criticality", title: "Criticality Tiers" },
    { id: "quality", title: "Quality Check" }
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col font-sans antialiased text-[#1d1d1f] bg-[#F5F5F7]">
      
      {/* Progress Header */}
      <div className="px-8 pt-6 pb-6 bg-white border-b border-black/[0.04]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">SAP Analysis</h1>
            <p className="text-[#86868b] text-sm mt-1">Automated Protocol & SAP Extraction</p>
          </div>
          <div className="flex gap-2">
             <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-emerald-100">
               <CheckCircle2 className="h-3.5 w-3.5" /> Extraction Complete (0.4s)
             </span>
          </div>
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
               <div 
                 className={cn(
                   "h-2 w-2 rounded-full transition-all duration-300",
                   i === step ? "bg-black scale-125" : i < step ? "bg-black/40" : "bg-black/10"
                 )}
               />
               {i < steps.length - 1 && <div className={cn("h-[1px] w-8 mx-2", i < step ? "bg-black/20" : "bg-black/5")} />}
            </div>
          ))}
          <div className="ml-4 text-xs font-medium text-black/60 uppercase tracking-wider">
            {steps[step].title}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <AnimatePresence mode="wait">

            {/* STEP 0: CLINICAL QUESTION */}
            {step === 0 && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center pt-12"
              >
                <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                   <Microscope className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-4 max-w-2xl leading-tight">
                  "Does durvalumab improve survival in PD-L1-high NSCLC?"
                </h2>
                <p className="text-lg text-[#86868b] max-w-2xl mb-12 leading-relaxed">
                  The system has ingested the SAP for <strong>PEARL (NCT03003962)</strong>. <br/>
                  A Phase III, randomized, open-label trial with dual co-primary endpoints.
                </p>

                <div className="grid grid-cols-3 gap-6 w-full max-w-3xl text-left">
                   <AppleCard className="p-6 bg-white">
                      <div className="text-xs font-bold text-black/40 uppercase tracking-wider mb-2">Study Phase</div>
                      <div className="text-lg font-medium text-[#1d1d1f]">Phase III</div>
                   </AppleCard>
                   <AppleCard className="p-6 bg-white">
                      <div className="text-xs font-bold text-black/40 uppercase tracking-wider mb-2">Indication</div>
                      <div className="text-lg font-medium text-[#1d1d1f]">NSCLC (PD-L1 High)</div>
                   </AppleCard>
                   <AppleCard className="p-6 bg-white">
                      <div className="text-xs font-bold text-black/40 uppercase tracking-wider mb-2">Design</div>
                      <div className="text-lg font-medium text-[#1d1d1f]">Randomized Open-Label</div>
                   </AppleCard>
                </div>
              </motion.div>
            )}

            {/* STEP 1: ESTIMAND FRAMEWORK */}
            {step === 1 && (
              <motion.div 
                key="estimands"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h2 className="text-2xl font-semibold text-[#1d1d1f]">Estimand Framework</h2>
                      <p className="text-[#86868b] text-sm mt-1">11 estimands extracted, prioritizing the 2 Co-Primary endpoints.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   {ESTIMANDS_DEMO.map((est, i) => (
                      <AppleCard 
                        key={est.id} 
                        className={cn(
                          "p-6 flex items-center justify-between transition-all",
                          est.tier.includes("Primary") ? "border-l-4 border-l-black shadow-md bg-white" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100 bg-[#F9F9FA]"
                        )}
                      >
                         <div className="flex items-center gap-6">
                            <div className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm",
                              est.tier.includes("Primary") ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                            )}>
                               {est.id}
                            </div>
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-base text-[#1d1d1f]">{est.label}</h3>
                                  {est.tier.includes("Primary") && (
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                      {est.tier}
                                    </span>
                                  )}
                               </div>
                               <p className="text-sm text-[#86868b]">{est.desc}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-xs font-medium text-[#1d1d1f] bg-gray-100 px-3 py-1 rounded-full">{est.type}</div>
                         </div>
                      </AppleCard>
                   ))}
                   <div className="text-center text-sm text-[#86868b] pt-4 italic">
                      + 6 additional secondary/exploratory estimands extracted
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: LINEAGE TRACE (Happy Path) */}
            {step === 2 && (
              <motion.div 
                key="lineage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col"
              >
                <div className="mb-8">
                   <h2 className="text-2xl font-semibold text-[#1d1d1f]">Lineage Trace: Primary Endpoint</h2>
                   <p className="text-[#86868b] text-sm mt-1">Tracing E1 (OS ITT) from definition to source data.</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center py-8">
                   <div className="relative flex flex-col items-center gap-8 w-full max-w-2xl">
                      {/* E1 */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                        className="w-full bg-black text-white p-6 rounded-2xl shadow-lg relative z-10"
                      >
                         <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">Target Estimand</div>
                         <div className="text-xl font-semibold">E1: Primary Overall Survival</div>
                         <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                            <div className="h-8 w-[2px] bg-black/20"></div>
                         </div>
                      </motion.div>

                      {/* Arrow */}
                      <motion.div initial={{ height: 0 }} animate={{ height: 32 }} className="w-[2px] bg-black/10" />

                      {/* M1 */}
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="w-3/4 bg-white border border-black/10 p-4 rounded-xl shadow-sm relative z-10 flex items-center gap-4"
                      >
                         <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                            <Activity className="h-5 w-5" />
                         </div>
                         <div>
                            <div className="text-xs font-bold text-black/40 uppercase tracking-wider">Statistical Method</div>
                            <div className="font-medium">M1: Stratified Cox PH Model</div>
                         </div>
                      </motion.div>

                      {/* Arrow */}
                      <motion.div initial={{ height: 0 }} animate={{ height: 32 }} className="w-[2px] bg-black/10" />

                      {/* V9 */}
                      <motion.div 
                         initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                         className="w-3/4 bg-white border border-black/10 p-4 rounded-xl shadow-sm relative z-10 flex items-center gap-4"
                      >
                         <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                            <TrendingUp className="h-5 w-5" />
                         </div>
                         <div>
                            <div className="text-xs font-bold text-black/40 uppercase tracking-wider">Analysis Variable</div>
                            <div className="font-medium">V9: Overall Survival (Days)</div>
                         </div>
                      </motion.div>

                      {/* Arrow */}
                      <motion.div initial={{ height: 0 }} animate={{ height: 32 }} className="w-[2px] bg-black/10" />

                      {/* Leaf Nodes */}
                      <div className="grid grid-cols-3 gap-4 w-full">
                         {["Randomization Date", "Death Date", "Last Known Alive"].map((label, i) => (
                           <motion.div 
                              key={i}
                              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + (i * 0.2) }}
                              className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center"
                           >
                              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Source Data</div>
                              <div className="text-sm font-semibold text-emerald-900">{label}</div>
                           </motion.div>
                         ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: LREM DERIVATION */}
            {step === 3 && (
              <motion.div 
                key="lrem"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-8">
                   <h2 className="text-2xl font-semibold text-[#1d1d1f]">Complex Derivation Chain</h2>
                   <p className="text-[#86868b] text-sm mt-1">E2 (Co-Primary) relies on a 4-level derivation chain (LREM Score).</p>
                </div>

                <div className="bg-[#F9F9FA] rounded-3xl p-8 border border-black/[0.04]">
                   <div className="flex flex-col gap-2">
                      {LREM_CHAIN.map((layer, i) => (
                         <div key={i} className="flex items-center">
                            <div className="w-32 text-right pr-6 py-4">
                               <span className="text-xs font-bold text-black/40 uppercase tracking-wider">{layer.stage}</span>
                            </div>
                            <div className="flex-1 relative pl-6 border-l-2 border-black/10 py-4">
                               <div className={cn(
                                 "absolute -left-[9px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-4 border-[#F9F9FA]",
                                 i === 0 ? "bg-emerald-500" : "bg-black"
                               )} />
                               <div className="flex flex-wrap gap-2">
                                  {layer.items.map((item, j) => (
                                     <span key={j} className={cn(
                                       "px-4 py-2 rounded-lg text-sm font-medium border shadow-sm",
                                       i === 0 ? "bg-white border-emerald-100 text-emerald-800" : 
                                       i === 4 ? "bg-black text-white border-black" :
                                       "bg-white border-black/10 text-[#1d1d1f]"
                                     )}>
                                        {item}
                                     </span>
                                  ))}
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3 text-blue-800 text-sm">
                   <Lightbulb className="h-5 w-5 shrink-0" />
                   <p className="leading-relaxed">
                      <strong>Insight:</strong> If any single baseline lab value (Neutrophils, Lymphocytes, etc.) is missing, 
                      the Risk Score cannot be calculated, excluding the patient from the Co-Primary analysis.
                   </p>
                </div>
              </motion.div>
            )}

            {/* STEP 4: CRITICALITY TIERS */}
            {step === 4 && (
              <motion.div 
                key="criticality"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-8">
                   <h2 className="text-2xl font-semibold text-[#1d1d1f]">Criticality Assignment</h2>
                   <p className="text-[#86868b] text-sm mt-1">Automated Tier 1 classification based on lineage impact.</p>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between px-4 py-2 bg-black/[0.02] rounded-lg border border-black/[0.04]">
                      <span className="text-xs font-bold text-black/40 uppercase tracking-wider">Source Data Field</span>
                      <span className="text-xs font-bold text-black/40 uppercase tracking-wider">Impact Rationale</span>
                   </div>
                   
                   {CRITICALITY_TIER1.map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 rounded-xl border border-black/[0.04] shadow-sm flex items-center justify-between group hover:border-black/10 transition-colors"
                      >
                         <div className="flex items-center gap-4">
                            <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs border border-red-100">T1</div>
                            <div className="font-semibold text-[#1d1d1f]">{item.field}</div>
                         </div>
                         <div className="flex items-center gap-6">
                            <span className="text-sm text-[#86868b]">{item.reason}</span>
                            <div className="h-6 w-px bg-black/10" />
                            <div className="flex items-center gap-2 text-xs font-medium text-black/60">
                               <Layers className="h-3.5 w-3.5" />
                               Mapped to CRF
                            </div>
                         </div>
                      </motion.div>
                   ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: QUALITY CHECK */}
            {step === 5 && (
              <motion.div 
                key="quality"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-8">
                   <h2 className="text-2xl font-semibold text-[#1d1d1f]">Quality Scorecard</h2>
                   <p className="text-[#86868b] text-sm mt-1">Gaps and conflicts identified during extraction.</p>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                   <AppleCard className="p-6 bg-white text-center">
                      <div className="text-3xl font-bold text-[#1d1d1f] mb-1">0.95</div>
                      <div className="text-xs font-bold text-black/40 uppercase tracking-wider">Completeness</div>
                   </AppleCard>
                   <AppleCard className="p-6 bg-white text-center">
                      <div className="text-3xl font-bold text-[#1d1d1f] mb-1">100%</div>
                      <div className="text-xs font-bold text-black/40 uppercase tracking-wider">Resolution</div>
                   </AppleCard>
                   <AppleCard className="p-6 bg-white text-center">
                      <div className="text-3xl font-bold text-[#1d1d1f] mb-1">7/7</div>
                      <div className="text-xs font-bold text-black/40 uppercase tracking-wider">Source Hints</div>
                   </AppleCard>
                </div>

                <div className="space-y-4">
                   {GAPS_CONFLICTS.map((issue, i) => (
                      <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex items-start gap-4">
                         <div className="mt-1">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <h3 className="font-semibold text-amber-900">{issue.title}</h3>
                               <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-wider">
                                 {issue.type}
                               </span>
                            </div>
                            <p className="text-sm text-amber-800/80 leading-relaxed">
                               {issue.desc}
                            </p>
                         </div>
                         <Button variant="outline" size="sm" className="ml-auto bg-white border-amber-200 text-amber-800 hover:bg-amber-100 hover:text-amber-900">
                            Review
                         </Button>
                      </div>
                   ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="px-8 py-6 bg-white border-t border-black/[0.04] flex justify-between items-center shrink-0 z-10">
        <Button 
          variant="ghost" 
          onClick={prevStep} 
          disabled={step === 0}
          className="text-[#86868b] hover:text-[#1d1d1f]"
        >
          Back
        </Button>
        <div className="flex gap-2">
          {step < steps.length - 1 ? (
             <Button onClick={nextStep} className="bg-[#1d1d1f] text-white hover:bg-black/90 px-8 rounded-full">
               Next Step <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
          ) : (
             <Button className="bg-[#34C759] text-white hover:bg-[#34C759]/90 px-8 rounded-full shadow-lg shadow-[#34C759]/20">
               Finalize Analysis <CheckCircle2 className="ml-2 h-4 w-4" />
             </Button>
          )}
        </div>
      </div>

    </div>
  );
}
