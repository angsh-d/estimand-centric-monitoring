import { useState } from "react";
import { 
  CheckCircle2, 
  UserCheck, 
  Lock, 
  Download,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  User,
  AlertTriangle,
  ArrowRight,
  Database,
  Layout,
  List,
  Eye,
  MousePointer2,
  Table,
  FileText,
  GitBranch,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AppleCard, AppleBadge } from "@/components/criticality/shared";

// Import the new JSON
import CRF_CRITICALITY_REPORT from "@/data/crf_criticality.json";

// Mock CRF Form Components
const CRFField = ({ 
  label, 
  variable, 
  value = "", 
  mappedInfo = null,
  onShowLineage
}: { 
  label: string; 
  variable: string; 
  value?: string; 
  mappedInfo?: any;
  onShowLineage?: (info: any) => void;
}) => {
  return (
    <div className={cn(
      "relative p-3 rounded-lg border transition-all",
      mappedInfo 
        ? "bg-red-50/30 border-red-200 ring-2 ring-red-100" 
        : "bg-white border-gray-200 hover:border-gray-300"
    )}>
      <div className="flex justify-between items-start mb-1.5">
        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block">
          {label}
        </label>
        <span className="text-[10px] font-mono text-gray-400">{variable}</span>
      </div>
      
      <div className="h-8 bg-gray-50 border border-gray-200 rounded px-2 flex items-center text-sm text-gray-600 font-mono justify-between">
        <span>{value}</span>
        {mappedInfo && onShowLineage && (
           <button 
             onClick={(e) => {
               e.stopPropagation();
               onShowLineage(mappedInfo);
             }}
             className="h-5 w-5 hover:bg-gray-200 rounded flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
             title="View Data Lineage"
           >
             <GitBranch className="h-3 w-3" />
           </button>
        )}
      </div>

      {mappedInfo && (
        <div className="absolute -top-3 -right-3 z-10">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "h-6 px-2 rounded-full flex items-center gap-1 shadow-sm cursor-pointer transition-transform hover:scale-105",
                    mappedInfo.criticality_tier === 1 ? "bg-red-600 text-white" : "bg-amber-500 text-white"
                  )}
                  onClick={(e) => {
                    if (onShowLineage) {
                      e.stopPropagation();
                      onShowLineage(mappedInfo);
                    }
                  }}
                >
                  <ShieldCheck className="h-3 w-3" />
                  <span className="text-[10px] font-bold">T{mappedInfo.criticality_tier}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="w-80 p-4 bg-white border-gray-200 shadow-xl text-gray-900">
                <div className="space-y-3">
                  <div>
                     <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Critical Data Point</span>
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded",
                          mappedInfo.criticality_tier === 1 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        )}>
                          TIER {mappedInfo.criticality_tier}
                        </span>
                     </div>
                     <h4 className="font-semibold text-sm">{mappedInfo.criticality_description}</h4>
                  </div>
                  
                  <div className="text-xs bg-gray-50 p-2 rounded border border-gray-100">
                    <span className="font-semibold text-gray-700">Risk:</span> {mappedInfo.risk_if_erroneous}
                  </div>

                  <div>
                     <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Impacted Estimands</span>
                     <div className="flex flex-wrap gap-1">
                        {mappedInfo.estimands_impacted.map((est: string) => (
                           <span key={est} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                              {est}
                           </span>
                        ))}
                     </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100 flex justify-end">
                    <div className="text-[10px] text-blue-600 font-medium flex items-center cursor-pointer hover:underline">
                      <GitBranch className="h-3 w-3 mr-1" /> View Lineage Trace
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

const MockDispositionForm = ({ mappings, onShowLineage }: { mappings: any[], onShowLineage: (info: any) => void }) => {
  const deathDateMapping = {
    criticality_tier: 1,
    criticality_description: "Date of Death",
    risk_if_erroneous: "Incorrect date alters Overall Survival duration.",
    estimands_impacted: ["E1", "E2"],
    lineage_path: ["DTHDAT (Death Date) → V2 (Event Date) → V1 (OS Time) → M1 (Cox Model) → E1 (Primary OS)"]
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-2 mb-4">
         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">DS - Disposition (Survival)</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <CRFField label="Subject ID" variable="USUBJID" value="109-001" />
        <CRFField label="Visit Date" variable="VISITDAT" value="2025-11-18" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <CRFField label="Did the subject die?" variable="DTHFL" value="Yes" />
        <CRFField 
          label="Date of Death" 
          variable="DTHDAT" 
          value="2025-11-17"
          mappedInfo={deathDateMapping}
          onShowLineage={onShowLineage}
        />
        <CRFField label="Primary Cause of Death" variable="DTHCAUS" value="Disease Progression" />
      </div>
    </div>
  );
};

const MockLabForm = ({ mappings, onShowLineage }: { mappings: any[], onShowLineage: (info: any) => void }) => {
  const neutMapping = mappings.find(m => m.mapped_crf_fields.some((f: any) => f.mapping_rationale.includes("Neutrophils")));
  const albMapping = mappings.find(m => m.mapped_crf_fields.some((f: any) => f.mapping_rationale.includes("Albumin")));
  // Create mock mappings for the other 4 if they don't exist in the JSON, sharing the same criticality logic
  const lymphMapping = mappings.find(m => m.mapped_crf_fields.some((f: any) => f.mapping_rationale.includes("Lymphocytes"))) || neutMapping;
  const ldhMapping = mappings.find(m => m.mapped_crf_fields.some((f: any) => f.mapping_rationale.includes("LDH"))) || neutMapping;
  const ggtMapping = mappings.find(m => m.mapped_crf_fields.some((f: any) => f.mapping_rationale.includes("GGT"))) || neutMapping;
  const astMapping = mappings.find(m => m.mapped_crf_fields.some((f: any) => f.mapping_rationale.includes("AST"))) || neutMapping;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-2 mb-4">
         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">LB - Laboratory Results</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
         <div className="col-span-3 bg-gray-50 p-2 rounded text-xs font-medium text-gray-500 text-center mb-2">
            Record 1
         </div>
         <CRFField label="Test Name" variable="LBTEST" value="Neutrophils" />
         <CRFField 
            label="Result" 
            variable="LBORRES" 
            value="4.5" 
            mappedInfo={neutMapping}
            onShowLineage={onShowLineage}
         />
         <CRFField label="Unit" variable="LBORRESU" value="10^9/L" />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-gray-200">
         <div className="col-span-3 bg-gray-50 p-2 rounded text-xs font-medium text-gray-500 text-center mb-2">
            Record 2
         </div>
         <CRFField label="Test Name" variable="LBTEST" value="Albumin" />
         <CRFField 
            label="Result" 
            variable="LBORRES" 
            value="38" 
            mappedInfo={albMapping}
            onShowLineage={onShowLineage}
         />
         <CRFField label="Unit" variable="LBORRESU" value="g/L" />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-gray-200">
         <div className="col-span-3 bg-gray-50 p-2 rounded text-xs font-medium text-gray-500 text-center mb-2">
            Record 3
         </div>
         <CRFField label="Test Name" variable="LBTEST" value="Lymphocytes" />
         <CRFField 
            label="Result" 
            variable="LBORRES" 
            value="1.2" 
            mappedInfo={lymphMapping}
            onShowLineage={onShowLineage}
         />
         <CRFField label="Unit" variable="LBORRESU" value="10^9/L" />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-gray-200">
         <div className="col-span-3 bg-gray-50 p-2 rounded text-xs font-medium text-gray-500 text-center mb-2">
            Record 4
         </div>
         <CRFField label="Test Name" variable="LBTEST" value="LDH" />
         <CRFField 
            label="Result" 
            variable="LBORRES" 
            value="240" 
            mappedInfo={ldhMapping}
            onShowLineage={onShowLineage}
         />
         <CRFField label="Unit" variable="LBORRESU" value="U/L" />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-gray-200">
         <div className="col-span-3 bg-gray-50 p-2 rounded text-xs font-medium text-gray-500 text-center mb-2">
            Record 5
         </div>
         <CRFField label="Test Name" variable="LBTEST" value="GGT" />
         <CRFField 
            label="Result" 
            variable="LBORRES" 
            value="45" 
            mappedInfo={ggtMapping}
            onShowLineage={onShowLineage}
         />
         <CRFField label="Unit" variable="LBORRESU" value="U/L" />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-gray-200">
         <div className="col-span-3 bg-gray-50 p-2 rounded text-xs font-medium text-gray-500 text-center mb-2">
            Record 6
         </div>
         <CRFField label="Test Name" variable="LBTEST" value="AST" />
         <CRFField 
            label="Result" 
            variable="LBORRES" 
            value="32" 
            mappedInfo={astMapping}
            onShowLineage={onShowLineage}
         />
         <CRFField label="Unit" variable="LBORRESU" value="U/L" />
      </div>
    </div>
  );
};

const MockTumorForm = ({ mappings, onShowLineage }: { mappings: any[], onShowLineage: (info: any) => void }) => {
  const scanDateMapping = {
    criticality_tier: 2,
    criticality_description: "Date of Tumor Assessment Scan",
    risk_if_erroneous: "Incorrect scan date alters PFS event time for secondary endpoint (E5).",
    estimands_impacted: ["E5"],
    lineage_path: ["TUDAT (Scan Date) → V10 (Progression Date) → V7 (PFS Time) → M8 (PFS Analysis) → E5 (Secondary PFS)"]
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-2 mb-4">
         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">TU - Tumor Assessment</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CRFField label="Visit Name" variable="VISIT" value="Week 12" />
        <CRFField 
          label="Date of Scan" 
          variable="TUDAT" 
          value="2025-12-15"
          mappedInfo={scanDateMapping}
          onShowLineage={onShowLineage}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
         <CRFField label="Target Lesions Identified?" variable="TUTARG" value="Yes" />
         <CRFField label="Method of Assessment" variable="TUMETHOD" value="CT Scan" />
      </div>
    </div>
  );
};


const MockQSForm = ({ mappings, onShowLineage }: { mappings: any[], onShowLineage: (info: any) => void }) => {
  const q29Mapping = {
    criticality_tier: 2,
    criticality_description: "Q29: Overall Health",
    risk_if_erroneous: "Source for PRO Global Health Status endpoint (E13).",
    estimands_impacted: ["E13"],
    lineage_path: ["QS.QLQ30_29 (Overall Health) → Mean Score → Normalized (0-100) → CFB → MMRM → E13"]
  };
  const q30Mapping = {
    criticality_tier: 2,
    criticality_description: "Q30: Quality of Life",
    risk_if_erroneous: "Source for PRO Global Health Status endpoint (E13).",
    estimands_impacted: ["E13"],
    lineage_path: ["QS.QLQ30_30 (Quality of Life) → Mean Score → Normalized (0-100) → CFB → MMRM → E13"]
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-2 mb-4">
         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">QS - EORTC QLQ-C30</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <CRFField label="Visit" variable="VISIT" value="Week 6" />
        <CRFField label="Date of Assessment" variable="QSDTC" value="2025-10-22" />
      </div>

      <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100 space-y-4">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Global Health Status / QoL</div>
        
        <div className="grid grid-cols-1 gap-4">
          <CRFField 
            label="29. How would you rate your overall health during the past week?" 
            variable="QS.QLQ30_29" 
            value="6" 
            mappedInfo={q29Mapping}
            onShowLineage={onShowLineage}
          />
          <CRFField 
            label="30. How would you rate your overall quality of life during the past week?" 
            variable="QS.QLQ30_30" 
            value="5" 
            mappedInfo={q30Mapping}
            onShowLineage={onShowLineage}
          />
        </div>
      </div>
    </div>
  );
};

export default function CriticalityAnalysis() {
  const [step, setStep] = useState("review-criticality");
  const [viewMode, setViewMode] = useState<"list" | "annotated">("annotated");
  const [activeForm, setActiveForm] = useState<"DS" | "LB" | "TU" | "QS">("DS");
  const [currentUser, setCurrentUser] = useState<"study-director" | "sme">("study-director");
  const [validationStatus, setValidationStatus] = useState("pending");
  const [smeAssigned, setSmeAssigned] = useState(false);
  const [selectedLineageItem, setSelectedLineageItem] = useState<any>(null);
  
  // Use data from JSON
  const mappedItems = CRF_CRITICALITY_REPORT.mappings;
  const unmappedItems = CRF_CRITICALITY_REPORT.unmapped_criticality_items;

  const handleRouteToSME = () => {
    setSmeAssigned(true);
    setValidationStatus("assigned");
  };

  const handleSMEApprove = () => {
      setValidationStatus("approved");
      setCurrentUser("study-director");
  };

  const handleShowLineage = (info: any) => {
    setSelectedLineageItem(info);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header - Aligned with MVR Copilot style */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            Criticality Analysis
            <span className="text-[10px] font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
              {validationStatus === "approved" ? "Validated" : "Draft Model"}
            </span>
          </h1>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-medium">
            <span>Mapping Review</span>
            <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
            <span>SAP Traceability</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           {/* View Toggle */}
           <div className="bg-slate-100 p-1 rounded-lg flex text-[11px] font-medium text-slate-600 mr-4">
              <button 
                onClick={() => setViewMode("annotated")}
                className={cn(
                  "px-3 py-1 rounded-md transition-all flex items-center gap-2",
                  viewMode === "annotated" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
                )}
              >
                <Layout className="h-3 w-3" /> Annotated CRF
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={cn(
                  "px-3 py-1 rounded-md transition-all flex items-center gap-2",
                  viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
                )}
              >
                <List className="h-3 w-3" /> List View
              </button>
           </div>

           <div className="bg-slate-100 p-1 rounded-lg flex text-[11px] font-medium text-slate-600">
              <button 
                onClick={() => setCurrentUser("study-director")}
                className={cn(
                  "px-3 py-1 rounded-md transition-all flex items-center gap-2",
                  currentUser === "study-director" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
                )}
              >
                <User className="h-3 w-3" /> Study Director
              </button>
              <button 
                onClick={() => setCurrentUser("sme")}
                className={cn(
                  "px-3 py-1 rounded-md transition-all flex items-center gap-2",
                  currentUser === "sme" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
                )}
              >
                <UserCheck className="h-3 w-3" /> SME View
              </button>
           </div>
           
           <div className="h-4 w-px bg-slate-200" />
           
           <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={() => setStep("complete")}
           >
              Finalize Model
           </Button>
        </div>
      </header>

      {/* SME Banner */}
      <AnimatePresence>
        {currentUser === "sme" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-blue-50/50 border-b border-blue-100 px-6 py-2 flex justify-between items-center z-40 text-xs"
            >
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                       <div className="h-6 w-6 rounded-full bg-white border-2 border-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-700">JS</div>
                    </div>
                    <span className="text-blue-900 font-medium">John Smith (Lead Statistician) is validating this model.</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-blue-700 font-medium">Active Session</span>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
           <div className="flex-1 overflow-y-auto p-6 md:p-8">
             <div className="max-w-6xl mx-auto">
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
                        <p className="text-gray-500">Review and approve criticality definitions for PEARL (NCT03003962).</p>
                    </div>

                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-8 space-y-6">
                            {/* Review Mapped Items */}
                            {mappedItems.map((item: any, i: number) => (
                                <AppleCard key={i} className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex gap-3">
                                            <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                                                T{item.criticality_tier}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sm text-[#1d1d1f]">{item.criticality_description}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{item.source_hint_id}</span>
                                                    <span className="text-[10px] text-gray-400">→</span>
                                                    {item.mapped_crf_fields.map((f: any) => (
                                                        <span key={f.variableName} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-mono">
                                                            {f.domain}.{f.variableName}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                            <ShieldCheck className="h-3 w-3" />
                                            Validated Match
                                        </div>
                                    </div>
                                    <div className="bg-gray-50/50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed border border-black/[0.03]">
                                        <span className="font-semibold text-gray-900">Rationale:</span> {item.mapped_crf_fields[0].mapping_rationale}
                                    </div>
                                </AppleCard>
                            ))}
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

            {/* --- ANNOTATED CRF VIEW (NEW) --- */}
            {viewMode === "annotated" && step !== "complete" && currentUser !== "sme" && (
               <motion.div 
                 key="annotated-view"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full flex gap-8"
               >
                  {/* Left: Form Navigator */}
                  <div className="w-64 shrink-0 space-y-4">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CRF Forms</h3>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">4 Forms</span>
                     </div>
                     <nav className="space-y-1">
                        {[
                          { id: "DS", label: "Disposition (Survival)", criticalCount: 1 },
                          { id: "LB", label: "Laboratory", criticalCount: 2 },
                          { id: "TU", label: "Tumor Assessment", criticalCount: 1 },
                          { id: "QS", label: "PRO (EORTC QLQ-C30)", criticalCount: 2 }
                        ].map((form) => (
                           <button
                             key={form.id}
                             onClick={() => setActiveForm(form.id as any)}
                             className={cn(
                               "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all text-left",
                               activeForm === form.id 
                                 ? "bg-black text-white shadow-md" 
                                 : "text-gray-600 hover:bg-gray-100"
                             )}
                           >
                             <div className="flex items-center gap-2">
                               <FileText className="h-4 w-4 opacity-70" />
                               {form.label}
                             </div>
                             {form.criticalCount > 0 && (
                               <span className={cn(
                                 "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                 activeForm === form.id ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                               )}>
                                 {form.criticalCount}
                               </span>
                             )}
                           </button>
                        ))}
                     </nav>

                     {/* NON-CRF DATA SOURCES Section */}
                     <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                           <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Non-CRF Data Sources</h3>
                           <TooltipProvider>
                             <Tooltip>
                               <TooltipTrigger>
                                 <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
                               </TooltipTrigger>
                               <TooltipContent>External data sources integrated via IxRS or transfers</TooltipContent>
                             </Tooltip>
                           </TooltipProvider>
                        </div>
                        
                        <div className="space-y-3">
                           {[
                             { label: "Date of Randomization (IXRS)", type: "EXTERNAL", desc: "Data collected via IXRS/IWRS, not directly on an eCRF form provided.", tier: 1 },
                             { label: "PD-L1 Stratification Factor (IXRS)", type: "EXTERNAL", desc: "Data collected via IXRS/IWRS, not directly on an eCRF form provided.", tier: 1 },
                             { label: "Histology Stratification Factor (IXRS)", type: "EXTERNAL", desc: "Data collected via IXRS/IWRS, not directly on an eCRF form provided.", tier: 1 },
                             { label: "Smoking Stratification Factor (IXRS)", type: "EXTERNAL", desc: "Data collected via IXRS/IWRS, not directly on an eCRF form provided.", tier: 1 },
                             { label: "Date of Disease Progression (RECIST)", type: "EXTERNAL", desc: "RECIST assessment data (RS domain) is typically derived or collected on a dedicated form not provided in the aCRF.", tier: 2 }
                           ].map((source, i) => (
                             <div key={i} className="group relative pl-3 border-l-2 border-purple-200 hover:border-purple-400 transition-colors py-1">
                                <div className="flex items-center gap-2 mb-1">
                                   <Database className="h-3 w-3 text-purple-600" />
                                   <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">{source.type}</span>
                                   <div className={cn(
                                     "h-1.5 w-1.5 rounded-full ml-auto", 
                                     source.tier === 1 ? "bg-red-500" : "bg-amber-500"
                                   )} />
                                </div>
                                <div className="text-xs font-medium text-slate-900 group-hover:text-purple-700 transition-colors">
                                  {source.label}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                  {source.desc}
                                </p>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Center: Interactive Form Mockup */}
                  <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                     <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                        <div className="flex items-center gap-2">
                           <Layout className="h-4 w-4 text-gray-500" />
                           <span className="text-xs font-mono text-gray-500">FORM-{activeForm}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                           <MousePointer2 className="h-3 w-3" />
                           Hover over highlighted fields to view criticality
                        </div>
                     </div>
                     
                     <div className="p-8 bg-white min-h-[500px]">
                        {activeForm === "DS" && <MockDispositionForm mappings={mappedItems} onShowLineage={handleShowLineage} />}
                        {activeForm === "LB" && <MockLabForm mappings={mappedItems} onShowLineage={handleShowLineage} />}
                        {activeForm === "TU" && <MockTumorForm mappings={mappedItems} onShowLineage={handleShowLineage} />}
                        {activeForm === "QS" && <MockQSForm mappings={mappedItems} onShowLineage={handleShowLineage} />}
                     </div>
                  </div>

                  {/* Right: Insights Panel */}
                  <div className="w-72 shrink-0">
                     <AppleCard className="p-5 h-full bg-blue-50/30 border-blue-100 sticky top-0">
                        <div className="flex items-center gap-2 mb-4">
                           <Eye className="h-4 w-4 text-blue-600" />
                           <h3 className="text-sm font-semibold text-blue-900">Criticality Insights</h3>
                        </div>
                        
                        <div className="space-y-6">
                           <div>
                              <div className="text-3xl font-bold text-slate-900 mb-1">
                                {activeForm === "DS" ? "33%" : activeForm === "LB" ? "100%" : "50%"}
                              </div>
                              <p className="text-xs text-slate-500">of fields on this form are critical</p>
                           </div>

                           <div className="space-y-3">
                              <h4 className="text-xs font-semibold text-slate-900">Why are these critical?</h4>
                              {activeForm === "DS" && (
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  The <span className="font-semibold text-slate-900">Death Date</span> is the primary event anchor for Overall Survival (OS). Even a 1-day error can affect the Hazard Ratio in the Cox model.
                                </p>
                              )}
                              {activeForm === "LB" && (
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  <span className="font-semibold text-slate-900">Neutrophils</span> and <span className="font-semibold text-slate-900">Albumin</span> are inputs to the LREM Risk Score. Missing values here exclude patients from the Co-Primary analysis set.
                                </p>
                              )}
                              {activeForm === "TU" && (
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  <span className="font-semibold text-slate-900">Scan Date</span> determines the Progression-Free Survival (PFS) event time. It's a key secondary endpoint derived directly from this date.
                                </p>
                              )}
                              {activeForm === "QS" && (
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  <span className="font-semibold text-slate-900">Q29 & Q30</span> (Overall Health & QoL) are the direct source for the PRO Global Health Status endpoint. Missing data here cannot be imputed easily.
                                </p>
                              )}
                           </div>
                           
                           {/* Validation Status for SME */}
                           {currentUser === "sme" && (
                              <div className="pt-6 mt-6 border-t border-blue-100">
                                 <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                                    Validate Form Mapping
                                 </Button>
                              </div>
                           )}
                        </div>
                     </AppleCard>
                  </div>
               </motion.div>
            )}

            {/* --- LIST VIEW (Original) --- */}
            {viewMode === "list" && step !== "complete" && currentUser !== "sme" && (
               <motion.div key="list-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                  {/* ... (Existing List View Content) ... */}
                  
                  <div className="grid grid-cols-12 gap-6 pb-8">
                      {/* Left Col: Mapped Items */}
                      <div className="col-span-8 space-y-4">
                          <div className="flex items-center justify-between mb-2">
                             <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mapped Critical Data Points</h3>
                             <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                                {mappedItems.length} Items
                             </span>
                          </div>
                          {mappedItems.map((item: any, i: number) => (
                              <AppleCard key={i} className="p-5 hover:shadow-md transition-all group border-slate-200 shadow-sm">
                                  <div className="flex justify-between items-start">
                                      <div className="flex gap-4 w-full">
                                          <div className={cn(
                                              "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0",
                                              item.criticality_tier === 1 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                          )}>
                                              T{item.criticality_tier}
                                          </div>
                                          <div className="flex-1">
                                              <div className="flex justify-between items-start">
                                                  <div>
                                                      <h4 className="font-semibold text-sm text-[#1d1d1f]">{item.criticality_description}</h4>
                                                      <div className="flex flex-wrap gap-2 mt-2">
                                                          {item.estimands_impacted.map((est: string) => (
                                                              <span key={est} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">
                                                                  Impacts {est}
                                                              </span>
                                                          ))}
                                                      </div>
                                                  </div>
                                                  <div className="flex items-center justify-end gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mb-2">
                                                      <ShieldCheck className="h-3 w-3" /> Auto-Mapped
                                                  </div>
                                              </div>
                                              
                                              {/* Enhanced Details Section */}
                                              <div className="mt-4 space-y-3 pt-3 border-t border-dashed border-gray-200">
                                                  <div className="grid grid-cols-2 gap-4">
                                                      <div className="text-xs text-gray-600">
                                                          <div className="font-semibold text-gray-900 mb-1">Risk if Erroneous</div>
                                                          <div className="leading-relaxed opacity-90">{item.risk_if_erroneous}</div>
                                                      </div>
                                                      <div className="text-xs text-gray-600">
                                                          <div className="font-semibold text-gray-900 mb-1">Collection Guidance</div>
                                                          <div className="leading-relaxed bg-gray-50 px-2 py-1.5 rounded border border-gray-200 text-gray-700">
                                                              {item.data_collection_guidance}
                                                          </div>
                                                      </div>
                                                  </div>

                                                  {item.lineage_path && (
                                                    <div>
                                                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Lineage Trace</div>
                                                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-600 font-medium">
                                                            {item.lineage_path.map((node: string, idx: number) => (
                                                                <div key={idx} className="flex items-center">
                                                                    {idx > 0 && <ArrowRight className="h-3 w-3 text-gray-300 mx-1" />}
                                                                    <span className={cn(
                                                                        "px-1.5 py-0.5 rounded border shadow-sm", 
                                                                        node.includes("(E") ? "bg-slate-900 text-white border-slate-900" :
                                                                        node.includes("(M") ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                                        node.includes("(POP") ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                                        "bg-white text-gray-700 border-gray-200"
                                                                    )}>
                                                                        {node.replace(/^[→\s]+/, "")}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                  )}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  <div className="mt-4 pt-4 border-t border-black/5 flex items-center gap-4 bg-gray-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                                      <div className="text-[10px] text-gray-500 font-medium flex items-center gap-2">
                                          Source Hint: <span className="font-mono text-gray-800 bg-white px-1.5 py-0.5 rounded border border-gray-200">{item.source_hint_id}</span>
                                      </div>
                                      <ArrowRight className="h-3 w-3 text-gray-300" />
                                      <div className="flex-1 flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <Database className="h-3.5 w-3.5 text-gray-400" />
                                              <span className="text-xs font-medium text-gray-900">{item.mapped_crf_fields[0].formName}</span>
                                              <span className="text-[10px] text-gray-400">/</span>
                                              <span className="text-xs font-mono text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">{item.mapped_crf_fields[0].domain}.{item.mapped_crf_fields[0].variableName}</span>
                                          </div>
                                          <div className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">{item.mapped_crf_fields[0].mapping_confidence} Confidence</div>
                                      </div>
                                  </div>
                              </AppleCard>
                          ))}
                      </div>

                      {/* Right Col: Unmapped / Issues */}
                      <div className="col-span-4 space-y-4">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Review Required</h3>
                          {unmappedItems.map((item: any, i: number) => (
                              <AppleCard key={i} className="p-5 border-amber-200 bg-amber-50/30">
                                  <div className="flex items-start gap-3">
                                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                      <div>
                                          <h4 className="font-semibold text-sm text-[#1d1d1f] mb-1">{item.criticality_description}</h4>
                                          <div className="flex items-center gap-2 mb-2">
                                               <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">Tier {item.criticality_tier}</span>
                                               <span className="text-[10px] font-mono text-gray-500">{item.source_hint_id}</span>
                                          </div>
                                          <p className="text-xs text-amber-800/80 leading-relaxed mb-3">
                                              {item.reason}
                                          </p>
                                          <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-white border-amber-200 text-amber-800 hover:bg-amber-100 hover:text-amber-900">
                                              Manual Map
                                          </Button>
                                      </div>
                                  </div>
                              </AppleCard>
                          ))}

                          <AppleCard className="p-5 bg-blue-50/50 border-blue-100 mt-6">
                              <h4 className="font-semibold text-sm text-blue-900 mb-2">Mapping Coverage</h4>
                              <div className="flex items-end gap-2 mb-1">
                                  <span className="text-3xl font-bold text-blue-900">{CRF_CRITICALITY_REPORT.mapping_summary.coverage_percentage.toFixed(0)}%</span>
                                  <span className="text-xs text-blue-700 mb-1.5">of critical data points mapped</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${CRF_CRITICALITY_REPORT.mapping_summary.coverage_percentage}%` }} />
                              </div>
                          </AppleCard>
                      </div>
                  </div>
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
                        <Button className="flex-1 h-12 text-base bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white rounded-xl shadow-lg shadow-black/10" onClick={handleRouteToSME}>
                           <UserCheck className="mr-2 h-5 w-5" /> Route to SME
                        </Button>
                        <Button variant="outline" className="flex-1 h-12 text-base border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
                           <Download className="mr-2 h-5 w-5" /> Export Specs
                        </Button>
                     </div>
                  </div>
               </motion.div>
            )}

                </AnimatePresence>
             </div>
           </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={validationStatus === "assigned"} onOpenChange={(open) => !open && setValidationStatus("pending")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
               <CheckCircle2 className="h-5 w-5 text-green-600" />
               Validation Request Sent
            </DialogTitle>
            <DialogDescription>
              John Smith (SME) has been notified to review the Criticality Model.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setValidationStatus("pending")} className="bg-[#1d1d1f] text-white">
               Back to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lineage Trace Dialog */}
      <Dialog open={!!selectedLineageItem} onOpenChange={(open) => !open && setSelectedLineageItem(null)}>
        <DialogContent className="max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-white">
            <DialogTitle className="flex items-center gap-2 text-lg">
               <GitBranch className="h-5 w-5 text-blue-600" />
               Data Lineage Trace
            </DialogTitle>
            <DialogDescription>
              Tracing critical data from Source (CRF) to Analysis (Estimand).
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/50">
          {selectedLineageItem && (
            <div>
               <div className="mb-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                     <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0",
                        selectedLineageItem.criticality_tier === 1 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                     )}>
                        T{selectedLineageItem.criticality_tier}
                     </div>
                     <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected Field</div>
                        <div className="font-semibold text-slate-900">{selectedLineageItem.criticality_description}</div>
                     </div>
                  </div>
                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                     <span className="font-semibold text-slate-700">Impact:</span> {selectedLineageItem.risk_if_erroneous}
                  </div>
               </div>

               <div className="relative pl-4 ml-3 border-l-2 border-slate-200 space-y-0">
                  {selectedLineageItem.lineage_path && selectedLineageItem.lineage_path[0].split(/[→\u2192]/).map((step: string, i: number) => {
                      const cleanStep = step.trim();
                      const isEstimand = cleanStep.includes("(E") || cleanStep.startsWith("E");
                      const isSource = cleanStep.includes("FORM") || i === 0;
                      const isMethod = cleanStep.includes("(M") || cleanStep.includes("Model") || cleanStep.includes("Cox");
                      
                      return (
                      <div key={i} className="relative pb-10 last:pb-0 group">
                         <div className={cn(
                            "absolute top-4 left-[-23px] h-3.5 w-3.5 rounded-full border-2 shadow-sm transition-all z-10",
                            isEstimand ? "bg-black border-black ring-4 ring-black/5" :
                            isSource ? "bg-emerald-500 border-white ring-4 ring-emerald-50" :
                            "bg-white border-slate-300 group-hover:border-blue-400 group-hover:bg-blue-50"
                         )} />
                         
                         <div className={cn(
                            "p-4 rounded-xl border shadow-sm transition-all",
                            isEstimand ? "bg-slate-900 text-white border-slate-900 shadow-md" : 
                            isSource ? "bg-white border-emerald-200 shadow-sm" :
                            isMethod ? "bg-blue-50/50 border-blue-100 text-blue-900" :
                            "bg-white border-slate-200 text-slate-700"
                         )}>
                            <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                               {isEstimand ? "Target Estimand" : isSource ? "Source Data (CRF)" : isMethod ? "Statistical Method" : "Derived Variable"}
                            </div>
                            <div className="font-medium text-sm flex items-center gap-2">
                               {cleanStep}
                               {isEstimand && <ShieldCheck className="h-3 w-3 text-emerald-400" />}
                            </div>
                         </div>
                         
                         {i < selectedLineageItem.lineage_path[0].split(/[→\u2192]/).length - 1 && (
                            <div className="absolute left-[20px] -bottom-3 text-slate-300">
                               <ArrowRight className="h-4 w-4 rotate-90" />
                            </div>
                         )}
                      </div>
                  )})}
               </div>
            </div>
          )}
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
             <Button variant="outline" onClick={() => setSelectedLineageItem(null)}>
                Close Trace
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}