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
  Network,
  ChevronDown,
  ChevronRight,
  UploadCloud,
  Sparkles,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppleCard, SkeletonLine } from "@/components/criticality/shared";
import { cn } from "@/lib/utils";

// --- Mock Data for the Wizard Steps ---

const ESTIMANDS_DEMO = [
  { id: "E1", tier: "Primary", label: "Overall Survival (OS) in ITT Population", desc: "Hazard Ratio (Stratified Cox PH)", type: "Time-to-Event", status: "Critical" },
  { id: "E2", tier: "Co-Primary", label: "Overall Survival (OS) in LREM Population", desc: "Hazard Ratio (Stratified Cox PH)", type: "Time-to-Event", status: "Critical" },
  { id: "E5", tier: "Secondary", label: "Progression-Free Survival (PFS) in ITT", desc: "Hazard Ratio (Stratified Cox PH)", type: "Time-to-Event", status: "Important" },
  { id: "E13", tier: "Secondary", label: "PRO Global Health Status (Change from Baseline)", desc: "MMRM Difference in LS Means", type: "Continuous", status: "Important" },
  { id: "E3", tier: "Secondary", label: "OS in PD-L1 ≥ 50%", desc: "Hazard Ratio", type: "Time-to-Event", status: "Important" },
  { id: "E4", tier: "Secondary", label: "OS in PD-L1 ≥ 50% LREM", desc: "Hazard Ratio", type: "Time-to-Event", status: "Important" },
];

const LINEAGE_PATH_E1 = [
  { id: "E1", label: "Primary Estimand (OS)", type: "estimand" },
  { id: "M1", label: "Cox PH Model", type: "method" },
  { id: "V9", label: "AVAL_OS (Survival Days)", type: "derived" },
  { id: "V7", label: "Death Date", type: "source" },
  { id: "V8", label: "Last Known Alive", type: "source" },
  { id: "V1", label: "Rand Date", type: "source" }
];

const COMPLEX_DERIVATION_E1 = [
  { stage: "Source Data", items: ["Date of Randomization", "Date of Death", "Date Last Known Alive"] },
  { stage: "Derived", items: ["V9: Overall Survival Duration (Days)"] },
  { stage: "Censoring", items: ["Censor Flag (0=Event, 1=Censored)"] },
  { stage: "Population", items: ["POP1: ITT Population"] },
  { stage: "Estimand", items: ["E1: Primary OS in ITT"] }
];

const COMPLEX_DERIVATION_E2 = [
  { stage: "Source Data", items: ["Neutrophils", "Lymphocytes", "Albumin", "LDH", "GGT", "AST"] },
  { stage: "Derived", items: ["V17: Early Mortality Risk Score"] },
  { stage: "Flag", items: ["V18: LREM Flag (Y/N)"] },
  { stage: "Population", items: ["POP3: Low Risk Analysis Set"] },
  { stage: "Estimand", items: ["E2: Co-Primary OS in LREM"] }
];

const CRITICALITY_GROUPS = [
  {
    tier: "Tier 1: Critical (Primary Endpoints)",
    items: [
      { id: "SH_RAND", field: "Randomization Date", varName: "DS.DSSTDTC", reason: "Anchor for ALL TTE calculations", estimand: "E1, E2, E5" },
      { id: "SH_DTH", field: "Death Date", varName: "DS.DSSTDTC / AE.AESTDTC", reason: "Event date for primary endpoint", estimand: "E1, E2" },
      { id: "SH_LSTALV", field: "Last Known Alive", varName: "ADSL.LSTALVDT", reason: "Censoring date for primary endpoint", estimand: "E1" },
      { 
        id: "SH_LAB", 
        field: "6 Lab Parameters", 
        varName: "LB.LBORRES", 
        reason: "Define LREM population for co-primary", 
        estimand: "E2",
        subItems: [
          { field: "Neutrophils", varName: "LB.LBORRES WHERE TESTCD='NEUT'" },
          { field: "Lymphocytes", varName: "LB.LBORRES WHERE TESTCD='LYM'" },
          { field: "Albumin", varName: "LB.LBORRES WHERE TESTCD='ALB'" },
          { field: "LDH", varName: "LB.LBORRES WHERE TESTCD='LDH'" },
          { field: "GGT", varName: "LB.LBORRES WHERE TESTCD='GGT'" },
          { field: "AST", varName: "LB.LBORRES WHERE TESTCD='AST'" }
        ]
      }
    ]
  },
  {
    tier: "Tier 2: Important (Secondary Endpoints)",
    items: [
      { id: "SH_PROG", field: "Progression Date", varName: "RS.RSDTC", reason: "Event date for secondary PFS", estimand: "E5" },
      { id: "SH_LSTASS", field: "Last Assessment Date", varName: "RS.RSDTC (Last Evaluated)", reason: "Censoring date for PFS", estimand: "E5" },
      { 
        id: "SH_PRO", 
        field: "Q29/Q30 Scores", 
        varName: "QS.QSORRES", 
        reason: "Source for PRO Global Health", 
        estimand: "E13",
        subItems: [
          { field: "Q29: Overall Health", varName: "QS.QSORRES WHERE QSTESTCD='QLQ30_29'" },
          { field: "Q30: Quality of Life", varName: "QS.QSORRES WHERE QSTESTCD='QLQ30_30'" }
        ]
      },
      { id: "SH_PDL1", field: "PD-L1 Status", varName: "LB.LBORRES / SC.SCTESTCD", reason: "Stratification & Subgroup Analysis", estimand: "E3, E4" }
    ]
  },
  {
    tier: "Tier 3: Supporting (Safety/Exploratory)",
    items: [
      { id: "SH_AE", field: "Adverse Events", varName: "AE.AETERM", reason: "Safety monitoring", estimand: "Safety" },
      { id: "SH_CONMED", field: "Concomitant Meds", varName: "CM.CMTRT", reason: "Safety monitoring", estimand: "Safety" }
    ]
  }
];

const GAPS_CONFLICTS = [
  { type: "Conflict", title: "Strata Source Mismatch", desc: "IVRS vs eCRF strata source definition conflict.", severity: "medium" },
  { type: "Gap", title: "Treatment Start Date", desc: "Implied by Safety Population definition but not explicitly defined in SAP.", severity: "low" }
];


const LINEAGE_PATH_E2 = [
  { id: "E2", label: "Co-Primary Estimand (OS in LREM)", type: "estimand" },
  { id: "M2", label: "Cox PH Model (LREM Subset)", type: "method" },
  { id: "POP3", label: "LREM Population", type: "derived" },
  { id: "V18", label: "LREM Flag (Y/N)", type: "derived" },
  { id: "V17", label: "Risk Score", type: "derived" },
  // Lab parameters handled in rendering to show as leaf nodes
];

const LINEAGE_PATH_E5 = [
  { id: "E5", label: "Secondary Estimand (PFS)", type: "estimand" },
  { id: "M8", label: "PFS Analysis (Cox PH)", type: "method" },
  { id: "V7", label: "PFS Time (Days)", type: "derived" },
  { id: "V8", label: "PFS Event Date", type: "derived" },
  { id: "V10", label: "Progression Date", type: "source" },
  { id: "V11", label: "Last Assessment", type: "source" }
];

const LINEAGE_PATH_E13 = [
  { id: "E13", label: "Secondary Estimand (PRO)", type: "estimand" },
  { id: "M16", label: "MMRM Model", type: "method" },
  { id: "V35", label: "Global Health Score", type: "derived" },
  { id: "QS", label: "EORTC QLQ-C30", type: "source" },
  { id: "I29", label: "Item 29", type: "source" },
  { id: "I30", label: "Item 30", type: "source" }
];

const COMPLEX_DERIVATION_E5 = [
  { stage: "Source Data", items: ["Date of Randomization", "Date of Progression (RECIST)", "Date of Death"] },
  { stage: "Derived", items: ["V7: PFS Duration (Days)", "V8: Event Date"] },
  { stage: "Censoring", items: ["Censor Flag (Event vs Censored)"] },
  { stage: "Population", items: ["POP1: ITT Population"] },
  { stage: "Estimand", items: ["E5: Secondary PFS in ITT"] }
];

const COMPLEX_DERIVATION_E13 = [
  { stage: "Source Data", items: ["EORTC QLQ-C30 Item 29", "EORTC QLQ-C30 Item 30"] },
  { stage: "Derived", items: ["Raw Score (Mean of I29, I30)", "Linear Transformation (0-100 Scale)"] },
  { stage: "Analysis", items: ["Change from Baseline (CFB)"] },
  { stage: "Model", items: ["MMRM (Mixed Models for Repeated Measures)"] },
  { stage: "Estimand", items: ["E13: PRO Global Health Status"] }
];

import { useLocation } from "wouter";

export default function SapAnalysis() {
  const [_, setLocation] = useLocation();
  const [view, setView] = useState<"upload" | "processing" | "analysis">("upload");
  const [step, setStep] = useState(0);
  const [processingStage, setProcessingStage] = useState(0);
  const [selectedLineage, setSelectedLineage] = useState<string>("E1");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setView("processing");
      
      // Simulate processing
      const interval = setInterval(() => {
        setProcessingStage(prev => (prev < 3 ? prev + 1 : prev));
      }, 1200);
      
      setTimeout(() => {
        clearInterval(interval);
        setView("analysis");
      }, 5000);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  // Helper to get lineage path based on selection
  const getLineagePath = (id: string) => {
    switch(id) {
      case "E1": return LINEAGE_PATH_E1;
      case "E2": return LINEAGE_PATH_E2;
      case "E5": return LINEAGE_PATH_E5;
      case "E13": return LINEAGE_PATH_E13;
      // Fallback for E3, E4 or others to E1 structure but with updated labels if needed
      // For now, we'll map E3/E4 to a generic structure or reuse E1 as they are similar OS endpoints
      case "E3": return [
        { id: "E3", label: "Secondary Estimand (OS PD-L1>=50%)", type: "estimand" },
        { id: "M1", label: "Cox PH Model", type: "method" },
        { id: "V9", label: "AVAL_OS (Survival Days)", type: "derived" },
        { id: "V7", label: "Death Date", type: "source" },
        { id: "V8", label: "Last Known Alive", type: "source" },
        { id: "V1", label: "Rand Date", type: "source" }
      ];
      case "E4": return [
         { id: "E4", label: "Secondary Estimand (OS PD-L1>=50% LREM)", type: "estimand" },
         { id: "M2", label: "Cox PH Model (LREM)", type: "method" },
         { id: "POP3", label: "LREM Population", type: "derived" },
         { id: "V18", label: "LREM Flag (Y/N)", type: "derived" },
         { id: "V17", label: "Risk Score", type: "derived" },
      ];
      default: return LINEAGE_PATH_E1;
    }
  };

  const getComplexDerivation = (id: string) => {
    switch(id) {
      case "E1": return COMPLEX_DERIVATION_E1;
      case "E2": return COMPLEX_DERIVATION_E2;
      case "E5": return COMPLEX_DERIVATION_E5;
      case "E13": return COMPLEX_DERIVATION_E13;
      case "E3": return COMPLEX_DERIVATION_E1; // Similar to E1
      case "E4": return COMPLEX_DERIVATION_E2; // Similar to E2
      default: return COMPLEX_DERIVATION_E1;
    }
  };

  const lineagePath = getLineagePath(selectedLineage);
  const complexDerivation = getComplexDerivation(selectedLineage);

  const steps = [
    { id: "intro", title: "Clinical Question" },
    { id: "estimands", title: "Estimand Framework" },
    { id: "lineage", title: "Lineage Trace" },
    { id: "lrem", title: "Complex Derivation" },
    { id: "criticality", title: "Criticality Tiers" }
  ];

  if (view === "upload") {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center font-sans antialiased text-[#1d1d1f] bg-[#F5F5F7]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/5 text-black/60 text-[11px] font-medium uppercase tracking-wide mb-8 shadow-sm">
            <Sparkles className="h-3 w-3 text-blue-500" />
            Intelligent Study Design
          </div>
          <h1 className="text-5xl font-semibold text-[#1d1d1f] tracking-tight mb-4">SAP Analysis</h1>
          <p className="text-[#86868b] text-xl max-w-xl mx-auto font-light leading-relaxed">
            Upload your Statistical Analysis Plan to extract estimands and derivations.
          </p>
        </motion.div>
        
        <div 
          className="group relative cursor-pointer" 
          onClick={() => document.getElementById('sap-upload')?.click()}
        >
          <input 
            type="file" 
            id="sap-upload" 
            className="hidden" 
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />
          <AppleCard className="relative p-16 flex flex-col items-center justify-center text-center w-[540px] h-[360px] border border-black/[0.04] shadow-2xl shadow-black/[0.03]">
             <div className="h-16 w-16 bg-[#F5F5F7] text-black/40 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 group-hover:text-black transition-all duration-500">
               <UploadCloud className="h-8 w-8 stroke-[1.5]" />
             </div>
             <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Upload SAP</h3>
             <p className="text-[#86868b] mb-10 text-sm">PDF or Word document • Max 50MB</p>
             <Button className="bg-[#1d1d1f] text-white hover:bg-black/80 w-48 rounded-full h-11 text-sm font-medium shadow-lg transition-all hover:scale-[1.02]">
               Select Document
             </Button>
          </AppleCard>
        </div>
      </div>
    );
  }

  if (view === "processing") {
    return (
       <div className="h-[calc(100vh-140px)] flex items-center justify-center font-sans antialiased text-[#1d1d1f] bg-[#F5F5F7]">
         <div className="flex flex-col items-center max-w-sm w-full">
            <div className="relative mb-12">
               <div className="h-16 w-16 rounded-full border-[3px] border-black/5 border-t-black animate-spin" />
            </div>
            <h2 className="text-xl font-medium text-[#1d1d1f] mb-8">Analyzing SAP</h2>
            <div className="w-full space-y-5">
               {["Parsing document structure", "Extracting Estimands", "Mapping Derivations", "Identifying Critical Data"].map((label, i) => (
                 <div 
                    key={i} 
                    className={cn(
                        "flex items-center gap-4 text-sm transition-all duration-700",
                        i > processingStage ? "opacity-40 translate-y-1" : "opacity-100 translate-y-0"
                    )}
                 >
                    <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center shadow-sm transition-all duration-500 border",
                        i <= processingStage 
                            ? "bg-black border-black" 
                            : "bg-white border-black/10"
                    )}>
                      <Check className={cn(
                          "h-3 w-3 text-white stroke-[3] transition-all duration-500", 
                          i <= processingStage ? "scale-100 opacity-100" : "scale-50 opacity-0"
                      )} />
                    </div>
                    <span className={cn(
                        "font-medium transition-colors duration-500",
                        i <= processingStage ? "text-[#1d1d1f]" : "text-[#1d1d1f]/60"
                    )}>{label}</span>
                 </div>
               ))}
            </div>
         </div>
       </div>
    );
  }

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
                          (est.tier.includes("Primary") || est.tier.includes("Secondary")) ? "border-l-4 border-l-black shadow-md bg-white" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100 bg-[#F9F9FA]"
                        )}
                      >
                         <div className="flex items-center gap-6">
                            <div className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm",
                              est.tier.includes("Primary") ? "bg-black text-white" : "bg-gray-200 text-gray-700"
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
                                  {est.tier.includes("Secondary") && (
                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
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
                <div className="mb-8 flex justify-between items-end">
                   <div>
                      <h2 className="text-2xl font-semibold text-[#1d1d1f]">Lineage Trace</h2>
                      <p className="text-[#86868b] text-sm mt-1">Tracing {selectedLineage} endpoint from definition to source data.</p>
                   </div>
                   <div className="flex bg-gray-100 p-1 rounded-lg">
                      {ESTIMANDS_DEMO.map((est) => (
                        <button 
                          key={est.id}
                          onClick={() => setSelectedLineage(est.id as any)}
                          className={cn(
                            "px-4 py-1.5 rounded-md text-xs font-semibold transition-all", 
                            selectedLineage === est.id ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"
                          )}
                        >
                          {est.id}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center py-8">
                   <div className="relative flex flex-col items-center gap-8 w-full max-w-2xl">
                      {/* Estimand Node */}
                      <motion.div 
                        key={lineagePath[0].id}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                        className="w-full bg-black text-white p-6 rounded-2xl shadow-lg relative z-10"
                      >
                         <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">Target Estimand</div>
                         <div className="text-xl font-semibold">{lineagePath[0].label}</div>
                         <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                            <div className="h-8 w-[2px] bg-black/20"></div>
                         </div>
                      </motion.div>

                      {/* Arrow */}
                      <motion.div initial={{ height: 0 }} animate={{ height: 32 }} className="w-[2px] bg-black/10" />

                      {/* Method Node */}
                      <motion.div 
                        key={lineagePath[1].id}
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="w-3/4 bg-white border border-black/10 p-4 rounded-xl shadow-sm relative z-10 flex items-center gap-4"
                      >
                         <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                            <Activity className="h-5 w-5" />
                         </div>
                         <div>
                            <div className="text-xs font-bold text-black/40 uppercase tracking-wider">Statistical Method</div>
                            <div className="font-medium">{lineagePath[1].label}</div>
                         </div>
                      </motion.div>

                      {/* Arrow */}
                      <motion.div initial={{ height: 0 }} animate={{ height: 32 }} className="w-[2px] bg-black/10" />

                      {/* Derived Variable/Pop Node */}
                      <motion.div 
                         key={lineagePath[2].id}
                         initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                         className="w-3/4 bg-white border border-black/10 p-4 rounded-xl shadow-sm relative z-10 flex items-center gap-4"
                      >
                         <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                            <TrendingUp className="h-5 w-5" />
                         </div>
                         <div>
                            <div className="text-xs font-bold text-black/40 uppercase tracking-wider">Analysis Variable</div>
                            <div className="font-medium">{lineagePath[2].label}</div>
                         </div>
                      </motion.div>

                      {/* Arrow */}
                      <motion.div initial={{ height: 0 }} animate={{ height: 32 }} className="w-[2px] bg-black/10" />

                      {/* Leaf Nodes */}
                      <div className={cn("grid gap-4 w-full", selectedLineage === "E2" ? "grid-cols-3" : "grid-cols-3")}>
                         {(
                           selectedLineage === "E1" || selectedLineage === "E3" ? ["Randomization Date", "Death Date", "Last Known Alive"] :
                           selectedLineage === "E2" || selectedLineage === "E4" ? ["Neutrophils", "Lymphocytes", "Albumin", "LDH", "GGT", "AST"] :
                           selectedLineage === "E5" ? ["Progression Date", "Last Assessment", "Death Date"] :
                           ["Q29: Overall Health (1-7)", "Q30: Quality of Life (1-7)"]
                         ).map((label, i) => (
                             <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + (i * 0.1) }}
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

            {/* STEP 3: COMPLEX DERIVATION */}
            {step === 3 && (
              <motion.div 
                key="lrem"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-8 flex justify-between items-end">
                   <div>
                      <h2 className="text-2xl font-semibold text-[#1d1d1f]">Complex Derivation Chain</h2>
                      <p className="text-[#86868b] text-sm mt-1">
                        {selectedLineage === "E1" 
                          ? "E1 (Primary) relies on standard time-to-event derivation (Survival Days)." 
                          : selectedLineage === "E2"
                          ? "E2 (Co-Primary) relies on a 4-level derivation chain (LREM Score)."
                          : selectedLineage === "E5"
                          ? "E5 (Secondary) relies on independent radiology review (RECIST 1.1)."
                          : "E13 (Secondary) relies on mixed models for repeated measures (MMRM)."
                        }
                      </p>
                   </div>
                   <div className="flex bg-gray-100 p-1 rounded-lg">
                      {ESTIMANDS_DEMO.map((est) => (
                        <button 
                          key={est.id}
                          onClick={() => setSelectedLineage(est.id as any)}
                          className={cn(
                            "px-4 py-1.5 rounded-md text-xs font-semibold transition-all", 
                            selectedLineage === est.id ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"
                          )}
                        >
                          {est.id}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="bg-[#F9F9FA] rounded-3xl p-8 border border-black/[0.04]">
                   <div className="flex flex-col gap-2">
                      {complexDerivation.map((layer, i) => (
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
                      {selectedLineage === "E1" ? (
                        <>
                          <strong>Insight:</strong> Censor Date derivation logic varies based on outcome: Lost to Follow-up (Last Known Alive) vs. Study End (Cutoff Date) vs. Withdrawal (Withdrawal Date).
                        </>
                      ) : selectedLineage === "E2" ? (
                        <>
                          <strong>Insight:</strong> If any single baseline lab value (Neutrophils, Lymphocytes, etc.) is missing, 
                          the Risk Score cannot be calculated, excluding the patient from the Co-Primary analysis.
                        </>
                      ) : selectedLineage === "E5" ? (
                        <>
                          <strong>Insight:</strong> Progression Date must be the earliest of: objective radiological progression or death from any cause. Requires adjudication.
                        </>
                      ) : (
                        <>
                          <strong>Insight:</strong> Missing data handling in MMRM assumes missing at random (MAR). Patterns of missingness in QLQ-C30 should be monitored.
                        </>
                      )}
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
                   <p className="text-[#86868b] text-sm mt-1">Automated Tier classification based on lineage impact across all estimands.</p>
                </div>

                <div className="space-y-8">
                   {CRITICALITY_GROUPS.map((group, groupIndex) => (
                     <div key={groupIndex} className="space-y-4">
                       <h3 className={cn(
                         "text-sm font-bold uppercase tracking-wider px-1",
                         groupIndex === 0 ? "text-red-600" : 
                         groupIndex === 1 ? "text-amber-600" : 
                         "text-blue-600"
                       )}>
                         {group.tier}
                       </h3>
                       
                       <div className="bg-white rounded-xl border border-black/[0.04] shadow-sm overflow-hidden">
                          <div className="grid grid-cols-[2fr_1.5fr_2fr_1fr] px-5 py-3 bg-black/[0.02] border-b border-black/[0.04] text-xs font-bold text-black/40 uppercase tracking-wider">
                             <div>Source Data Field</div>
                             <div>Variable Name</div>
                             <div>Impact Rationale</div>
                             <div className="text-right">Estimand(s)</div>
                          </div>

                          {group.items.map((item, i) => (
                             <div key={i}>
                               <motion.div 
                                 initial={{ opacity: 0, x: -10 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: i * 0.05 + (groupIndex * 0.2) }}
                                 className={cn(
                                   "px-5 py-4 grid grid-cols-[2fr_1.5fr_2fr_1fr] items-center hover:bg-black/[0.01] transition-colors border-b last:border-0 border-black/[0.04]",
                                   item.subItems && "cursor-pointer"
                                 )}
                                 onClick={() => item.subItems && toggleExpand(item.id)}
                               >
                                  <div className="flex items-center gap-3">
                                     <div className={cn(
                                       "h-6 w-6 rounded-md flex items-center justify-center font-bold text-[10px] border shrink-0",
                                       groupIndex === 0 ? "bg-red-50 text-red-600 border-red-100" : 
                                       groupIndex === 1 ? "bg-amber-50 text-amber-600 border-amber-100" : 
                                       "bg-blue-50 text-blue-600 border-blue-100"
                                     )}>
                                       {groupIndex === 0 ? "T1" : groupIndex === 1 ? "T2" : "T3"}
                                     </div>
                                     <div className="font-semibold text-[#1d1d1f] flex items-center gap-2">
                                       {item.field}
                                       {item.subItems && (
                                         <span className="text-black/40">
                                           {expandedItems[item.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                         </span>
                                       )}
                                     </div>
                                  </div>

                                  <div className="text-sm font-mono text-black/70 bg-black/[0.03] px-2 py-0.5 rounded w-fit text-[11px] truncate" title={item.varName}>
                                    {item.varName}
                                  </div>
                                  
                                  <div className="text-sm text-[#86868b]">{item.reason}</div>
                                  
                                  <div className="flex justify-end">
                                     <div className="flex items-center gap-1.5">
                                        <Layers className="h-3 w-3 text-black/30" />
                                        <span className="text-xs font-medium text-black/60 bg-black/[0.03] px-2 py-0.5 rounded-md">
                                          {item.estimand}
                                        </span>
                                     </div>
                                  </div>
                               </motion.div>

                               {/* Sub-items expansion */}
                               <AnimatePresence>
                                 {item.subItems && expandedItems[item.id] && (
                                   <motion.div
                                     initial={{ height: 0, opacity: 0 }}
                                     animate={{ height: "auto", opacity: 1 }}
                                     exit={{ height: 0, opacity: 0 }}
                                     className="bg-black/[0.02] border-b border-black/[0.04] overflow-hidden"
                                   >
                                     {item.subItems.map((sub, j) => (
                                       <div key={j} className="grid grid-cols-[2fr_1.5fr_2fr_1fr] px-5 py-3 pl-14 text-sm border-b border-black/[0.02] last:border-0">
                                          <div className="text-[#1d1d1f] font-medium flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
                                            {sub.field}
                                          </div>
                                          <div className="font-mono text-black/60 text-[11px]">{sub.varName}</div>
                                          <div className="text-[#86868b] text-xs italic">Component parameter</div>
                                          <div />
                                       </div>
                                     ))}
                                   </motion.div>
                                 )}
                               </AnimatePresence>
                             </div>
                          ))}
                       </div>
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
             <Button 
               onClick={() => setLocation("/study/critical-data/criticality")}
               className="bg-[#1d1d1f] text-white hover:bg-[#1d1d1f]/90 px-8 rounded-full shadow-lg"
             >
               Finalize Analysis <CheckCircle2 className="ml-2 h-4 w-4" />
             </Button>
          )}
        </div>
      </div>

    </div>
  );
}
