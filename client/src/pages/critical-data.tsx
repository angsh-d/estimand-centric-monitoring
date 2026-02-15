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
  Table as TableIcon, 
  GitBranch, 
  AlertTriangle, 
  ShieldCheck, 
  Download,
  Play,
  Settings,
  MoreHorizontal,
  Search,
  Filter,
  Check,
  FileCheck,
  ChevronDown,
  Sparkles,
  Zap,
  Activity,
  Network
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// --- Mock Data from Reference ---

const SOA = {
  id: "XYZ-301",
  title: "Phase III, Randomized, Double-Blind, Placebo-Controlled Study of Drug X in MDD",
  visits: [
    { id: "V1", label: "Screening", week: -2, win: "Day -14 to -1" },
    { id: "V2", label: "Baseline", week: 0, win: "Day 1" },
    { id: "V3", label: "Week 1", week: 1, win: "±2d" },
    { id: "V4", label: "Week 2", week: 2, win: "±3d" },
    { id: "V5", label: "Week 4", week: 4, win: "±3d" },
    { id: "V6", label: "Week 6", week: 6, win: "±3d" },
    { id: "V7", label: "Week 8", week: 8, win: "±3d", primary: true },
    { id: "V8", label: "Follow-up", week: 10, win: "±5d" },
  ],
  rows: [
    { name: "Informed Consent", v: [1,0,0,0,0,0,0,0] },
    { name: "Inclusion/Exclusion", v: [1,0,0,0,0,0,0,0] },
    { name: "Demographics", v: [1,0,0,0,0,0,0,0] },
    { name: "Medical History", v: [1,0,0,0,0,0,0,0] },
    { name: "MADRS", v: [1,1,1,1,1,1,1,0], highlight: true },
    { name: "CGI-S / CGI-I", v: [1,1,0,1,1,1,1,0] },
    { name: "Vital Signs", v: [1,1,1,1,1,1,1,1] },
    { name: "Laboratory Panel", v: [1,1,0,0,1,0,1,1] },
    { name: "12-Lead ECG", v: [1,1,0,0,0,0,1,0] },
    { name: "Adverse Events", v: [0,1,1,1,1,1,1,1] },
    { name: "Concomitant Meds", v: [1,1,1,1,1,1,1,1] },
    { name: "Study Drug Dispensing", v: [0,1,0,1,1,1,0,0] },
    { name: "Drug Accountability", v: [0,0,1,1,1,1,1,0] },
    { name: "Disposition", v: [0,0,0,0,0,0,0,1] },
  ],
};

const ACRF = [
  { dom: "DM", label: "Demographics", std: "CDASH DM v2.2", fields: [
    { var: "SUBJID", lbl: "Subject Identifier", type: "Char", cdash: "SUBJID", ct: null },
    { var: "BRTHDTC", lbl: "Date of Birth", type: "Date", cdash: "BRTHDTC", ct: null },
    { var: "SEX", lbl: "Sex", type: "Char", cdash: "SEX", ct: "M, F" },
    { var: "RACE", lbl: "Race", type: "Char", cdash: "RACE", ct: "CDISC Race CT" },
    { var: "ETHNIC", lbl: "Ethnicity", type: "Char", cdash: "ETHNIC", ct: "CDISC Ethnicity CT" },
  ]},
  { dom: "IE", label: "Inclusion/Exclusion", std: "CDASH IE v2.2", fields: [
    { var: "IETEST", lbl: "I/E Criterion", type: "Char", cdash: "IETEST", ct: null },
    { var: "IEORRES", lbl: "I/E Result", type: "Char", cdash: "IEORRES", ct: "Y, N" },
    { var: "IEDTC", lbl: "Date Assessed", type: "Date", cdash: "IEDTC", ct: null },
  ]},
  { dom: "QS", label: "Questionnaires — MADRS", std: "CDASH QS v2.2", note: "10 items per assessment (Q1 Apparent Sadness → Q10 Suicidal Thoughts). Total score derived.", fields: [
    { var: "QSCAT", lbl: "Category", type: "Char", cdash: "QSCAT", ct: "MADRS" },
    { var: "QSTEST", lbl: "MADRS Item", type: "Char", cdash: "QSTEST", ct: "MADRS item CT" },
    { var: "QSORRES", lbl: "Item Score (0–6)", type: "Num", cdash: "QSORRES", ct: "0,1,2,3,4,5,6" },
    { var: "QSDTC", lbl: "Assessment Date", type: "Date", cdash: "QSDTC", ct: null },
    { var: "VISITNUM", lbl: "Visit Number", type: "Num", cdash: "VISITNUM", ct: null },
    { var: "QSEVAL", lbl: "Evaluator", type: "Char", cdash: "QSEVAL", ct: "CLINICIAN" },
  ]},
  { dom: "QS-CGI", label: "Questionnaires — CGI", std: "CDASH QS v2.2", fields: [
    { var: "QSTEST", lbl: "CGI Assessment", type: "Char", cdash: "QSTEST", ct: "CGI-S, CGI-I" },
    { var: "QSORRES", lbl: "Score (1–7)", type: "Num", cdash: "QSORRES", ct: "1–7" },
    { var: "QSDTC", lbl: "Assessment Date", type: "Date", cdash: "QSDTC", ct: null },
  ]},
  { dom: "VS", label: "Vital Signs", std: "CDASH VS v2.2", fields: [
    { var: "VSTEST", lbl: "Test Name", type: "Char", cdash: "VSTEST", ct: "SYSBP, DIABP, HR, TEMP, WEIGHT" },
    { var: "VSORRES", lbl: "Result", type: "Num", cdash: "VSORRES", ct: null },
    { var: "VSORRESU", lbl: "Unit", type: "Char", cdash: "VSORRESU", ct: "CDISC Unit CT" },
    { var: "VSDTC", lbl: "Date", type: "Date", cdash: "VSDTC", ct: null },
  ]},
  { dom: "LB", label: "Laboratory", std: "CDASH LB v2.2", fields: [
    { var: "LBTEST", lbl: "Lab Test", type: "Char", cdash: "LBTEST", ct: "CDISC Lab CT" },
    { var: "LBORRES", lbl: "Result", type: "Char", cdash: "LBORRES", ct: null },
    { var: "LBORNRLO", lbl: "Normal Low", type: "Num", cdash: "LBORNRLO", ct: null },
    { var: "LBORNRHI", lbl: "Normal High", type: "Num", cdash: "LBORNRHI", ct: null },
    { var: "LBDTC", lbl: "Collection Date", type: "Date", cdash: "LBDTC", ct: null },
  ]},
  { dom: "EG", label: "ECG", std: "CDASH EG v2.2", fields: [
    { var: "EGTEST", lbl: "ECG Test", type: "Char", cdash: "EGTEST", ct: "CDISC ECG CT" },
    { var: "EGORRES", lbl: "Result", type: "Char", cdash: "EGORRES", ct: null },
    { var: "EGDTC", lbl: "Date", type: "Date", cdash: "EGDTC", ct: null },
  ]},
  { dom: "AE", label: "Adverse Events", std: "CDASH AE v2.2", fields: [
    { var: "AETERM", lbl: "AE Term (verbatim)", type: "Char", cdash: "AETERM", ct: null },
    { var: "AESTDTC", lbl: "Start Date", type: "Date", cdash: "AESTDTC", ct: null },
    { var: "AEENDTC", lbl: "End Date", type: "Date", cdash: "AEENDTC", ct: null },
    { var: "AESER", lbl: "Serious?", type: "Char", cdash: "AESER", ct: "Y, N" },
    { var: "AEREL", lbl: "Causality", type: "Char", cdash: "AEREL", ct: "CDISC Causality CT" },
    { var: "AEACN", lbl: "Action Taken", type: "Char", cdash: "AEACN", ct: "CDISC Action CT" },
    { var: "AEOUT", lbl: "Outcome", type: "Char", cdash: "AEOUT", ct: "CDISC Outcome CT" },
  ]},
  { dom: "CM", label: "Concomitant Meds", std: "CDASH CM v2.2", fields: [
    { var: "CMTRT", lbl: "Medication Name", type: "Char", cdash: "CMTRT", ct: null },
    { var: "CMSTDTC", lbl: "Start Date", type: "Date", cdash: "CMSTDTC", ct: null },
    { var: "CMENDTC", lbl: "End Date", type: "Date", cdash: "CMENDTC", ct: null },
    { var: "CMINDC", lbl: "Indication", type: "Char", cdash: "CMINDC", ct: null },
  ]},
  { dom: "EX", label: "Exposure", std: "CDASH EX v2.2", fields: [
    { var: "EXTRT", lbl: "Treatment", type: "Char", cdash: "EXTRT", ct: null },
    { var: "EXDOSE", lbl: "Dose", type: "Num", cdash: "EXDOSE", ct: null },
    { var: "EXSTDTC", lbl: "Start Date", type: "Date", cdash: "EXSTDTC", ct: null },
    { var: "EXENDTC", lbl: "End Date", type: "Date", cdash: "EXENDTC", ct: null },
  ]},
  { dom: "DS", label: "Disposition", std: "CDASH DS v2.2", fields: [
    { var: "DSSCAT", lbl: "Subcategory", type: "Char", cdash: "DSSCAT", ct: "COMPLETED, EARLY TERM" },
    { var: "DSTERM", lbl: "Reason", type: "Char", cdash: "DSTERM", ct: null },
    { var: "DSDTC", lbl: "Date", type: "Date", cdash: "DSDTC", ct: null },
  ]},
];

const DMAP_INIT = [
  { dom: "QS", field: "QSORRES (MADRS Q1–Q10)", sap: "AVAL = Σ(Q1..Q10)", deriv: "MADRS total = sum of 10 items", link: "Direct component of primary endpoint", tier: "1" },
  { dom: "QS", field: "QSORRES (MADRS, Visit 2)", sap: "BASE = AVAL at Visit 2", deriv: "Baseline MADRS total score", link: "Baseline for CHG computation", tier: "1" },
  { dom: "QS", field: "QSDTC (Visit 7 / Week 8)", sap: "ADT", deriv: "Assessment date at primary timepoint", link: "Window compliance — primary", tier: "1" },
  { dom: "QS", field: "VISITNUM", sap: "AVISIT / AVISITN", deriv: "Visit mapping for MMRM model", link: "Repeated measures structure", tier: "1" },
  { dom: "CM", field: "CMTRT (rescue medications)", sap: "CRIT1FL (rescue flag)", deriv: "If rescue → composite failure", link: "Intercurrent event — changes endpoint", tier: "1" },
  { dom: "EX", field: "EXSTDTC, EXENDTC", sap: "TRTSDT, TRTEDT", deriv: "Treatment start/end dates", link: "mITT definition (≥1 dose)", tier: "1" },
  { dom: "DM", field: "SUBJID, RFSTDTC", sap: "USUBJID, RFSTDTC", deriv: "Subject ID and reference start", link: "Population and windowing anchor", tier: "1" },
  { dom: "DS", field: "DSSCAT, DSDTC", sap: "EOSSTT, EOSDT", deriv: "Discontinuation flag + date", link: "Intercurrent event — treatment policy", tier: "2" },
  { dom: "QS", field: "QSORRES (MADRS, Visits 3–6)", sap: "AVAL at intermediate visits", deriv: "Intermediate MADRS scores", link: "MMRM — repeated measures", tier: "2" },
  { dom: "IE", field: "IEORRES", sap: "RANDFL", deriv: "I/E met → randomized", link: "Eligibility verification", tier: "2" },
  { dom: "QS-CGI", field: "QSORRES (CGI-S, CGI-I)", sap: "CGI analysis variables", deriv: "Key secondary endpoint", link: "Secondary analysis", tier: "2" },
  { dom: "AE", field: "AETERM, AESER, AEREL", sap: "Safety analysis variables", deriv: "AE characterization", link: "Safety — not primary estimand", tier: "3" },
  { dom: "DM", field: "SEX, RACE, AGE", sap: "Covariates in MMRM", deriv: "Stratification factors", link: "Model covariates — not derivation-critical", tier: "3" },
  { dom: "VS", field: "VSORRES (all)", sap: "Safety VS analysis", deriv: "Vital sign monitoring", link: "Safety analysis only", tier: "3" },
  { dom: "LB", field: "LBORRES (all)", sap: "Safety LB analysis", deriv: "Lab shift / toxicity grading", link: "Safety analysis only", tier: "3" },
  { dom: "EG", field: "EGORRES (all)", sap: "Safety ECG analysis", deriv: "QTc analysis", link: "Safety analysis only", tier: "3" },
];

const ESTS = [
  { id: "E1", label: "Primary Estimand", var: "Change from baseline in MADRS total score at Week 8", pop: "mITT (≥1 dose)", trt: "Drug X 200mg vs Placebo", ic: [{ ev: "Treatment discontinuation", st: "Treatment policy" }, { ev: "Rescue medication use", st: "Composite (failure)" }], sum: "Difference in means of change from baseline MADRS at Week 8, regardless of discontinuation, rescue = failure.", conf: 0.96 },
  { id: "E2", label: "Key Secondary", var: "MADRS response (≥50% reduction) at Week 8", pop: "mITT", trt: "Drug X 200mg vs Placebo", ic: [{ ev: "Treatment discontinuation", st: "Treatment policy" }], sum: "Proportion achieving ≥50% MADRS reduction at Week 8.", conf: 0.91 },
];

// --- Types ---
type WizardStep = 
  | "upload-protocol" 
  | "processing-soa" 
  | "review-soa" 
  | "processing-acrf" 
  | "review-acrf" 
  | "upload-sap" 
  | "processing-sap" 
  | "review-estimand" 
  | "review-derivation" 
  | "review-criticality" 
  | "complete";

// --- Helper Components ---

const ProcessingScreen = ({ title, steps, onComplete }: { title: string, steps: string[], onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000); 
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20" />
        <div className="relative h-20 w-20 bg-white rounded-full border border-slate-100 shadow-xl flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-600 animate-spin" />
          <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">{title}</h2>
      <div className="w-full space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-4 text-sm transition-all duration-500">
            <div className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-500 shrink-0",
              idx < currentStep ? "bg-emerald-500 border-emerald-500 text-white" :
              idx === currentStep ? "border-blue-500 text-blue-600 ring-4 ring-blue-50" :
              "border-slate-200 text-slate-300"
            )}>
              {idx < currentStep ? <Check className="h-3.5 w-3.5" /> : idx === currentStep ? <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" /> : null}
            </div>
            <span className={cn(
              "transition-all duration-500 font-medium text-left",
              idx < currentStep ? "text-slate-900" :
              idx === currentStep ? "text-blue-700 scale-105 origin-left" :
              "text-slate-400"
            )}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const UploadCard = ({ title, desc, icon: Icon, onUpload }: { title: string, desc: string, icon: any, onUpload: () => void }) => (
  <div 
    onClick={onUpload}
    className="relative overflow-hidden border border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:shadow-2xl transition-all cursor-pointer group h-[420px] max-w-xl mx-auto bg-white/50 backdrop-blur-sm"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    
    <div className="relative z-10 h-24 w-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-md">
      <Icon className="h-10 w-10 text-slate-900 stroke-[1.5]" />
    </div>
    <h3 className="relative z-10 text-2xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
    <p className="relative z-10 text-base text-slate-500 max-w-sm leading-relaxed mb-10">{desc}</p>
    <Button size="lg" className="relative z-10 pointer-events-none bg-slate-900 text-white shadow-lg group-hover:bg-blue-600 transition-colors">
      Select Document
    </Button>
  </div>
);

const Header = ({ step, total, title, desc, onNext, nextLabel, onBack }: any) => (
  <div className="flex justify-between items-start mb-8 shrink-0">
    <div>
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
        {onBack && <button onClick={onBack} className="hover:text-slate-900 transition-colors"><ChevronRight className="h-3 w-3 rotate-180" /></button>}
        Step {step} of {total}
      </div>
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
      <p className="text-base text-slate-500 mt-2 max-w-2xl">{desc}</p>
    </div>
    <Button onClick={onNext} className="gap-2 bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 px-6 h-11">
      {nextLabel || "Continue"} <ArrowRight className="h-4 w-4" />
    </Button>
  </div>
);

// --- Main Wizard Component ---

export default function CriticalData() {
  const [step, setStep] = useState<WizardStep>("upload-protocol");
  const [derivationData, setDerivationData] = useState(DMAP_INIT);
  const [selectedDomain, setSelectedDomain] = useState("QS");

  const toggleTier = (idx: number) => {
    const newData = [...derivationData];
    const currentTier = parseInt(newData[idx].tier);
    const newTier = currentTier === 3 ? 1 : currentTier + 1;
    newData[idx].tier = newTier.toString();
    setDerivationData(newData);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-[#F5F5F7]">
      {/* Top Breadcrumb */}
      {step !== "upload-protocol" && step !== "complete" && (
        <div className="flex items-center justify-between shrink-0 mb-6 px-4 pt-4">
          <div className="flex items-center gap-2 text-[13px] font-medium p-1 bg-white/50 backdrop-blur-md rounded-full border border-slate-200/60 shadow-sm px-3">
            <span className={cn("transition-colors", step.includes("protocol") || step.includes("soa") || step.includes("acrf") ? "text-slate-900" : "text-slate-400")}>Protocol</span>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className={cn("transition-colors", step.includes("sap") || step.includes("estimand") ? "text-slate-900" : "text-slate-400")}>Analysis</span>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className={cn("transition-colors", step.includes("derivation") || step.includes("criticality") ? "text-slate-900" : "text-slate-400")}>Data Source</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(i => {
              let active = false;
              if (step === "review-soa" && i <= 1) active = true;
              if (step === "review-acrf" && i <= 2) active = true;
              if (step === "review-estimand" && i <= 3) active = true;
              if (step === "review-derivation" && i <= 4) active = true;
              if (step === "review-criticality" && i <= 5) active = true;
              if (step === "complete" && i <= 6) active = true;
              return (
                <div key={i} className={cn("h-1.5 w-8 rounded-full transition-all duration-700", active ? "bg-slate-900" : "bg-slate-200")} />
              )
            })}
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="flex-1 mx-4 mb-4 bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
          <AnimatePresence mode="wait">
            
            {/* STEP 0: Upload Protocol */}
            {step === "upload-protocol" && (
              <motion.div 
                key="upload-proto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white"
              >
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider mb-6">
                    <Sparkles className="h-3 w-3" />
                    AI-Powered Study Design
                  </div>
                  <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">Criticality Model Builder</h1>
                  <p className="text-slate-500 text-lg max-w-lg mx-auto">Upload your protocol to automatically extract the schedule of activities and generate a risk-based quality management plan.</p>
                </div>
                <UploadCard 
                  title="Upload Protocol" 
                  icon={FileText}
                  desc="Drag and drop your clinical protocol (PDF/Word). The system will extract the SOA and generate a CDASH-annotated CRF." 
                  onUpload={() => setStep("processing-soa")} 
                />
              </motion.div>
            )}

            {/* STEP 1: Process Protocol */}
            {step === "processing-soa" && (
              <motion.div key="proc-soa" className="h-full flex items-center justify-center">
                <ProcessingScreen 
                  title="Analyzing Protocol Structure"
                  steps={[
                    "Parsing PDF document structure",
                    "Identifying Schedule of Activities (SOA)",
                    "Extracting visit matrix & timepoints",
                    "Mapping assessment windows",
                    "Validating logic against CDISC standards"
                  ]}
                  onComplete={() => setStep("review-soa")}
                />
              </motion.div>
            )}

            {/* STEP 2: SOA Review */}
            {step === "review-soa" && (
              <motion.div key="rev-soa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <Header 
                  step={1} total={6} 
                  title="Review Schedule of Activities" 
                  desc="The system has extracted the following visit matrix. This will drive the aCRF generation and downstream criticality mapping."
                  onNext={() => setStep("processing-acrf")}
                  nextLabel="Generate aCRF"
                />
                
                <div className="mb-6 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                    <FileText className="h-4 w-4 text-slate-400" />
                    {SOA.id} — {SOA.title}
                  </span>
                  <div className="flex gap-2">
                     <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                       <span className="h-2 w-2 rounded-full bg-blue-500"></span> Primary Endpoint Visit
                     </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto border border-slate-200 rounded-2xl shadow-sm bg-white relative">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50/80 backdrop-blur-sm text-slate-500 font-semibold sticky top-0 z-20">
                      <tr>
                        <th className="p-4 border-b border-slate-200 min-w-[220px] sticky left-0 bg-slate-50 z-30 shadow-[4px_0_12px_rgba(0,0,0,0.02)] text-[11px] uppercase tracking-wider">Assessment</th>
                        {SOA.visits.map((v, i) => (
                          <th key={i} className={cn("p-3 border-b border-slate-200 text-center min-w-[110px]", v.primary && "bg-blue-50/30")}>
                            <div className="text-[13px] text-slate-900 font-bold">{v.label}</div>
                            <div className="text-[11px] font-medium text-slate-400 mt-0.5">{v.win}</div>
                            {v.primary && <div className="text-[9px] font-bold text-blue-600 uppercase mt-1 tracking-wider bg-blue-50 inline-block px-1.5 py-0.5 rounded">Primary</div>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {SOA.rows.map((row, i) => (
                        <tr key={i} className={cn("hover:bg-slate-50 transition-colors group", row.highlight && "bg-blue-50/10")}>
                          <td className={cn("p-3 pl-6 font-medium text-slate-700 border-r border-slate-100 sticky left-0 bg-white z-10 text-[13px] group-hover:bg-slate-50 transition-colors", row.highlight && "bg-blue-50/10 font-semibold text-blue-900")}>
                            {row.name}
                          </td>
                          {row.v.map((val, j) => (
                            <td key={j} className={cn("p-3 text-center", row.highlight && "bg-blue-50/10")}>
                              {val === 1 ? (
                                <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center mx-auto shadow-sm transition-all duration-300 hover:scale-110", row.highlight ? "bg-blue-600 text-white shadow-blue-200" : "bg-slate-200 text-slate-500")}>
                                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                                </div>
                              ) : (
                                <span className="text-slate-200 text-2xl font-light leading-none">·</span>
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

            {/* STEP 3: Process aCRF */}
            {step === "processing-acrf" && (
              <motion.div key="proc-acrf" className="h-full flex items-center justify-center">
                 <ProcessingScreen 
                  title="Generating Annotated CRF"
                  steps={[
                    "Applying CDASH Implementation Guide v2.2",
                    "Mapping assessments to SDTM domains",
                    "Generating variable-level annotations",
                    "Applying controlled terminology (CDISC CT)",
                    "Cross-referencing SOA completeness"
                  ]}
                  onComplete={() => setStep("review-acrf")}
                />
              </motion.div>
            )}

            {/* STEP 4: Review aCRF */}
            {step === "review-acrf" && (
              <motion.div key="rev-acrf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <Header 
                  step={2} total={6} 
                  title="Review CDASH Domains" 
                  desc={`Generated ${ACRF.length} domains and ${ACRF.reduce((s, d) => s + d.fields.length, 0)} variables based on the Schedule of Activities.`}
                  onNext={() => setStep("upload-sap")}
                  nextLabel="Confirm & Upload SAP"
                />
                
                <div className="flex gap-2 mb-8 flex-wrap">
                  {ACRF.map(d => (
                    <button 
                      key={d.dom} 
                      onClick={() => setSelectedDomain(d.dom)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[12px] font-bold transition-all border shadow-sm",
                        selectedDomain === d.dom 
                          ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105" 
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                      )}
                    >
                      {d.dom}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-hidden border border-slate-200 rounded-2xl shadow-sm bg-white flex flex-col">
                  {ACRF.filter(d => d.dom === selectedDomain).map(d => (
                    <div key={d.dom} className="flex flex-col h-full animate-in fade-in duration-300">
                      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                          <div className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            {d.dom} — {d.label}
                            <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
                               <ShieldCheck className="h-3 w-3" /> CDASH v2.2
                            </span>
                          </div>
                          <div className="text-sm text-slate-500 mt-1">{d.fields.length} mapped variables</div>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm text-left">
                          <thead>
                            <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <th className="p-4 pl-6">Variable</th>
                              <th className="p-4">Label</th>
                              <th className="p-4">Type</th>
                              <th className="p-4 font-mono">CDASH VAR</th>
                              <th className="p-4">Controlled Terminology</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {d.fields.map((f, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                <td className="p-3 pl-6 font-mono text-[13px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{f.var}</td>
                                <td className="p-3 text-[13px] text-slate-600">{f.lbl}</td>
                                <td className="p-3"><span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{f.type}</span></td>
                                <td className="p-3 font-mono text-[12px] text-slate-400">{f.cdash}</td>
                                <td className="p-3 text-[12px] text-slate-500 font-medium">
                                  {f.ct ? (
                                    <span className="text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100 inline-block max-w-[200px] truncate" title={f.ct}>{f.ct}</span>
                                  ) : <span className="text-slate-300">—</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {d.note && (
                        <div className="p-4 bg-amber-50/50 border-t border-amber-100 text-xs text-amber-800 flex items-start gap-3 font-medium">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold uppercase text-[10px] tracking-wide mb-0.5">Note</div>
                            {d.note}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Upload SAP */}
            {step === "upload-sap" && (
              <motion.div 
                key="upload-sap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white"
              >
                <div className="mb-12 flex items-center gap-2 text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-full text-sm font-semibold border border-emerald-100 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  aCRF Generation Complete
                </div>
                <div className="text-center mb-2">
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">Upload Analysis Plan</h2>
                  <p className="text-slate-500 max-w-lg mx-auto text-lg">The platform will now extract estimands and map them to aCRF fields through derivation chains.</p>
                </div>
                <div className="mt-10">
                  <UploadCard 
                    title="Upload SAP" 
                    icon={Database}
                    desc="Statistical Analysis Plan (SAP) or Analysis Data Model (ADaM) specifications." 
                    onUpload={() => setStep("processing-sap")} 
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 6: Process SAP */}
            {step === "processing-sap" && (
              <motion.div key="proc-sap" className="h-full flex items-center justify-center">
                 <ProcessingScreen 
                  title="Parsing Analysis Plan"
                  steps={[
                    "Extracting estimand definitions",
                    "Identifying populations (ITT, PP, Safety)",
                    "Parsing derivation logic & formulas",
                    "Mapping intercurrent events",
                    "Tracing aCRF fields to Analysis variables"
                  ]}
                  onComplete={() => setStep("review-estimand")}
                />
              </motion.div>
            )}

            {/* STEP 7: Review Estimands */}
            {step === "review-estimand" && (
              <motion.div key="rev-est" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <Header 
                  step={3} total={6} 
                  title="Review Estimands" 
                  desc="The system has extracted the following estimands from the SAP. These define the primary and secondary objectives."
                  onNext={() => setStep("review-derivation")}
                  nextLabel="Approve Estimands"
                />
                
                <div className="space-y-6">
                  {ESTS.map((est) => (
                    <div key={est.id} className="border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition-all bg-white group cursor-default relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110" />
                      
                      <div className="relative z-10 flex items-start justify-between mb-8">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-slate-200">
                             {est.id}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-slate-900 text-xl tracking-tight">{est.label}</h3>
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2.5 py-1 rounded-full border border-emerald-100 font-bold uppercase tracking-wide flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> {Math.round(est.conf * 100)}% Confidence
                              </span>
                            </div>
                            <div className="text-base text-slate-600 font-medium">{est.var}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Population</div>
                           <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                             <UsersIcon className="h-4 w-4 text-slate-500" />
                             {est.pop}
                           </div>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Treatment Comparison</div>
                           <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                             <ScaleIcon className="h-4 w-4 text-slate-500" />
                             {est.trt}
                           </div>
                         </div>
                      </div>

                      <div className="relative z-10 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Intercurrent Events & Strategies</div>
                        <div className="grid grid-cols-1 gap-3">
                          {est.ic.map((ice, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                                </div>
                                <span className="text-sm text-slate-700 font-bold">{ice.ev}</span>
                              </div>
                              <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg text-[11px] border border-blue-100 shadow-sm">{ice.st}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 8: Derivation Map */}
            {step === "review-derivation" && (
              <motion.div key="rev-map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <Header 
                  step={4} total={6} 
                  title="Derivation Map" 
                  desc="Traceability established from Source (aCRF) → Analysis (SAP) → Estimand. This map validates that all critical data points are accounted for."
                  onNext={() => setStep("review-criticality")}
                  nextLabel="Review Criticality"
                />
                
                <div className="flex-1 overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col relative">
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0 z-10">
                        <tr>
                          <th className="p-4 pl-6 border-b border-slate-200 text-[11px] uppercase tracking-wider w-[120px]">Domain</th>
                          <th className="p-4 border-b border-slate-200 text-[11px] uppercase tracking-wider">Source Field</th>
                          <th className="p-4 border-b border-slate-200 text-[11px] uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              SAP Variable <ArrowRight className="h-3 w-3 text-slate-300" />
                            </div>
                          </th>
                          <th className="p-4 border-b border-slate-200 text-[11px] uppercase tracking-wider">Derivation Logic</th>
                          <th className="p-4 border-b border-slate-200 text-[11px] uppercase tracking-wider">Estimand Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {derivationData.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-3 pl-6">
                              <span className="bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg text-[12px] font-bold shadow-sm group-hover:border-blue-300 group-hover:text-blue-700 transition-colors block w-fit text-center min-w-[50px]">{row.dom}</span>
                            </td>
                            <td className="p-3 text-slate-700 font-mono text-[12px] font-medium">{row.field}</td>
                            <td className="p-3 text-slate-900 font-mono text-[12px] font-bold">{row.sap}</td>
                            <td className="p-3 text-slate-500 italic text-[12px] max-w-xs">{row.deriv}</td>
                            <td className="p-3">
                              <span className={cn(
                                "text-[11px] font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 w-fit shadow-sm",
                                row.link.includes("primary") || row.link.includes("Intercurrent") ? "bg-blue-50 text-blue-700 border-blue-100" : 
                                "bg-slate-50 text-slate-500 border-slate-100"
                              )}>
                                {row.link.includes("primary") && <Activity className="h-3.5 w-3.5" />}
                                {row.link}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 9: Criticality Review */}
            {step === "review-criticality" && (
              <motion.div key="rev-crit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <Header 
                  step={5} total={6} 
                  title="Criticality Review" 
                  desc="Verify tiers assigned to data points based on their impact on the primary estimand. Click on any tier to modify its classification."
                  onNext={() => setStep("complete")}
                  nextLabel="Finalize Model"
                />
                
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                   <div className="bg-slate-900 text-white p-6 rounded-[24px] flex items-center justify-between shadow-xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500"><ShieldCheck className="h-24 w-24" /></div>
                     <div className="relative z-10">
                       <div className="text-4xl font-bold tracking-tight mb-1">{derivationData.filter(d => d.tier === "1").length}</div>
                       <div className="text-[11px] font-bold opacity-80 uppercase tracking-widest">Tier 1 · Critical</div>
                     </div>
                   </div>
                   <div className="bg-white border border-slate-200 p-6 rounded-[24px] flex items-center justify-between shadow-sm group hover:border-blue-200 transition-colors">
                     <div>
                       <div className="text-4xl font-bold text-slate-700 tracking-tight mb-1">{derivationData.filter(d => d.tier === "2").length}</div>
                       <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors">Tier 2 · Important</div>
                     </div>
                   </div>
                   <div className="bg-white border border-slate-200 p-6 rounded-[24px] flex items-center justify-between shadow-sm group hover:border-blue-200 transition-colors">
                     <div>
                       <div className="text-4xl font-bold text-slate-700 tracking-tight mb-1">{derivationData.filter(d => d.tier === "3").length}</div>
                       <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors">Tier 3 · Supportive</div>
                     </div>
                   </div>
                </div>

                <div className="flex-1 overflow-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0 z-10">
                      <tr>
                        <th className="p-4 pl-6 border-b border-slate-200 text-[11px] uppercase tracking-wider">Source Field</th>
                        <th className="p-4 border-b border-slate-200 text-[11px] uppercase tracking-wider">Analysis Variable</th>
                        <th className="p-4 border-b border-slate-200 text-[11px] uppercase tracking-wider">Estimand Impact</th>
                        <th className="p-4 border-b border-slate-200 text-[11px] uppercase tracking-wider text-center">Assigned Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {derivationData.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 pl-6 font-medium text-slate-900">{row.field}</td>
                          <td className="p-3 text-slate-500 font-mono text-xs font-medium">{row.sap}</td>
                          <td className="p-3">
                            <span className="text-xs text-slate-600 font-medium">{row.link}</span>
                          </td>
                          <td className="p-3 text-center">
                            <button 
                              onClick={() => toggleTier(i)}
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

            {/* STEP 10: Complete */}
            {step === "complete" && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                <div className="h-32 w-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-10 shadow-lg border border-emerald-100">
                  <FileCheck className="h-16 w-16 stroke-[1.5]" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Model Complete</h2>
                <p className="text-slate-500 max-w-lg mb-12 text-lg leading-relaxed">
                  The Criticality Model has been successfully generated and validated. 16 derivation chains have been verified against Protocol V4.0 and SAP V1.2.
                </p>
                
                <div className="grid grid-cols-2 gap-5 w-full max-w-2xl mb-12 text-left">
                   <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                     <div className="text-[11px] text-slate-400 uppercase font-bold mb-2 tracking-wider">Domains Processed</div>
                     <div className="text-3xl font-bold text-slate-900">{ACRF.length}</div>
                   </div>
                   <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                     <div className="text-[11px] text-slate-400 uppercase font-bold mb-2 tracking-wider">Estimands Mapped</div>
                     <div className="text-3xl font-bold text-slate-900">{ESTS.length}</div>
                   </div>
                   <div className="p-6 bg-slate-900 rounded-3xl border border-slate-900 shadow-lg text-white">
                     <div className="text-[11px] text-slate-400 uppercase font-bold mb-2 tracking-wider">Critical Variables</div>
                     <div className="text-3xl font-bold">{derivationData.filter(d => d.tier === "1").length} <span className="text-base font-normal text-slate-400">Tier-1</span></div>
                   </div>
                   <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 shadow-sm">
                     <div className="text-[11px] text-amber-600 uppercase font-bold mb-2 tracking-wider">SME Validation</div>
                     <div className="text-3xl font-bold text-amber-700">Pending</div>
                   </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="gap-2 h-14 px-8 rounded-xl border-slate-200 text-slate-700 hover:bg-white hover:text-slate-900 font-medium">
                    <Download className="h-4 w-4" /> Export Report
                  </Button>
                  <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800 h-14 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all font-medium">
                    <Database className="h-4 w-4" /> Generate RBQM Package
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Icons for use in the component
function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ScaleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  )
}
