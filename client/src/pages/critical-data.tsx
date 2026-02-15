import { useState, useEffect } from "react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
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
  LogOut,
  Command
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

// --- Mock Data ---

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
];

// --- Styled Components ---

const AppleCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-black/[0.03]", className)}>
    {children}
  </div>
);

const AppleBadge = ({ children, active, color = "blue" }: { children: React.ReactNode, active?: boolean, color?: "blue" | "green" | "amber" | "gray" }) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    gray: "bg-slate-400"
  };
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors",
      active ? "bg-black/[0.03] text-black" : "text-black/60"
    )}>
      <div className={cn("h-1.5 w-1.5 rounded-full", colors[color])} />
      {children}
    </div>
  );
};

const SkeletonLine = ({ className }: { className?: string }) => (
  <div className={cn("h-4 bg-black/[0.04] rounded animate-pulse", className)} />
);

const ProvenanceTooltip = ({ source, conf = "high", children }: { source: string, conf?: string, children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild className="cursor-help">
        {children}
      </TooltipTrigger>
      <TooltipContent sideOffset={4} className="bg-white/90 backdrop-blur-xl text-black border-black/5 text-xs p-3 max-w-xs shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl z-50">
        <div className="font-semibold mb-1 flex items-center gap-1.5 text-black/60 uppercase tracking-wider text-[10px]">
          <FileText className="h-3 w-3" /> Provenance
        </div>
        <p className="mb-2 text-black/90">Extracted from: <span className="font-medium">{source}</span></p>
        {conf === "low" && (
            <div className="flex items-start gap-1.5 text-amber-700 bg-amber-50 p-2 rounded-lg text-[10px] leading-tight">
                <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                <span>Low confidence extraction. System inferred this relationship. Verification recommended.</span>
            </div>
        )}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// --- Main Page ---

export default function CriticalData() {
  const [step, setStep] = useState("upload-protocol");
  const [soaData, setSoaData] = useState(SOA_INIT);
  const [acrfData, setAcrfData] = useState(ACRF_INIT);
  const [estimands, setEstimands] = useState(ESTS_INIT);
  const [derivationData, setDerivationData] = useState(DMAP_INIT);
  
  // Validation State
  const [smeAssigned, setSmeAssigned] = useState(false);
  const [validationStatus, setValidationStatus] = useState("pending");
  const [currentUser, setCurrentUser] = useState<"study-director" | "sme">("study-director");
  const [tierFilter, setTierFilter] = useState<string | null>(null);

  // File Upload
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStep("processing-soa");
    }
  };

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
      setCurrentUser("study-director");
  };

  // Apple-style Step Indicator
  const renderBreadcrumbs = () => {
    const steps = [
      { id: "protocol", label: "Protocol" },
      { id: "acrf", label: "aCRF" },
      { id: "sap", label: "Analysis" },
      { id: "criticality", label: "Criticality" },
    ];
    
    return (
      <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {steps.map((s, i) => {
          const isActive = step.includes(s.id);
          const isPast = steps.findIndex(st => step.includes(st.id)) > i;
          
          return (
            <div key={s.id} className="flex items-center">
              <div className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                isActive || isPast ? "text-black" : "text-black/40"
              )}>
                {s.label}
              </div>
              {i < steps.length - 1 && (
                <div className="h-3 w-[1px] bg-black/[0.08] mx-1" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-[#F5F5F7] font-sans antialiased text-[#1d1d1f]">
      
      {/* Persona Switcher */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-black/5 flex items-center gap-1 transition-transform hover:scale-105">
            <button 
                onClick={() => setCurrentUser("study-director")}
                className={cn(
                    "px-4 py-2 rounded-full text-[11px] font-semibold transition-all flex items-center gap-2",
                    currentUser === "study-director" ? "bg-black text-white shadow-md" : "text-black/60 hover:text-black hover:bg-black/5"
                )}
            >
                <User className="h-3.5 w-3.5" /> Study Director
            </button>
            <button 
                onClick={() => setCurrentUser("sme")}
                className={cn(
                    "px-4 py-2 rounded-full text-[11px] font-semibold transition-all flex items-center gap-2",
                    currentUser === "sme" ? "bg-[#34C759] text-white shadow-md" : "text-black/60 hover:text-black hover:bg-black/5"
                )}
            >
                <UserCheck className="h-3.5 w-3.5" /> SME View
            </button>
        </div>
      </div>

      {/* SME Banner */}
      <AnimatePresence>
        {currentUser === "sme" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-b border-black/[0.06] px-6 py-3 flex justify-between items-center z-40"
            >
                <div className="flex items-center gap-4">
                    <div className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-xs text-gray-600">JS</div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">John Smith</span>
                        <span className="text-[11px] text-gray-500">Lead Statistician • Validation Mode</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <AppleBadge active color="green">Action Required</AppleBadge>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Breadcrumb */}
      {step !== "upload-protocol" && step !== "complete" && currentUser === "study-director" && (
        <div className="px-8 pt-6 pb-2 shrink-0 flex items-center justify-between">
           {renderBreadcrumbs()}
           
           <div className="flex gap-2">
             <Button variant="ghost" size="sm" className="text-black/60 hover:text-black hover:bg-black/5 h-8 rounded-full text-xs">
                <History className="h-3.5 w-3.5 mr-1.5" /> History
             </Button>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 px-8 pb-8 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto scroll-smooth py-4">
          <AnimatePresence mode="wait">

            {/* --- SME Validation View --- */}
            {currentUser === "sme" && (
                <motion.div 
                    key="sme-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto pt-8"
                >
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-semibold tracking-tight text-black mb-2">Model Validation</h1>
                        <p className="text-gray-500">Review and approve criticality definitions for XYZ-301.</p>
                    </div>

                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-8 space-y-6">
                            <AppleCard className="p-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                                    Estimand Definition Review
                                </h3>
                                <div className="space-y-4">
                                    {estimands.map(est => (
                                        <div key={est.id} className="p-4 rounded-xl bg-gray-50/50 border border-black/[0.03] transition-colors hover:bg-gray-50">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-semibold text-sm">{est.label}</span>
                                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                  {Math.round(est.conf * 100)}% Conf
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-xs mb-3 leading-relaxed">{est.sum}</p>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="h-7 text-xs bg-white border border-gray-200 text-gray-900 shadow-sm hover:bg-gray-50 rounded-lg">Approve</Button>
                                                <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-400 hover:text-gray-900">Comment</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AppleCard>
                        </div>

                        <div className="col-span-4">
                             <AppleCard className="p-6 h-full flex flex-col sticky top-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Approval Action</h3>
                                <p className="text-xs text-gray-500 mb-8 leading-relaxed">
                                    Certify alignment with SAP and Protocol.
                                </p>
                                
                                <div className="mt-auto space-y-3">
                                    {validationStatus === "approved" ? (
                                        <div className="p-4 bg-[#34C759]/10 text-[#34C759] rounded-xl text-center font-medium text-sm flex flex-col items-center gap-2">
                                            <CheckCircle2 className="h-6 w-6" />
                                            Model Approved
                                        </div>
                                    ) : (
                                        <>
                                            <Button className="w-full bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white shadow-lg rounded-xl h-11 text-sm font-medium" onClick={handleSMEApprove}>
                                                Approve Model
                                            </Button>
                                            <Button variant="ghost" className="w-full text-gray-500 hover:text-gray-900 rounded-xl h-11 text-sm">
                                                Request Changes
                                            </Button>
                                        </>
                                    )}
                                </div>
                             </AppleCard>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* --- STEP 0: Upload Protocol --- */}
            {step === "upload-protocol" && currentUser !== "sme" && (
              <motion.div 
                key="upload-proto"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/5 text-black/60 text-[11px] font-medium uppercase tracking-wide mb-8 shadow-sm">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    Intelligent Study Design
                  </div>
                  <h1 className="text-5xl font-semibold text-[#1d1d1f] tracking-tight mb-4">Criticality Model Builder</h1>
                  <p className="text-[#86868b] text-xl max-w-xl mx-auto font-light leading-relaxed">
                    Transform your protocol into a risk-based quality management plan.
                  </p>
                </div>
                
                <div 
                  className="group relative cursor-pointer" 
                  onClick={() => document.getElementById('protocol-upload')?.click()}
                >
                  <input 
                    type="file" 
                    id="protocol-upload" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                  />
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />
                  <AppleCard className="relative p-16 flex flex-col items-center justify-center text-center w-[540px] h-[360px] border border-black/[0.04] shadow-2xl shadow-black/[0.03]">
                     <div className="h-16 w-16 bg-[#F5F5F7] text-black/40 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 group-hover:text-blue-600 transition-all duration-500">
                       <UploadCloud className="h-8 w-8 stroke-[1.5]" />
                     </div>
                     <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Upload Protocol</h3>
                     <p className="text-[#86868b] mb-10 text-sm">PDF or Word document • Max 50MB</p>
                     <Button className="bg-[#1d1d1f] text-white hover:bg-black/80 w-48 rounded-full h-11 text-sm font-medium shadow-lg transition-all hover:scale-[1.02]">
                       Select Document
                     </Button>
                  </AppleCard>
                </div>
              </motion.div>
            )}

            {/* --- STEP 1: Processing Protocol --- */}
            {step === "processing-soa" && currentUser !== "sme" && (
               <motion.div key="proc-soa" className="h-full flex items-center justify-center">
                 <div className="flex flex-col items-center max-w-sm w-full">
                    <div className="relative mb-12">
                       <div className="h-16 w-16 rounded-full border-[3px] border-black/5 border-t-blue-600 animate-spin" />
                    </div>
                    <h2 className="text-xl font-medium text-[#1d1d1f] mb-8">Digitizing Protocol</h2>
                    <div className="w-full space-y-5">
                       {["Parsing document structure", "Identifying Schedule of Activities", "Extracting visit matrix", "Validating windows"].map((label, i) => (
                         <div key={i} className="flex items-center gap-4 text-sm animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: `${i * 1500}ms` }}>
                            <div className="h-5 w-5 rounded-full bg-[#34C759] flex items-center justify-center shadow-sm">
                              <Check className="h-3 w-3 text-white stroke-[3]" />
                            </div>
                            <span className="text-[#1d1d1f]/80 font-medium">{label}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="hidden">{setTimeout(() => setStep("review-soa"), 8000)}</div>
               </motion.div>
            )}

            {/* --- STEP 2: Review SOA --- */}
            {step === "review-soa" && currentUser !== "sme" && (
              <motion.div key="rev-soa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-[1400px] mx-auto">
                <div className="flex justify-between items-end mb-8 px-2">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#1d1d1f] flex items-center gap-3">
                      Review Schedule
                      <AppleBadge active color="blue">AI Extracted</AppleBadge>
                    </h2>
                    <p className="text-[#86868b] mt-1 text-sm">Verify extracted visits and assessments.</p>
                  </div>
                  <div className="flex gap-3">
                     <Button variant="outline" className="gap-2 rounded-full h-9 px-4 text-xs font-medium border-black/10 hover:bg-black/5">
                       <Plus className="h-3.5 w-3.5" /> Add Item
                     </Button>
                     <Button onClick={() => setStep("processing-acrf")} className="bg-[#1d1d1f] text-white hover:bg-black/90 gap-2 rounded-full h-9 px-5 text-xs font-medium shadow-md">
                       Generate aCRF <ArrowRight className="h-3.5 w-3.5" />
                     </Button>
                  </div>
                </div>

                <AppleCard className="flex-1 overflow-hidden flex flex-col">
                   <div className="flex-1 overflow-auto">
                     <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-50/80 sticky top-0 z-20 backdrop-blur-md">
                          <tr>
                            <th className="p-4 border-b border-black/[0.06] min-w-[220px] sticky left-0 bg-gray-50/95 z-30 font-semibold text-[#1d1d1f]">Assessment</th>
                            {soaData.visits.map((v, i) => (
                              <th key={i} className="p-3 border-b border-black/[0.06] text-center min-w-[100px] font-medium text-[#1d1d1f]">
                                 <div className="text-xs">{v.label}</div>
                                 <div className="text-[10px] text-[#86868b] mt-0.5">{v.win}</div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {soaData.rows.map((row, i) => (
                            <tr key={i} className="group hover:bg-black/[0.02] transition-colors border-b border-black/[0.03] last:border-0">
                              <td className="p-3 pl-4 border-r border-black/[0.03] sticky left-0 bg-white group-hover:bg-gray-50/50 z-10 font-medium text-[#1d1d1f]">
                                 <div className="flex items-center gap-2">
                                    {row.conf === "low" && <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                    <span className={cn(row.conf === "low" && "text-amber-900")}>{row.name}</span>
                                 </div>
                                 <div className="text-[10px] text-[#86868b] mt-0.5 flex items-center gap-1 font-mono opacity-60">
                                    <FileText className="h-2.5 w-2.5" /> {row.source}
                                 </div>
                              </td>
                              {row.v.map((val, j) => (
                                <td key={j} className="p-3 text-center">
                                   {val === 1 ? (
                                     <ProvenanceTooltip source={row.source} conf={row.conf}>
                                        <div className={cn(
                                           "h-6 w-6 rounded-full flex items-center justify-center mx-auto transition-all cursor-pointer",
                                           row.conf === "low" ? "bg-amber-100 text-amber-600" : "bg-blue-50 text-blue-600"
                                        )}>
                                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                        </div>
                                     </ProvenanceTooltip>
                                   ) : (
                                     <div className="h-6 w-6 rounded-full flex items-center justify-center mx-auto opacity-0 group-hover:opacity-100 cursor-pointer hover:bg-black/5">
                                       <Plus className="h-3 w-3 text-[#86868b]" />
                                     </div>
                                   )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                     </table>
                   </div>
                </AppleCard>
              </motion.div>
            )}

            {/* --- STEP 3: Processing aCRF --- */}
            {step === "processing-acrf" && currentUser !== "sme" && (
               <motion.div key="proc-acrf" className="h-full flex items-center justify-center">
                 <div className="flex flex-col items-center max-w-sm w-full">
                    <div className="relative mb-8">
                       <div className="h-12 w-12 rounded-full border-[3px] border-black/5 border-t-blue-600 animate-spin" />
                    </div>
                    <h2 className="text-lg font-medium text-[#1d1d1f] mb-4">Generating Annotated CRF</h2>
                    <div className="w-full space-y-3">
                        <SkeletonLine className="w-full" />
                        <SkeletonLine className="w-3/4 mx-auto" />
                    </div>
                    <div className="hidden">{setTimeout(() => setStep("review-acrf"), 6000)}</div>
                 </div>
               </motion.div>
            )}

            {/* --- STEP 4: Review aCRF --- */}
            {step === "review-acrf" && currentUser !== "sme" && (
              <motion.div key="rev-acrf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-[1000px] mx-auto">
                 <div className="flex justify-between items-center mb-8">
                    <div>
                       <h2 className="text-2xl font-semibold text-[#1d1d1f]">Review Annotated CRF</h2>
                       <p className="text-[#86868b] text-sm mt-1">CDASH v2.2 Standards Applied</p>
                    </div>
                    <Button onClick={() => setStep("upload-sap")} className="bg-[#1d1d1f] text-white hover:bg-black/90 gap-2 rounded-full h-9 px-5 text-xs font-medium shadow-md">
                       Next Phase <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                 </div>

                 <div className="flex-1 overflow-auto pb-4 space-y-8">
                    {acrfData.map((domain, i) => (
                      <div key={i}>
                         <div className="flex items-center gap-3 mb-4">
                            <div className="h-6 w-10 bg-black/5 rounded flex items-center justify-center text-[10px] font-bold text-black/60">{domain.dom}</div>
                            <h3 className="font-semibold text-[#1d1d1f] text-sm">{domain.label}</h3>
                            <span className="text-[10px] text-[#86868b] ml-auto font-mono bg-white px-2 py-1 rounded border border-black/5">{domain.std}</span>
                         </div>
                         <AppleCard className="overflow-hidden">
                            <table className="w-full text-sm text-left">
                               <thead className="bg-gray-50/50 text-[#86868b] font-medium text-[11px] uppercase tracking-wider">
                                  <tr>
                                     <th className="p-3 pl-5 font-medium">Variable</th>
                                     <th className="p-3 font-medium">Label</th>
                                     <th className="p-3 font-medium">Type</th>
                                     <th className="p-3 font-medium">Source</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-black/[0.03]">
                                  {domain.fields.map((field, j) => (
                                     <tr key={j} className="hover:bg-black/[0.01]">
                                        <td className="p-3 pl-5 font-mono text-[#1d1d1f] text-xs">{field.var}</td>
                                        <td className="p-3 text-black/70 text-xs">{field.lbl}</td>
                                        <td className="p-3"><span className="text-[10px] bg-black/5 px-2 py-0.5 rounded text-black/60">{field.type}</span></td>
                                        <td className="p-3 text-[10px] text-[#86868b]">{field.source}</td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                         </AppleCard>
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
                className="h-full flex flex-col items-center justify-center"
              >
                <div className="mb-8 flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide">
                  <CheckCircle2 className="h-3 w-3" /> Phase 2 Complete
                </div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-3">Analysis Plan</h2>
                <div 
                  className="bg-white border border-black/10 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all w-[480px] h-[280px]"
                  onClick={() => setStep("processing-sap")}
                >
                   <div className="h-14 w-14 bg-[#F5F5F7] text-black/40 rounded-2xl flex items-center justify-center mb-6">
                     <Database className="h-6 w-6" />
                   </div>
                   <h3 className="font-semibold text-lg text-[#1d1d1f]">Select SAP Document</h3>
                   <p className="text-[#86868b] text-sm mt-2">ADaM Specifications</p>
                </div>
              </motion.div>
            )}

            {/* --- STEP 6: Process SAP --- */}
            {step === "processing-sap" && currentUser !== "sme" && (
               <motion.div key="proc-sap" className="h-full flex items-center justify-center">
                 <div className="flex flex-col items-center w-64">
                    <div className="h-12 w-12 rounded-full border-[3px] border-black/5 border-t-blue-600 animate-spin mb-6" />
                    <h2 className="text-lg font-medium text-[#1d1d1f] mb-4">Parsing Analysis Plan</h2>
                    <div className="w-full space-y-2">
                        <SkeletonLine />
                        <SkeletonLine className="w-2/3 mx-auto" />
                    </div>
                    <div className="hidden">{setTimeout(() => setStep("review-estimand"), 6000)}</div>
                 </div>
               </motion.div>
            )}

            {/* --- STEP 7: Review Estimands --- */}
            {step === "review-estimand" && currentUser !== "sme" && (
               <motion.div key="rev-est" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-[1000px] mx-auto">
                  <div className="flex justify-between items-center mb-8">
                     <div>
                        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Review Estimands</h2>
                        <p className="text-[#86868b] text-sm mt-1">Extracted from SAP. Defines primary objectives.</p>
                     </div>
                     <Button onClick={() => setStep("review-derivation")} className="bg-[#1d1d1f] text-white hover:bg-black/90 gap-2 rounded-full h-9 px-5 text-xs font-medium shadow-md">
                        Confirm <ArrowRight className="h-3.5 w-3.5" />
                     </Button>
                  </div>

                  <div className="space-y-6 overflow-auto pb-4">
                     {estimands.map((est, i) => (
                        <AppleCard key={i} className="p-6 hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start mb-5">
                              <div className="flex gap-4">
                                 <div className="h-10 w-10 bg-black text-white rounded-xl flex items-center justify-center font-semibold text-xs">
                                    {est.id}
                                 </div>
                                 <div>
                                    <h3 className="font-semibold text-base text-[#1d1d1f]">{est.label}</h3>
                                    <p className="text-[#86868b] text-sm mt-0.5">{est.var}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <ShieldCheck className="h-3 w-3" />
                                {Math.round(est.conf * 100)}% Confidence
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-[#F5F5F7] p-4 rounded-xl">
                                 <div className="text-[10px] font-semibold text-black/40 uppercase mb-1">Population</div>
                                 <div className="font-medium text-[#1d1d1f] text-sm">{est.pop}</div>
                              </div>
                              <div className="bg-[#F5F5F7] p-4 rounded-xl">
                                 <div className="text-[10px] font-semibold text-black/40 uppercase mb-1">Treatment</div>
                                 <div className="font-medium text-[#1d1d1f] text-sm">{est.trt}</div>
                              </div>
                           </div>
                           <div className="mt-4 pt-4 border-t border-black/5 flex justify-end">
                              <div className="text-[10px] text-[#86868b] flex items-center gap-1">
                                 <FileText className="h-3 w-3" /> Source: {est.source}
                              </div>
                           </div>
                        </AppleCard>
                     ))}
                  </div>
               </motion.div>
            )}

            {/* --- STEP 8: Derivation Map --- */}
            {step === "review-derivation" && currentUser !== "sme" && (
               <motion.div key="rev-map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-[1200px] mx-auto">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Derivation Map</h2>
                        <p className="text-[#86868b] text-sm mt-1">Traceability: Source (aCRF) → Analysis (SAP) → Estimand.</p>
                     </div>
                     <Button onClick={() => setStep("review-criticality")} className="bg-[#1d1d1f] text-white hover:bg-black/90 gap-2 rounded-full h-9 px-5 text-xs font-medium shadow-md">
                        Review Criticality <ArrowRight className="h-3.5 w-3.5" />
                     </Button>
                  </div>

                  <AppleCard className="flex-1 overflow-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-[#86868b] font-medium text-[11px] uppercase tracking-wider sticky top-0 backdrop-blur-md">
                           <tr>
                              <th className="p-4 pl-6">Domain</th>
                              <th className="p-4">Source Field</th>
                              <th className="p-4">SAP Variable</th>
                              <th className="p-4">Derivation Logic</th>
                              <th className="p-4">Estimand Link</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.03]">
                           {derivationData.map((row, i) => (
                              <tr key={i} className="hover:bg-black/[0.01] group">
                                 <td className="p-3 pl-6">
                                    <div className="inline-block bg-white border border-black/10 rounded px-2 py-0.5 text-[10px] font-bold text-black/70">{row.dom}</div>
                                 </td>
                                 <td className="p-3 text-[#1d1d1f] font-mono text-xs">{row.field}</td>
                                 <td className="p-3 text-[#1d1d1f] font-mono text-xs font-semibold">{row.sap}</td>
                                 <td className="p-3 relative">
                                    <div className="text-[#86868b] text-xs max-w-xs">{row.deriv}</div>
                                 </td>
                                 <td className="p-3">
                                    <div className="flex flex-col gap-1">
                                       <span className="text-xs font-medium text-[#1d1d1f]">{row.link}</span>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </AppleCard>
               </motion.div>
            )}

            {/* --- STEP 9: Criticality Review --- */}
            {step === "review-criticality" && currentUser !== "sme" && (
               <motion.div key="rev-crit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-[1200px] mx-auto">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Criticality Review</h2>
                        <p className="text-[#86868b] text-sm mt-1">Validate risk-based tier assignments.</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="flex bg-white p-1 rounded-full border border-black/5 shadow-sm">
                           {["1", "2", "3"].map(t => (
                              <button 
                                 key={t}
                                 onClick={() => setTierFilter(tierFilter === t ? null : t)}
                                 className={cn(
                                    "px-4 py-1.5 text-xs font-medium rounded-full transition-all",
                                    tierFilter === t ? "bg-black text-white shadow-sm" : "text-black/50 hover:text-black"
                                 )}
                              >
                                 Tier {t}
                              </button>
                           ))}
                           {tierFilter && (
                              <button onClick={() => setTierFilter(null)} className="px-3 text-black/40 hover:text-black"><X className="h-3 w-3" /></button>
                           )}
                        </div>
                        <Button onClick={() => setStep("complete")} className="bg-[#34C759] hover:bg-[#34C759]/90 text-white gap-2 rounded-full h-9 px-5 text-xs font-medium shadow-md">
                           Finalize Model <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                     </div>
                  </div>

                  <AppleCard className="flex-1 overflow-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-[#86868b] font-medium text-[11px] uppercase tracking-wider sticky top-0 backdrop-blur-md">
                           <tr>
                              <th className="p-4 pl-6">Analysis Variable</th>
                              <th className="p-4">Impact Reasoning</th>
                              <th className="p-4 text-center">Assigned Tier</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.03]">
                           {filteredDerivations.map((row) => (
                              <tr key={row.id} className="hover:bg-black/[0.01]">
                                 <td className="p-4 pl-6">
                                    <div className="font-semibold text-[#1d1d1f]">{row.sap}</div>
                                    <div className="text-[10px] text-[#86868b] font-mono mt-0.5">Source: {row.field}</div>
                                 </td>
                                 <td className="p-4">
                                    <div className="text-sm text-[#1d1d1f] mb-1">{row.link}</div>
                                    <div className="flex items-center gap-2 text-[10px] text-[#86868b]">
                                       <Info className="h-3 w-3" />
                                       Required for primary analysis model (SAP Sec 4.1)
                                    </div>
                                 </td>
                                 <td className="p-4 text-center">
                                    <button 
                                       onClick={() => toggleTier(row.id)}
                                       className={cn(
                                          "px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all hover:scale-105 shadow-sm uppercase tracking-wide min-w-[70px]",
                                          row.tier === "1" ? "bg-black text-white" :
                                          row.tier === "2" ? "bg-white text-black border border-black/10" :
                                          "bg-gray-100 text-gray-400"
                                       )}
                                    >
                                       Tier {row.tier}
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </AppleCard>
               </motion.div>
            )}

            {/* --- STEP 10: Complete / Validation --- */}
            {step === "complete" && currentUser !== "sme" && (
               <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-8">
                  <div className="max-w-2xl w-full">
                     <div className="flex items-center gap-8 mb-10">
                        <div className="h-28 w-28 bg-white rounded-[24px] flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/[0.02] shrink-0">
                           <FileCheck className="h-12 w-12 text-[#34C759]" />
                        </div>
                        <div>
                           <h2 className="text-4xl font-semibold text-[#1d1d1f] mb-2 tracking-tight">Model Generated</h2>
                           <p className="text-[#86868b] text-lg">
                              Criticality model V0.1 is ready for validation. 
                           </p>
                        </div>
                     </div>

                     <AppleCard className="p-8 mb-8">
                        <h3 className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-6">Audit Summary</h3>
                        <div className="grid grid-cols-3 gap-6 text-center divide-x divide-black/[0.04]">
                           <div>
                              <div className="text-3xl font-semibold text-[#1d1d1f]">100%</div>
                              <div className="text-xs text-[#86868b] mt-1 font-medium">AI Generated</div>
                           </div>
                           <div>
                              <div className="text-3xl font-semibold text-[#1d1d1f]">2</div>
                              <div className="text-xs text-[#86868b] mt-1 font-medium">Human Modifications</div>
                           </div>
                           <div>
                              <div className="text-3xl font-semibold text-[#1d1d1f]">0</div>
                              <div className="text-xs text-[#86868b] mt-1 font-medium">Validation Flags</div>
                           </div>
                        </div>
                     </AppleCard>

                     <div className="flex gap-4">
                        {validationStatus === "pending" ? (
                           <Dialog>
                             <DialogTrigger asChild>
                               <Button className="flex-1 h-14 bg-[#1d1d1f] text-white hover:bg-black/90 text-base font-medium shadow-lg rounded-2xl">
                                 <UserCheck className="h-5 w-5 mr-2" /> Route to SME for Validation
                               </Button>
                             </DialogTrigger>
                             <DialogContent className="rounded-2xl border-black/5 shadow-2xl bg-white/90 backdrop-blur-xl">
                               <DialogHeader>
                                 <DialogTitle>Assign Validator</DialogTitle>
                                 <DialogDescription>
                                   Select a subject matter expert to review this model.
                                 </DialogDescription>
                               </DialogHeader>
                               <div className="grid gap-4 py-4">
                                  <div className="flex items-center justify-between p-4 border border-black/5 rounded-xl cursor-pointer hover:bg-black/[0.02] transition-colors">
                                     <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600">JS</div>
                                        <div>
                                           <div className="font-semibold text-sm text-[#1d1d1f]">John Smith</div>
                                           <div className="text-xs text-[#86868b]">Lead Statistician</div>
                                        </div>
                                     </div>
                                     <Button size="sm" variant="secondary" onClick={handleRouteToSME}>Assign</Button>
                                  </div>
                               </div>
                             </DialogContent>
                           </Dialog>
                        ) : (
                           <div className="flex-1 h-14 bg-[#34C759]/10 border border-[#34C759]/20 rounded-2xl flex items-center justify-center text-[#34C759] font-semibold gap-2">
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
                                          "h-14 px-8 border-black/10 rounded-2xl text-[#1d1d1f] transition-all",
                                          validationStatus === "approved" ? "bg-[#1d1d1f] text-white hover:bg-black shadow-lg border-transparent" : "opacity-60"
                                       )}
                                       disabled={validationStatus !== "approved"} 
                                    >
                                       <Lock className={cn("h-4 w-4 mr-2", validationStatus === "approved" && "hidden")} /> 
                                       {validationStatus === "approved" && <Download className="h-4 w-4 mr-2" />}
                                       Generate RBQM Package
                                    </Button>
                                 </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#1d1d1f] text-white border-transparent">
                                 {validationStatus !== "approved" ? "Requires SME sign-off before generating package" : "Ready to generate"}
                              </TooltipContent>
                           </Tooltip>
                        </TooltipProvider>
                     </div>
                     
                     {validationStatus !== "approved" && (
                        <p className="text-center text-xs text-[#86868b] mt-6 flex items-center justify-center gap-2">
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
