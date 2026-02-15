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
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

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

// --- Mock Data ---

const soaData = [
  { assessment: "Informed Consent", visits: ["X", "", "", "", "", "", "", ""] },
  { assessment: "Demographics", visits: ["X", "", "", "", "", "", "", ""] },
  { assessment: "Medical History", visits: ["X", "", "", "", "", "", "", ""] },
  { assessment: "Vital Signs", visits: ["X", "X", "X", "X", "X", "X", "X", "X"] },
  { assessment: "ECOG Performance Status", visits: ["X", "X", "X", "X", "X", "X", "X", "X"] },
  { assessment: "MADRS (Depression Scale)", visits: ["X", "X", "X", "X", "X", "X", "X", "X"], highlight: true },
  { assessment: "CGI-S", visits: ["X", "X", "X", "X", "X", "X", "X", "X"] },
  { assessment: "Hematology/Chemistry", visits: ["X", "X", "X", "X", "X", "X", "X", "X"] },
  { assessment: "Urinalysis", visits: ["X", "", "", "X", "", "", "X", ""] },
  { assessment: "pk Sampling", visits: ["", "X", "", "X", "", "X", "", ""] },
  { assessment: "Concomitant Meds", visits: ["X", "X", "X", "X", "X", "X", "X", "X"] },
  { assessment: "Adverse Events", visits: ["X", "X", "X", "X", "X", "X", "X", "X"] },
];

const visitLabels = ["Screening", "Baseline", "Week 1", "Week 2", "Week 4", "Week 6", "Week 8", "EOT"];

const cdashDomains = [
  { id: "DM", label: "Demographics", vars: 12 },
  { id: "IE", label: "Inclusion/Exclusion", vars: 8 },
  { id: "QS-MADRS", label: "MADRS Questionnaire", vars: 15, note: "Includes 10 items + Total" },
  { id: "QS-CGI", label: "CGI Scale", vars: 4 },
  { id: "VS", label: "Vital Signs", vars: 9 },
  { id: "LB", label: "Laboratory", vars: 22 },
  { id: "EG", label: "ECG", vars: 14 },
  { id: "AE", label: "Adverse Events", vars: 18 },
  { id: "CM", label: "Concomitant Meds", vars: 16 },
  { id: "EX", label: "Exposure", vars: 10 },
  { id: "DS", label: "Disposition", vars: 6 },
];

const estimands = [
  {
    id: "EST-001",
    label: "Primary: Change from Baseline in MADRS at Week 8",
    population: "ITT (Intent-to-Treat)",
    variable: "MADRS Total Score",
    intercurrent: [
      { event: "Rescue Medication", strategy: "Composite" },
      { event: "Discontinuation due to AE", strategy: "Treatment Policy" }
    ]
  },
  {
    id: "EST-002",
    label: "Secondary: CGI-S Response Rate",
    population: "Per Protocol",
    variable: "CGI-S Score <= 2",
    intercurrent: [
      { event: "Protocol Deviation", strategy: "Exclude" }
    ]
  }
];

const derivationMap = [
  { domain: "QS", field: "QSORRES (MADRS Item 1)", sap: "MADRS.ITEM1", derivation: "Direct Map", estimand: "Pri: MADRS Change", tier: "1" },
  { domain: "QS", field: "QSORRES (MADRS Item 2)", sap: "MADRS.ITEM2", derivation: "Direct Map", estimand: "Pri: MADRS Change", tier: "1" },
  { domain: "QS", field: "QSTESTCD='MADRS_TOT'", sap: "AVAL", derivation: "Sum(Item 1..10)", estimand: "Pri: MADRS Change", tier: "1" },
  { domain: "CM", field: "CMTRT", sap: "RESCUE_MED", derivation: "Lookup(Whodrug)", estimand: "Pri: Rescue (ICE)", tier: "1" },
  { domain: "DS", field: "DSDECOD", sap: "EOS_REASON", derivation: "Direct Map", estimand: "Pri: Discon (ICE)", tier: "1" },
  { domain: "VS", field: "VSORRES (Weight)", sap: "VS.WGT", derivation: "Direct Map", estimand: "Safety", tier: "2" },
  { domain: "LB", field: "LBORRES (ALT)", sap: "LB.ALT", derivation: "Direct Map", estimand: "Safety", tier: "2" },
  { domain: "AE", field: "AETERM", sap: "AE.TERM", derivation: "Direct Map", estimand: "Safety", tier: "2" },
  { domain: "MH", field: "MHTERM", sap: "MH.TERM", derivation: "Direct Map", estimand: "None", tier: "3" },
];

// --- Components ---

const ProcessingScreen = ({ title, steps, onComplete }: { title: string, steps: string[], onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20" />
        <div className="relative h-16 w-16 bg-white rounded-full border border-slate-100 shadow-sm flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-6">{title}</h2>
      <div className="w-full space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm">
            <div className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors",
              idx < currentStep ? "bg-emerald-500 border-emerald-500 text-white" :
              idx === currentStep ? "border-blue-500 text-blue-600 animate-pulse" :
              "border-slate-200 text-slate-300"
            )}>
              {idx < currentStep && <Check className="h-3 w-3" />}
              {idx === currentStep && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
            </div>
            <span className={cn(
              "transition-colors font-medium",
              idx < currentStep ? "text-slate-900" :
              idx === currentStep ? "text-blue-700" :
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

const UploadCard = ({ title, desc, onUpload }: { title: string, desc: string, onUpload: () => void }) => (
  <div 
    onClick={onUpload}
    className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group h-[400px]"
  >
    <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <UploadCloud className="h-8 w-8" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{desc}</p>
    <Button variant="outline" className="mt-6 pointer-events-none">
      Select Document
    </Button>
  </div>
);

export default function CriticalData() {
  const [step, setStep] = useState<WizardStep>("upload-protocol");
  const [derivationData, setDerivationData] = useState(derivationMap);

  const toggleTier = (idx: number) => {
    const newData = [...derivationData];
    const currentTier = parseInt(newData[idx].tier);
    const newTier = currentTier === 3 ? 1 : currentTier + 1;
    newData[idx].tier = newTier.toString();
    setDerivationData(newData);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            Criticality Model Builder
          </h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 mt-1 font-medium">
            <span>Protocol</span>
            <ChevronRight className="h-3 w-3" />
            <span>Analysis</span>
            <ChevronRight className="h-3 w-3" />
            <span>Data Source</span>
          </div>
        </div>
        
        {step !== "upload-protocol" && step !== "complete" && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Progress</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={cn(
                  "h-1.5 w-6 rounded-full transition-colors",
                  // Very rough mapping of steps to progress bars for visual flair
                  (step === "review-soa" && i <= 1) || 
                  (step === "review-acrf" && i <= 2) ||
                  (step === "review-estimand" && i <= 3) ||
                  (step === "review-derivation" && i <= 4) ||
                  (step === "review-criticality" && i <= 5) ||
                  (step === "complete" && i <= 6)
                    ? "bg-blue-600" 
                    : "bg-slate-100"
                )} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            
            {step === "upload-protocol" && (
              <motion.div 
                key="upload-proto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <UploadCard 
                  title="Upload Protocol" 
                  desc="Upload the clinical protocol (PDF/Word). The system will extract the SOA and generate a CDASH-annotated CRF." 
                  onUpload={() => setStep("processing-soa")} 
                />
              </motion.div>
            )}

            {step === "processing-soa" && (
              <motion.div key="proc-soa" className="h-full">
                <ProcessingScreen 
                  title="Analyzing Protocol Structure"
                  steps={[
                    "Parsing document structure",
                    "Identifying Schedule of Activities (SOA)",
                    "Extracting visit matrix",
                    "Mapping assessment windows",
                    "Validating logic"
                  ]}
                  onComplete={() => setStep("review-soa")}
                />
              </motion.div>
            )}

            {step === "review-soa" && (
              <motion.div key="rev-soa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Step 1 of 6</div>
                    <h2 className="text-xl font-semibold text-slate-900">Review Schedule of Activities</h2>
                    <p className="text-slate-500 text-sm">Extracted 12 assessments across 8 visits.</p>
                  </div>
                  <Button onClick={() => setStep("processing-acrf")} className="gap-2">
                    Generate aCRF <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 overflow-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 z-10">
                      <tr>
                        <th className="p-3 border-b border-slate-200 min-w-[200px]">Assessment</th>
                        {visitLabels.map((v, i) => (
                          <th key={i} className={cn("p-3 border-b border-slate-200 text-center min-w-[80px]", v === "Week 8" && "bg-blue-50 text-blue-700")}>
                            {v}
                            {v === "Week 8" && <div className="text-[9px] font-bold text-blue-600 uppercase">Primary</div>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {soaData.map((row, i) => (
                        <tr key={i} className={cn("hover:bg-slate-50", row.highlight && "bg-blue-50/30")}>
                          <td className="p-3 font-medium text-slate-700 border-r border-slate-50">{row.assessment}</td>
                          {row.visits.map((val, j) => (
                            <td key={j} className="p-3 text-center text-slate-400">
                              {val === "X" && <div className="h-2 w-2 bg-slate-400 rounded-full mx-auto" />}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {step === "processing-acrf" && (
              <motion.div key="proc-acrf" className="h-full">
                 <ProcessingScreen 
                  title="Generating Annotated CRF"
                  steps={[
                    "Applying CDASH v2.2 standards",
                    "Mapping to SDTM domains",
                    "Generating variable annotations",
                    "Applying controlled terminology"
                  ]}
                  onComplete={() => setStep("review-acrf")}
                />
              </motion.div>
            )}

            {step === "review-acrf" && (
              <motion.div key="rev-acrf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Step 2 of 6</div>
                    <h2 className="text-xl font-semibold text-slate-900">Review CDASH Domains</h2>
                    <p className="text-slate-500 text-sm">Generated 11 domains with 47 annotated variables.</p>
                  </div>
                  <Button onClick={() => setStep("upload-sap")} className="gap-2">
                    Confirm & Proceed <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cdashDomains.map((domain) => (
                    <div key={domain.id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-default group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-lg font-bold text-slate-900">{domain.id}</span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{domain.vars} vars</span>
                      </div>
                      <div className="text-sm font-medium text-slate-600 mb-1">{domain.label}</div>
                      {domain.note && (
                        <div className="text-[11px] text-blue-600 bg-blue-50 p-2 rounded mt-2">
                          Note: {domain.note}
                        </div>
                      )}
                      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-2 text-[11px] text-slate-400 group-hover:text-blue-500 transition-colors">
                        <CheckCircle2 className="h-3 w-3" /> CDASH Compliant
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "upload-sap" && (
              <motion.div 
                key="upload-sap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <div className="mb-8 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-sm font-medium border border-emerald-100">
                  <CheckCircle2 className="h-4 w-4" />
                  aCRF Generation Complete (11 domains)
                </div>
                <UploadCard 
                  title="Upload SAP" 
                  desc="Upload the Statistical Analysis Plan (SAP) to extract estimands and build derivation chains." 
                  onUpload={() => setStep("processing-sap")} 
                />
              </motion.div>
            )}

            {step === "processing-sap" && (
              <motion.div key="proc-sap" className="h-full">
                 <ProcessingScreen 
                  title="Parsing Analysis Plan"
                  steps={[
                    "Extracting estimand definitions",
                    "Identifying populations (ITT, PP, Safety)",
                    "Parsing derivation logic",
                    "Mapping intercurrent events",
                    "Tracing aCRF fields to Analysis variables"
                  ]}
                  onComplete={() => setStep("review-estimand")}
                />
              </motion.div>
            )}

            {step === "review-estimand" && (
              <motion.div key="rev-est" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Step 3 of 6</div>
                    <h2 className="text-xl font-semibold text-slate-900">Review Estimands</h2>
                    <p className="text-slate-500 text-sm">Extracted 2 primary/secondary estimands.</p>
                  </div>
                  <Button onClick={() => setStep("review-derivation")} className="gap-2">
                    Approve <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {estimands.map((est) => (
                    <div key={est.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                             {est.id.split('-')[1]}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-base">{est.label}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                               <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                                 Pop: {est.population}
                               </span>
                               <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                                 Var: {est.variable}
                               </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Intercurrent Events</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {est.intercurrent.map((ice, i) => (
                            <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded border border-slate-200 text-sm">
                              <span className="text-slate-700">{ice.event}</span>
                              <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px]">{ice.strategy}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "review-derivation" && (
              <motion.div key="rev-map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Step 4 of 6</div>
                    <h2 className="text-xl font-semibold text-slate-900">Derivation Map</h2>
                    <p className="text-slate-500 text-sm">Tracing data from Source (aCRF) to Analysis (SAP).</p>
                  </div>
                  <Button onClick={() => setStep("review-criticality")} className="gap-2">
                    Next: Criticality <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-slate-50/50">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white text-slate-500 font-medium sticky top-0 z-10 border-b border-slate-200">
                      <tr>
                        <th className="p-3 pl-4">aCRF Domain</th>
                        <th className="p-3">Source Field</th>
                        <th className="p-3">SAP Variable</th>
                        <th className="p-3">Derivation Logic</th>
                        <th className="p-3">Estimand Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {derivationData.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-3 pl-4 font-medium text-slate-900">
                            <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs">{row.domain}</span>
                          </td>
                          <td className="p-3 text-slate-600 font-mono text-xs">{row.field}</td>
                          <td className="p-3 text-slate-600 font-mono text-xs">{row.sap}</td>
                          <td className="p-3 text-slate-500 italic">{row.derivation}</td>
                          <td className="p-3">
                            <span className={cn(
                              "text-[11px] font-medium px-2 py-1 rounded-full border",
                              row.estimand.includes("Pri") ? "bg-blue-50 text-blue-700 border-blue-100" : 
                              row.estimand === "None" ? "bg-slate-50 text-slate-400 border-slate-100" :
                              "bg-emerald-50 text-emerald-700 border-emerald-100"
                            )}>
                              {row.estimand}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {step === "review-criticality" && (
              <motion.div key="rev-crit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Step 5 of 6</div>
                    <h2 className="text-xl font-semibold text-slate-900">Criticality Review</h2>
                    <p className="text-slate-500 text-sm">Assign criticality tiers to source data. Click tiers to edit.</p>
                  </div>
                  <Button onClick={() => setStep("complete")} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                    Finalize Model <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                   <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
                     <div>
                       <div className="text-2xl font-bold">{derivationData.filter(d => d.tier === "1").length}</div>
                       <div className="text-[11px] font-medium opacity-70 uppercase tracking-wide">Tier 1 (Critical)</div>
                     </div>
                     <ShieldCheck className="h-5 w-5 opacity-50" />
                   </div>
                   <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                     <div>
                       <div className="text-2xl font-bold text-slate-700">{derivationData.filter(d => d.tier === "2").length}</div>
                       <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Tier 2 (Important)</div>
                     </div>
                   </div>
                   <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                     <div>
                       <div className="text-2xl font-bold text-slate-700">{derivationData.filter(d => d.tier === "3").length}</div>
                       <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Tier 3 (Standard)</div>
                     </div>
                   </div>
                </div>

                <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 z-10 border-b border-slate-200">
                      <tr>
                        <th className="p-3 pl-4">Source Field</th>
                        <th className="p-3">Analysis Variable</th>
                        <th className="p-3">Estimand Impact</th>
                        <th className="p-3 text-center">Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {derivationData.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-3 pl-4 font-medium text-slate-900">{row.field}</td>
                          <td className="p-3 text-slate-500 font-mono text-xs">{row.sap}</td>
                          <td className="p-3">
                            <span className="text-xs text-slate-600">{row.estimand}</span>
                          </td>
                          <td className="p-3 text-center">
                            <button 
                              onClick={() => toggleTier(i)}
                              className={cn(
                                "h-7 w-7 rounded-full text-xs font-bold transition-all hover:scale-110 shadow-sm",
                                row.tier === "1" ? "bg-slate-900 text-white ring-2 ring-slate-100" :
                                row.tier === "2" ? "bg-white text-slate-700 border border-slate-300" :
                                "bg-slate-100 text-slate-400"
                              )}
                            >
                              {row.tier}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {step === "complete" && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="h-24 w-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Model Complete</h2>
                <p className="text-slate-500 max-w-md mb-8">
                  The Criticality Model has been validated. 16 derivation chains verified against Protocol V4.0 and SAP V1.2.
                </p>
                
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-8 text-left">
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <div className="text-xs text-slate-400 uppercase font-bold mb-1">Domains</div>
                     <div className="font-semibold text-slate-900">11 Processed</div>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <div className="text-xs text-slate-400 uppercase font-bold mb-1">Estimands</div>
                     <div className="font-semibold text-slate-900">2 Mapped</div>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <div className="text-xs text-slate-400 uppercase font-bold mb-1">Critical Vars</div>
                     <div className="font-semibold text-slate-900">5 Tier-1 Fields</div>
                   </div>
                   <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                     <div className="text-xs text-amber-500 uppercase font-bold mb-1">SME Review</div>
                     <div className="font-semibold text-amber-700">Pending Sign-off</div>
                   </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> Export Report
                  </Button>
                  <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
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
