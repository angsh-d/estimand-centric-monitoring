import { useState, useEffect } from "react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Plus,
  Check,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppleCard, AppleBadge, SkeletonLine, ProvenanceTooltip } from "@/components/criticality/shared";

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

export default function ProtocolAnalysis() {
  const [step, setStep] = useState("upload-protocol");
  const [soaData, setSoaData] = useState(SOA_INIT);
  const [acrfData, setAcrfData] = useState(ACRF_INIT);
  const [processingStage, setProcessingStage] = useState(0);

  useEffect(() => {
    if (step === "processing-soa") {
      setProcessingStage(-1);
      const interval = setInterval(() => {
        setProcessingStage(prev => (prev < 3 ? prev + 1 : prev));
      }, 1200);
      
      const timeout = setTimeout(() => {
        setStep("review-soa");
      }, 6000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [step]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStep("processing-soa");
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col font-sans antialiased text-[#1d1d1f]">
      {/* Header */}
      <div className="px-8 pt-6 pb-2 shrink-0 flex items-center justify-between">
         <h1 className="text-2xl font-semibold">Protocol Analysis</h1>
      </div>

      <div className="flex-1 px-8 pb-8 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto scroll-smooth py-4">
          <AnimatePresence mode="wait">
            {/* --- STEP 0: Upload Protocol --- */}
            {step === "upload-protocol" && (
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
                  <h1 className="text-5xl font-semibold text-[#1d1d1f] tracking-tight mb-4">Protocol Analysis</h1>
                  <p className="text-[#86868b] text-xl max-w-xl mx-auto font-light leading-relaxed">
                    Transform your protocol into a structured data model.
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
                     <div className="h-16 w-16 bg-[#F5F5F7] text-black/40 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 group-hover:text-black transition-all duration-500">
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
            {step === "processing-soa" && (
               <motion.div key="proc-soa" className="h-full flex items-center justify-center">
                 <div className="flex flex-col items-center max-w-sm w-full">
                    <div className="relative mb-12">
                       <div className="h-16 w-16 rounded-full border-[3px] border-black/5 border-t-black animate-spin" />
                    </div>
                    <h2 className="text-xl font-medium text-[#1d1d1f] mb-8">Digitizing Protocol</h2>
                    <div className="w-full space-y-5">
                       {["Parsing document structure", "Identifying Schedule of Activities", "Extracting visit matrix", "Validating windows"].map((label, i) => (
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
               </motion.div>
            )}

            {/* --- STEP 2: Review SOA --- */}
            {step === "review-soa" && (
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
                                           row.conf === "low" ? "bg-amber-100 text-amber-600" : "bg-black/[0.04] text-black"
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
            {step === "processing-acrf" && (
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
            {step === "review-acrf" && (
              <motion.div key="rev-acrf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-[1000px] mx-auto">
                 <div className="flex justify-between items-center mb-8">
                    <div>
                       <h2 className="text-2xl font-semibold text-[#1d1d1f]">Review Annotated CRF</h2>
                       <p className="text-[#86868b] text-sm mt-1">CDASH v2.2 Standards Applied</p>
                    </div>
                    {/* Placeholder for completion or navigation */}
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
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
