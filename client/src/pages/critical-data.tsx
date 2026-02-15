import { useState, useEffect } from "react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ChevronRight, 
  ArrowRight, 
  Database, 
  Layers, 
  ShieldCheck, 
  Download,
  AlertTriangle,
  Check,
  FileCheck,
  Sparkles,
  Activity,
  Edit2,
  Plus,
  X,
  History,
  UserCheck,
  Lock,
  Search,
  Filter,
  Eye,
  Info,
  HelpCircle,
  AlertCircle,
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- Mock Data with Provenance & Explainability ---

const SOA_INIT = {
  id: "XYZ-301",
  title: "Phase III, Randomized, Double-Blind, Placebo-Controlled Study of Drug X in MDD",
  visits: [
    { id: "V1", label: "Screening", week: -2, win: "Day -14 to -1", source: "Table 1, Pg 22" },
    { id: "V2", label: "Baseline", week: 0, win: "Day 1", source: "Table 1, Pg 22" },
    { id: "V3", label: "Week 1", week: 1, win: "±2d", source: "Table 1, Pg 22" },
    { id: "V4", label: "Week 2", week: 2, win: "±3d", source: "Table 1, Pg 22" },
    { id: "V5", label: "Week 4", week: 4, win: "±3d", source: "Table 1, Pg 22" },
    { id: "V6", label: "Week 6", week: 6, win: "±3d", source: "Table 1, Pg 22" },
    { id: "V7", label: "Week 8", week: 8, win: "±3d", primary: true, source: "Section 6.1, Pg 45" },
    { id: "V8", label: "Follow-up", week: 10, win: "±5d", source: "Table 1, Pg 22" },
  ],
  rows: [
    { name: "Informed Consent", v: [1,0,0,0,0,0,0,0], source: "Section 5.1", conf: "high" },
    { name: "Inclusion/Exclusion", v: [1,0,0,0,0,0,0,0], source: "Section 5.2", conf: "high" },
    { name: "Demographics", v: [1,0,0,0,0,0,0,0], source: "Section 5.3", conf: "high" },
    { name: "Medical History", v: [1,0,0,0,0,0,0,0], source: "Section 5.4", conf: "high" },
    { name: "MADRS", v: [1,1,1,1,1,1,1,0], highlight: true, source: "Section 6.2.1", conf: "high" },
    { name: "CGI-S / CGI-I", v: [1,1,0,1,1,1,1,0], source: "Section 6.2.2", conf: "high" },
    { name: "Vital Signs", v: [1,1,1,1,1,1,1,1], source: "Section 7.1", conf: "high" },
    { name: "Laboratory Panel", v: [1,1,0,0,1,0,1,1], source: "Section 7.2", conf: "high" },
    { name: "12-Lead ECG", v: [1,1,0,0,0,0,1,0], source: "Section 7.3", conf: "high" },
    { name: "Adverse Events", v: [0,1,1,1,1,1,1,1], source: "Section 8.1", conf: "high" },
    { name: "Concomitant Meds", v: [1,1,1,1,1,1,1,1], source: "Section 5.5", conf: "high" },
    { name: "Study Drug Dispensing", v: [0,1,0,1,1,1,0,0], source: "Section 9.1", conf: "high" },
    // Low confidence examples
    { name: "Drug Accountability", v: [0,0,1,1,1,1,1,0], source: "Inferred from Section 8.3", conf: "low" },
    { name: "Disposition", v: [0,0,0,0,0,0,0,1], source: "Section 10.1", conf: "low" },
  ],
};

const ACRF_INIT = [
  { dom: "DM", label: "Demographics", std: "CDASH DM v2.2", fields: [
    { var: "SUBJID", lbl: "Subject Identifier", type: "Char", cdash: "SUBJID", ct: null, source: "Prot Sec 5.3" },
    { var: "BRTHDTC", lbl: "Date of Birth", type: "Date", cdash: "BRTHDTC", ct: null, source: "Prot Sec 5.3" },
    { var: "SEX", lbl: "Sex", type: "Char", cdash: "SEX", ct: "M, F", source: "Prot Sec 5.3" },
    { var: "RACE", lbl: "Race", type: "Char", cdash: "RACE", ct: "CDISC Race CT", source: "Prot Sec 5.3" },
  ]},
  { dom: "QS", label: "Questionnaires — MADRS", std: "CDASH QS v2.2", note: "10 items per assessment. Total score derived.", fields: [
    { var: "QSCAT", lbl: "Category", type: "Char", cdash: "QSCAT", ct: "MADRS", source: "Prot Sec 6.2.1" },
    { var: "QSTEST", lbl: "MADRS Item", type: "Char", cdash: "QSTEST", ct: "MADRS item CT", source: "Prot Sec 6.2.1" },
    { var: "QSORRES", lbl: "Item Score (0–6)", type: "Num", cdash: "QSORRES", ct: "0,1,2,3,4,5,6", source: "Prot Sec 6.2.1" },
    { var: "QSDTC", lbl: "Assessment Date", type: "Date", cdash: "QSDTC", ct: null, source: "Prot Sec 6.2.1" },
    { var: "VISITNUM", lbl: "Visit Number", type: "Num", cdash: "VISITNUM", ct: null, source: "SOA Col Header" },
  ]},
];

const ESTS_INIT = [
  { 
    id: "E1", 
    label: "Primary Estimand", 
    var: "Change from baseline in MADRS total score at Week 8", 
    pop: "mITT (≥1 dose)", 
    trt: "Drug X 200mg vs Placebo", 
    ic: [
      { ev: "Treatment discontinuation", st: "Treatment policy", source: "SAP Sec 5.2.1" }, 
      { ev: "Rescue medication use", st: "Composite (failure)", source: "SAP Sec 5.2.2" }
    ], 
    sum: "Difference in means of change from baseline MADRS at Week 8.", 
    conf: 0.96,
    reasoning: "Structure explicitly matched to SAP Section 3.1 (High Confidence). Population definition standard (High).",
    source: "SAP Section 3.1, Page 12"
  },
  { 
    id: "E2", 
    label: "Key Secondary", 
    var: "MADRS response (≥50% reduction) at Week 8", 
    pop: "mITT", 
    trt: "Drug X 200mg vs Placebo", 
    ic: [{ ev: "Treatment discontinuation", st: "Treatment policy", source: "SAP Sec 5.2.1" }], 
    sum: "Proportion achieving ≥50% MADRS reduction at Week 8.", 
    conf: 0.91,
    reasoning: "Inferred from secondary endpoints table. Strategy confirmed in Section 5.3.",
    source: "SAP Section 4.2, Page 15"
  },
];

const DMAP_INIT = [
  { id: 1, dom: "QS", field: "QSORRES (MADRS Q1–Q10)", sap: "AVAL = Σ(Q1..Q10)", deriv: "MADRS total = sum of 10 items", link: "Direct component of primary endpoint", tier: "1", source: "SAP Sec 6.1 Eq 2" },
  { id: 2, dom: "QS", field: "QSORRES (MADRS, Visit 2)", sap: "BASE = AVAL at Visit 2", deriv: "Baseline MADRS total score", link: "Baseline for CHG computation", tier: "1", source: "SAP Sec 6.1" },
  { id: 3, dom: "QS", field: "QSDTC (Visit 7 / Week 8)", sap: "ADT", deriv: "Assessment date at primary timepoint", link: "Window compliance — primary", tier: "1", source: "SAP Sec 6.1" },
  { id: 4, dom: "QS", field: "VISITNUM", sap: "AVISIT / AVISITN", deriv: "Visit mapping for MMRM model", link: "Repeated measures structure", tier: "1", source: "SAP Appx A" },
  { id: 5, dom: "CM", field: "CMTRT (rescue medications)", sap: "CRIT1FL (rescue flag)", deriv: "If rescue → composite failure", link: "Intercurrent event — changes endpoint", tier: "1", source: "SAP Sec 5.2.2" },
  { id: 6, dom: "EX", field: "EXSTDTC, EXENDTC", sap: "TRTSDT, TRTEDT", deriv: "Treatment start/end dates", link: "mITT definition (≥1 dose)", tier: "1", source: "SAP Sec 4.1" },
  { id: 7, dom: "DM", field: "SUBJID, RFSTDTC", sap: "USUBJID, RFSTDTC", deriv: "Subject ID and reference start", link: "Population and windowing anchor", tier: "1", source: "General" },
  { id: 8, dom: "DS", field: "DSSCAT, DSDTC", sap: "EOSSTT, EOSDT", deriv: "Discontinuation flag + date", link: "Intercurrent event — treatment policy", tier: "2", source: "SAP Sec 5.2.1" },
  { id: 9, dom: "QS", field: "QSORRES (MADRS, Visits 3–6)", sap: "AVAL at intermediate visits", deriv: "Intermediate MADRS scores", link: "MMRM — repeated measures", tier: "2", source: "SAP Sec 6.2" },
  { id: 10, dom: "IE", field: "IEORRES", sap: "RANDFL", deriv: "I/E met → randomized", link: "Eligibility verification", tier: "2", source: "SAP Sec 4.1" },
  { id: 11, dom: "AE", field: "AETERM, AESER, AEREL", sap: "Safety analysis variables", deriv: "AE characterization", link: "Safety — not primary estimand", tier: "3", source: "SAP Sec 8.1" },
  { id: 12, dom: "DM", field: "SEX, RACE, AGE", sap: "Covariates in MMRM", deriv: "Stratification factors", link: "Model covariates", tier: "3", source: "SAP Sec 4.3" },
  { id: 12, dom: "DM", field: "SEX, RACE, AGE", sap: "Covariates in MMRM", deriv: "Stratification factors", link: "Model covariates", tier: "3", source: "SAP Sec 4.3" },
];

// --- Components ---

const ProvenanceTooltip = ({ source, conf = "high", children }: { source: string, conf?: string, children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild className="cursor-help">
        {children}
      </TooltipTrigger>
      <TooltipContent className="bg-slate-900 text-white border-slate-800 text-xs p-3 max-w-xs shadow-xl z-50">
        <div className="font-bold mb-1 flex items-center gap-1.5 text-blue-300 uppercase tracking-wider text-[10px]">
          <FileText className="h-3 w-3" /> Source Provenance
        </div>
        <p className="mb-2">Extracted from: <span className="font-mono text-emerald-300">{source}</span></p>
        {conf === "low" && (
            <div className="flex items-start gap-1.5 text-amber-300 bg-amber-900/30 p-1.5 rounded text-[10px] leading-tight">
                <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                <span>Low confidence extraction. System inferred this relationship. Verification recommended.</span>
            </div>
        )}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const EditOverlay = ({ onEdit }: { onEdit: () => void }) => (
  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
    <Button size="icon" variant="secondary" className="h-6 w-6 rounded-md bg-white/80 hover:bg-white shadow-sm" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
      <Edit2 className="h-3 w-3 text-slate-600" />
    </Button>
  </div>
);

const StepIndicator = ({ step, currentStep }: { step: string, currentStep: string }) => {
  const steps = [
    "upload-protocol", "processing-soa", "review-soa", 
    "processing-acrf", "review-acrf", 
    "upload-sap", "processing-sap", 
    "review-estimand", "review-derivation", "review-criticality", 
    "complete"
  ];
  
  const stepIdx = steps.indexOf(step);
  const currentIdx = steps.indexOf(currentStep);
  
  const isCompleted = stepIdx < currentIdx;
  const isActive = step === currentStep;
  
  return (
    <div className="flex flex-col items-center gap-2 relative z-10 group">
       <div className={cn(
         "h-3 w-3 rounded-full transition-all duration-500 ring-4 ring-white",
         isCompleted ? "bg-emerald-500" : 
         isActive ? "bg-blue-600 scale-125" : 
         "bg-slate-200"
       )} />
       {isActive && (
         <div className="absolute top-6 whitespace-nowrap text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full animate-in fade-in slide-in-from-top-1">
           Current Step
         </div>
       )}
    </div>
  );
};

// --- Main Page ---

export default function CriticalData() {
  const [step, setStep] = useState("upload-protocol");
  const [soaData, setSoaData] = useState(SOA_INIT);
  const [acrfData, setAcrfData] = useState(ACRF_INIT);
  const [estimands, setEstimands] = useState(ESTS_INIT);
  const [derivationData, setDerivationData] = useState(DMAP_INIT);
  
  // Validation State
  const [smeAssigned, setSmeAssigned] = useState(false);
  const [validationStatus, setValidationStatus] = useState("pending"); // pending, assigned, approved

  // Current User Persona (Simulated)
  const [currentUser, setCurrentUser] = useState<"study-director" | "sme">("study-director");

  // Filtering for Criticality
  const [tierFilter, setTierFilter] = useState<string | null>(null);

  const toggleTier = (id: number) => {
    setDerivationData(prev => prev.map(item => {
      if (item.id === id) {
        const nextTier = item.tier === "1" ? "2" : item.tier === "2" ? "3" : "1";
        return { ...item, tier: nextTier };
      }
      return item;
    }));
  };

  const filteredDerivations = tierFilter 
    ? derivationData.filter(d => d.tier === tierFilter)
    : derivationData;

  const handleRouteToSME = () => {
    setSmeAssigned(true);
    setValidationStatus("assigned");
  };

  const handleSMEApprove = () => {
      setValidationStatus("approved");
      // Optional: switch back to director to see the result
      setCurrentUser("study-director");
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-[#F5F5F7]">
      
      {/* Persona Switcher (Demo Control) */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-slate-900 text-white p-1 rounded-full shadow-2xl border border-slate-700 flex items-center gap-1">
            <button 
                onClick={() => setCurrentUser("study-director")}
                className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2",
                    currentUser === "study-director" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                )}
            >
                <User className="h-3 w-3" /> Study Director
            </button>
            <button 
                onClick={() => setCurrentUser("sme")}
                className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2",
                    currentUser === "sme" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                )}
            >
                <UserCheck className="h-3 w-3" /> SME (John Smith)
            </button>
        </div>
      </div>

      {/* SME Banner */}
      {currentUser === "sme" && (
          <div className="bg-emerald-600 text-white px-6 py-2 flex justify-between items-center shadow-md z-40">
              <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">JS</div>
                  <div className="flex flex-col leading-none">
                      <span className="font-bold text-sm">John Smith (SME)</span>
                      <span className="text-[10px] opacity-80">Logged in as Lead Statistician</span>
                  </div>
              </div>
              <div className="text-xs font-medium bg-emerald-700/50 px-3 py-1 rounded-full border border-emerald-500/50">
                  Validation Portal
              </div>
          </div>
      )}

      {/* Conceptual Breadcrumb */}
      {step !== "upload-protocol" && step !== "complete" && currentUser === "study-director" && (
        <div className="px-6 pt-4 mb-2 shrink-0">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="flex items-center">
                    <div className={cn("flex flex-col", (step.includes("protocol") || step.includes("soa")) ? "opacity-100" : "opacity-40")}>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Phase 1</span>
                      <span className="text-sm font-semibold text-slate-900">Protocol & SOA</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 mx-4" />
                    <div className={cn("flex flex-col", step.includes("acrf") ? "opacity-100" : "opacity-40")}>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Phase 2</span>
                      <span className="text-sm font-semibold text-slate-900">Annotated CRF</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 mx-4" />
                    <div className={cn("flex flex-col", (step.includes("sap") || step.includes("estimand")) ? "opacity-100" : "opacity-40")}>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Phase 3</span>
                      <span className="text-sm font-semibold text-slate-900">Analysis Plan</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 mx-4" />
                    <div className={cn("flex flex-col", (step.includes("derivation") || step.includes("criticality")) ? "opacity-100" : "opacity-40")}>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Phase 4</span>
                      <span className="text-sm font-semibold text-slate-900">Criticality Model</span>
                    </div>
                 </div>
              </div>
              <div className="flex gap-1 bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                 <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-slate-500 hover:text-slate-900">
                    <History className="h-3 w-3 mr-1" /> Audit Log
                 </Button>
                 <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-slate-500 hover:text-slate-900">
                    <UserCheck className="h-3 w-3 mr-1" /> SME View
                 </Button>
              </div>
           </div>
           
           {/* Progress Bar */}
           <div className="mt-4 relative h-0.5 w-full bg-slate-200 rounded-full overflow-hidden">
             <motion.div 
               className="absolute top-0 left-0 h-full bg-slate-900" 
               initial={{ width: "0%" }}
               animate={{ 
                 width: step === "review-soa" ? "20%" :
                        step === "review-acrf" ? "40%" :
                        step === "review-estimand" ? "60%" :
                        step === "review-criticality" ? "80%" :
                        step === "complete" ? "100%" : "5%"
               }}
               transition={{ duration: 0.5, ease: "easeInOut" }}
             />
           </div>
        </div>
      )}

      {/* Main Content Card */}
      <div className="flex-1 mx-4 mb-4 bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <AnimatePresence mode="wait">

            {/* --- SME Validation View (Available anytime if routed) --- */}
            {currentUser === "sme" && (
                <motion.div 
                    key="sme-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full max-w-5xl mx-auto"
                >
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Model Validation Request</h1>
                        <p className="text-slate-500">Please review the criticality model for Protocol XYZ-301.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="col-span-2 space-y-6">
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                    Estimand Review
                                </h3>
                                <div className="space-y-4">
                                    {estimands.map(est => (
                                        <div key={est.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-slate-800">{est.label}</span>
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{Math.round(est.conf * 100)}% Conf</Badge>
                                            </div>
                                            <p className="text-slate-600 text-xs mb-2">{est.sum}</p>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="h-7 text-xs bg-white">Approve</Button>
                                                <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-500">Comment</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                             <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-blue-600" />
                                    Criticality Tiers Summary
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg text-sm">
                                        <span className="text-slate-600">Tier 1 (Critical)</span>
                                        <span className="font-bold text-slate-900">{derivationData.filter(d => d.tier === "1").length} Variables</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg text-sm">
                                        <span className="text-slate-600">Tier 2 (Important)</span>
                                        <span className="font-bold text-slate-900">{derivationData.filter(d => d.tier === "2").length} Variables</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg text-sm">
                                        <span className="text-slate-600">Tier 3 (Supplementary)</span>
                                        <span className="font-bold text-slate-900">{derivationData.filter(d => d.tier === "3").length} Variables</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1">
                             <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col">
                                <h3 className="text-sm font-bold text-slate-900 mb-4">Action Required</h3>
                                <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                                    By approving this model, you certify that the estimands and criticality definitions align with the Statistical Analysis Plan (SAP) and Protocol.
                                </p>
                                
                                <div className="mt-auto space-y-3">
                                    {validationStatus === "approved" ? (
                                        <div className="p-4 bg-emerald-100 text-emerald-800 rounded-lg text-center font-bold text-sm flex flex-col items-center gap-2">
                                            <CheckCircle2 className="h-6 w-6" />
                                            Model Approved
                                            <span className="text-[10px] font-normal opacity-80">RBQM Package Unlocked</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg" onClick={handleSMEApprove}>
                                                <CheckCircle2 className="h-4 w-4 mr-2" /> Approve Model
                                            </Button>
                                            <Button variant="outline" className="w-full bg-white border-slate-300 text-slate-700">
                                                Request Changes
                                            </Button>
                                        </>
                                    )}
                                </div>
                             </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* --- STEP 0: Upload Protocol --- */}
            {step === "upload-protocol" && currentUser !== "sme" && (
              <motion.div 
                key="upload-proto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white"
              >
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider mb-6 shadow-lg shadow-blue-900/20">
                    <Sparkles className="h-3 w-3 text-blue-300" />
                    AI-Powered Study Design
                  </div>
                  <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">Criticality Model Builder</h1>
                  <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
                    Upload your protocol to automatically extract the Schedule of Activities 
                    and generate a risk-based quality management plan.
                  </p>
                </div>
                
                <div className="relative group cursor-pointer" onClick={() => setStep("processing-soa")}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white border border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center h-[380px] w-[500px]">
                     <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                       <UploadCloud className="h-10 w-10 stroke-[1.5]" />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload Protocol</h3>
                     <p className="text-slate-500 mb-8 max-w-[260px]">Drag & drop PDF or Word document<br/><span className="text-xs text-slate-400">Max size 50MB</span></p>
                     <Button className="bg-slate-900 text-white hover:bg-blue-600 w-48 shadow-lg group-hover:shadow-blue-500/25 transition-all">Select Document</Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- STEP 1: Processing Protocol --- */}
            {step === "processing-soa" && currentUser !== "sme" && (
               <motion.div key="proc-soa" className="h-full flex items-center justify-center">
                 <div className="flex flex-col items-center max-w-md w-full">
                    <div className="relative mb-10">
                       <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-20 rounded-full animate-pulse"></div>
                       <Loader2 className="h-16 w-16 text-blue-600 animate-spin relative z-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Digitizing Protocol</h2>
                    <div className="w-full space-y-4">
                       {["Parsing document structure", "Identifying Schedule of Activities", "Extracting visit matrix", "Validating windows"].map((label, i) => (
                         <div key={i} className="flex items-center gap-4 text-sm animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: `${i * 1500}ms` }}>
                            <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-slate-600 font-medium">{label}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 {/* Auto-advance simulated */}
                 <div className="hidden">{setTimeout(() => setStep("review-soa"), 8000)}</div>
               </motion.div>
            )}

            {/* --- STEP 2: Review SOA --- */}
            {step === "review-soa" && currentUser !== "sme" && (
              <motion.div key="rev-soa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                      Review Schedule of Activities
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                        AI Extracted
                      </span>
                    </h2>
                    <p className="text-slate-500 mt-1">Verify extracted visits and assessments against the source document.</p>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="outline" className="gap-2">
                       <Plus className="h-4 w-4" /> Add Assessment
                     </Button>
                     <Button onClick={() => setStep("processing-acrf")} className="bg-slate-900 text-white gap-2">
                       Generate aCRF <ArrowRight className="h-4 w-4" />
                     </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto border border-slate-200 rounded-xl shadow-sm bg-white relative">
                   <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm">
                        <tr>
                          <th className="p-4 border-b border-slate-200 min-w-[200px] sticky left-0 bg-slate-50 z-30 font-bold text-slate-700">Assessment</th>
                          {soaData.visits.map((v, i) => (
                            <th key={i} className={cn("p-3 border-b border-slate-200 text-center min-w-[100px] group cursor-pointer hover:bg-slate-100 transition-colors relative", v.primary && "bg-blue-50/50 hover:bg-blue-50")}>
                               <div className="text-xs font-bold text-slate-900">{v.label}</div>
                               <div className="text-[10px] text-slate-500 font-normal">{v.win}</div>
                               <EditOverlay onEdit={() => {}} />
                               {v.primary && <div className="absolute top-0 right-0 left-0 h-1 bg-blue-500" />}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {soaData.rows.map((row, i) => (
                          <tr key={i} className={cn("group hover:bg-slate-50 transition-colors border-b border-slate-50", row.highlight && "bg-blue-50/5")}>
                            <td className="p-3 pl-4 border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 z-10 font-medium text-slate-700 relative">
                               <div className="flex items-center gap-2">
                                  {row.conf === "low" && (
                                     <TooltipProvider>
                                        <Tooltip>
                                           <TooltipTrigger>
                                              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                           </TooltipTrigger>
                                           <TooltipContent className="bg-amber-950 text-amber-50 border-amber-900 text-xs">Low confidence extraction</TooltipContent>
                                        </Tooltip>
                                     </TooltipProvider>
                                  )}
                                  <span className={cn(row.conf === "low" && "text-amber-800")}>{row.name}</span>
                               </div>
                               <div className="text-[9px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                                  <FileText className="h-2.5 w-2.5" />
                                  {row.source}
                               </div>
                            </td>
                            {row.v.map((val, j) => (
                              <td key={j} className="p-3 text-center relative">
                                 {val === 1 ? (
                                   <ProvenanceTooltip source={row.source} conf={row.conf}>
                                      <div className={cn(
                                         "h-6 w-6 rounded flex items-center justify-center mx-auto transition-all cursor-pointer",
                                         row.conf === "low" 
                                            ? "bg-amber-50 text-amber-600 border border-amber-200 border-dashed hover:bg-amber-100" 
                                            : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-blue-600"
                                      )}>
                                        <Check className="h-4 w-4" />
                                      </div>
                                   </ProvenanceTooltip>
                                 ) : (
                                   <div className="h-6 w-6 rounded flex items-center justify-center mx-auto opacity-0 group-hover:opacity-100 cursor-pointer hover:bg-slate-200">
                                     <Plus className="h-3 w-3 text-slate-400" />
                                   </div>
                                 )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </motion.div>
            )}

            {/* --- STEP 3: Processing aCRF --- */}
            {step === "processing-acrf" && currentUser !== "sme" && (
               <motion.div key="proc-acrf" className="h-full flex items-center justify-center">
                 <div className="flex flex-col items-center max-w-md w-full">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-6" />
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Generating Annotated CRF</h2>
                    {/* Auto-advance simulated */}
                    <div className="hidden">{setTimeout(() => setStep("review-acrf"), 6000)}</div>
                 </div>
               </motion.div>
            )}

            {/* --- STEP 4: Review aCRF --- */}
            {step === "review-acrf" && currentUser !== "sme" && (
              <motion.div key="rev-acrf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                       <h2 className="text-2xl font-bold text-slate-900">Review Annotated CRF</h2>
                       <p className="text-slate-500">CDASH v2.2 Standards Applied</p>
                    </div>
                    <Button onClick={() => setStep("upload-sap")} className="bg-slate-900 text-white gap-2">
                       Confirm & Upload SAP <ArrowRight className="h-4 w-4" />
                    </Button>
                 </div>

                 <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white p-6">
                    {acrfData.map((domain, i) => (
                      <div key={i} className="mb-8 last:mb-0">
                         <div className="flex items-center gap-3 mb-4">
                            <Badge variant="outline" className="text-sm font-bold bg-slate-50 px-3 py-1 border-slate-200">{domain.dom}</Badge>
                            <h3 className="font-bold text-slate-800">{domain.label}</h3>
                            <span className="text-xs text-slate-400 ml-auto font-mono">{domain.std}</span>
                         </div>
                         <div className="border border-slate-100 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                               <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                                  <tr>
                                     <th className="p-3 pl-4">Variable</th>
                                     <th className="p-3">Label</th>
                                     <th className="p-3">Type</th>
                                     <th className="p-3">Source</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-50">
                                  {domain.fields.map((field, j) => (
                                     <tr key={j} className="hover:bg-slate-50/50">
                                        <td className="p-3 pl-4 font-mono text-slate-700 font-medium">{field.var}</td>
                                        <td className="p-3 text-slate-600">{field.lbl}</td>
                                        <td className="p-3"><Badge variant="secondary" className="text-[10px] h-5">{field.type}</Badge></td>
                                        <td className="p-3 text-xs text-slate-400">{field.source}</td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {/* --- STEP 5: Upload SAP --- */}
            {step === "upload-sap" && currentUser !== "sme" && (
              <motion.div 
                key="upload-sap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center bg-slate-50/30"
              >
                <div className="mb-8 flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full text-xs font-bold border border-emerald-100 uppercase tracking-wide">
                  <CheckCircle2 className="h-4 w-4" /> Phase 2 Complete
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Upload Analysis Plan</h2>
                <div 
                  className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/10 transition-all w-[500px] h-[300px]"
                  onClick={() => setStep("processing-sap")}
                >
                   <Database className="h-12 w-12 text-slate-300 mb-4" />
                   <h3 className="font-bold text-lg text-slate-700">Select SAP Document</h3>
                   <p className="text-slate-400 text-sm mt-2">Analysis Data Model (ADaM) Specifications</p>
                </div>
              </motion.div>
            )}

            {/* --- STEP 6: Process SAP --- */}
            {step === "processing-sap" && currentUser !== "sme" && (
               <motion.div key="proc-sap" className="h-full flex items-center justify-center">
                 <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-6" />
                    <h2 className="text-xl font-bold text-slate-900">Parsing Analysis Plan</h2>
                    {/* Auto-advance simulated */}
                    <div className="hidden">{setTimeout(() => setStep("review-estimand"), 6000)}</div>
                 </div>
               </motion.div>
            )}

            {/* --- STEP 7: Review Estimands --- */}
            {step === "review-estimand" && currentUser !== "sme" && (
               <motion.div key="rev-est" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">Review Estimands</h2>
                        <p className="text-slate-500">Extracted from SAP. These define the primary objectives.</p>
                     </div>
                     <Button onClick={() => setStep("review-derivation")} className="bg-slate-900 text-white gap-2">
                        Approve Estimands <ArrowRight className="h-4 w-4" />
                     </Button>
                  </div>

                  <div className="space-y-6 overflow-auto pb-4">
                     {estimands.map((est, i) => (
                        <div key={i} className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex gap-4">
                                 <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                                    {est.id}
                                 </div>
                                 <div>
                                    <h3 className="font-bold text-lg text-slate-900">{est.label}</h3>
                                    <p className="text-slate-600">{est.var}</p>
                                 </div>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                     <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1 cursor-help">
                                        <ShieldCheck className="h-3 w-3" /> {Math.round(est.conf * 100)}% Confidence
                                     </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs bg-slate-800 text-white p-3">
                                     <p className="text-xs">{est.reasoning}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                 <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Population</div>
                                 <div className="font-semibold text-slate-800 text-sm">{est.pop}</div>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                 <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Treatment</div>
                                 <div className="font-semibold text-slate-800 text-sm">{est.trt}</div>
                              </div>
                           </div>

                           <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                              <div className="text-[10px] font-bold text-blue-400 uppercase mb-2">Intercurrent Events</div>
                              <div className="space-y-2">
                                 {est.ic.map((ice, j) => (
                                    <div key={j} className="flex justify-between items-center text-sm">
                                       <span className="text-slate-700 font-medium flex items-center gap-2">
                                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                                          {ice.ev}
                                       </span>
                                       <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-blue-100 text-blue-600">{ice.st}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                              <div className="text-xs text-slate-400 flex items-center gap-1">
                                 <FileText className="h-3 w-3" /> Source: {est.source}
                              </div>
                           </div>
                        </div>
                     ))}
                     <Button variant="outline" className="w-full border-dashed border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 h-12">
                        <Plus className="h-4 w-4 mr-2" /> Add Missing Estimand
                     </Button>
                  </div>
               </motion.div>
            )}

            {/* --- STEP 8: Derivation Map --- */}
            {step === "review-derivation" && currentUser !== "sme" && (
               <motion.div key="rev-map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">Derivation Map</h2>
                        <p className="text-slate-500">Traceability: Source (aCRF) → Analysis (SAP) → Estimand.</p>
                     </div>
                     <Button onClick={() => setStep("review-criticality")} className="bg-slate-900 text-white gap-2">
                        Review Criticality <ArrowRight className="h-4 w-4" />
                     </Button>
                  </div>

                  <div className="flex-1 overflow-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0 z-10 text-[11px] uppercase tracking-wider">
                           <tr>
                              <th className="p-4 pl-6">Domain</th>
                              <th className="p-4">Source Field</th>
                              <th className="p-4">SAP Variable</th>
                              <th className="p-4">Derivation Logic</th>
                              <th className="p-4">Estimand Link</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {derivationData.map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50 group">
                                 <td className="p-3 pl-6">
                                    <Badge variant="outline" className="bg-white font-bold">{row.dom}</Badge>
                                 </td>
                                 <td className="p-3 text-slate-700 font-mono text-xs">{row.field}</td>
                                 <td className="p-3 text-slate-900 font-mono text-xs font-bold">{row.sap}</td>
                                 <td className="p-3 relative">
                                    <div className="text-slate-500 italic text-xs max-w-xs">{row.deriv}</div>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                                       <Button size="icon" variant="ghost" className="h-6 w-6"><Edit2 className="h-3 w-3" /></Button>
                                    </div>
                                 </td>
                                 <td className="p-3">
                                    <div className="flex flex-col gap-1">
                                       <span className="text-xs font-medium text-slate-700">{row.link}</span>
                                       <span className="text-[10px] text-slate-400">Ref: {row.source}</span>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </motion.div>
            )}

            {/* --- STEP 9: Criticality Review --- */}
            {step === "review-criticality" && currentUser !== "sme" && (
               <motion.div key="rev-crit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">Criticality Review</h2>
                        <p className="text-slate-500">Validate risk-based tier assignments.</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                           {["1", "2", "3"].map(t => (
                              <button 
                                 key={t}
                                 onClick={() => setTierFilter(tierFilter === t ? null : t)}
                                 className={cn(
                                    "px-3 py-1 text-xs font-bold rounded-md transition-all",
                                    tierFilter === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                 )}
                              >
                                 Tier {t}
                              </button>
                           ))}
                           {tierFilter && (
                              <button onClick={() => setTierFilter(null)} className="px-2 text-slate-400 hover:text-slate-600"><X className="h-3 w-3" /></button>
                           )}
                        </div>
                        <Button onClick={() => setStep("complete")} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                           Finalize Model <CheckCircle2 className="h-4 w-4" />
                        </Button>
                     </div>
                  </div>

                  <div className="flex-1 overflow-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0 z-10 text-[11px] uppercase tracking-wider">
                           <tr>
                              <th className="p-4 pl-6">Analysis Variable</th>
                              <th className="p-4">Impact Reasoning</th>
                              <th className="p-4 text-center">Assigned Tier</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {filteredDerivations.map((row) => (
                              <tr key={row.id} className="hover:bg-slate-50">
                                 <td className="p-4 pl-6">
                                    <div className="font-bold text-slate-900">{row.sap}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5">Source: {row.field}</div>
                                 </td>
                                 <td className="p-4">
                                    <div className="text-sm text-slate-700 mb-1">{row.link}</div>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                       <Info className="h-3 w-3" />
                                       Required for primary analysis model (SAP Sec 4.1)
                                    </div>
                                 </td>
                                 <td className="p-4 text-center">
                                    <button 
                                       onClick={() => toggleTier(row.id)}
                                       className={cn(
                                          "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all hover:scale-105 shadow-sm uppercase tracking-wide min-w-[80px]",
                                          row.tier === "1" ? "bg-slate-900 text-white ring-2 ring-slate-100 shadow-md" :
                                          row.tier === "2" ? "bg-white text-slate-700 border border-slate-300" :
                                          "bg-slate-100 text-slate-400"
                                       )}
                                    >
                                       Tier {row.tier}
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </motion.div>
            )}

            {/* --- STEP 10: Complete / Validation --- */}
            {step === "complete" && currentUser !== "sme" && (
               <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-8 bg-slate-50/50">
                  <div className="max-w-3xl w-full">
                     <div className="flex items-center gap-6 mb-8">
                        <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 shrink-0">
                           <FileCheck className="h-12 w-12 text-emerald-500" />
                        </div>
                        <div>
                           <h2 className="text-3xl font-bold text-slate-900 mb-2">Model Generated</h2>
                           <p className="text-slate-500 text-lg">
                              Criticality model V0.1 is ready for validation. 
                           </p>
                        </div>
                     </div>

                     <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Audit Summary</h3>
                        <div className="grid grid-cols-3 gap-6 text-center">
                           <div>
                              <div className="text-2xl font-bold text-slate-900">100%</div>
                              <div className="text-xs text-slate-500">AI Generated</div>
                           </div>
                           <div>
                              <div className="text-2xl font-bold text-slate-900">2</div>
                              <div className="text-xs text-slate-500">Human Modifications</div>
                           </div>
                           <div>
                              <div className="text-2xl font-bold text-slate-900">0</div>
                              <div className="text-xs text-slate-500">Validation Flags</div>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        {validationStatus === "pending" ? (
                           <Dialog>
                             <DialogTrigger asChild>
                               <Button className="flex-1 h-14 bg-slate-900 text-white hover:bg-slate-800 text-lg shadow-lg">
                                 <UserCheck className="h-5 w-5 mr-2" /> Route to SME for Validation
                               </Button>
                             </DialogTrigger>
                             <DialogContent>
                               <DialogHeader>
                                 <DialogTitle>Assign Validator</DialogTitle>
                                 <DialogDescription>
                                   Select a subject matter expert to review this model.
                                 </DialogDescription>
                               </DialogHeader>
                               <div className="grid gap-4 py-4">
                                  <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                                     <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">JS</div>
                                        <div>
                                           <div className="font-bold text-sm">John Smith</div>
                                           <div className="text-xs text-slate-500">Lead Statistician</div>
                                        </div>
                                     </div>
                                     <Button size="sm" variant="outline" onClick={handleRouteToSME}>Assign</Button>
                                  </div>
                               </div>
                             </DialogContent>
                           </Dialog>
                        ) : (
                           <div className="flex-1 h-14 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold gap-2 relative group cursor-help">
                              <CheckCircle2 className="h-5 w-5" /> 
                              {validationStatus === "approved" ? "Validated by John Smith" : "Routed to John Smith for Review"}
                           </div>
                        )}
                        
                        <TooltipProvider>
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <span className="inline-block">
                                    <Button 
                                       variant="outline" 
                                       className={cn(
                                          "h-14 px-8 border-slate-200 transition-all",
                                          validationStatus === "approved" ? "bg-slate-900 text-white hover:bg-slate-800 hover:text-white shadow-lg" : ""
                                       )}
                                       disabled={validationStatus !== "approved"} 
                                    >
                                       <Lock className={cn("h-4 w-4 mr-2", validationStatus === "approved" && "hidden")} /> 
                                       {validationStatus === "approved" && <Download className="h-4 w-4 mr-2" />}
                                       Generate RBQM Package
                                    </Button>
                                 </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-slate-900 text-white border-slate-800">
                                 {validationStatus !== "approved" ? "Requires SME sign-off before generating package" : "Ready to generate"}
                              </TooltipContent>
                           </Tooltip>
                        </TooltipProvider>
                     </div>
                     
                     {validationStatus !== "approved" && (
                        <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-2">
                           <AlertCircle className="h-3 w-3" />
                           Package generation is locked until SME validation is complete.
                        </p>
                     )}
                  </div>
               </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
