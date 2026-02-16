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
  Database
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

export default function CriticalityAnalysis() {
  const [step, setStep] = useState("review-criticality");
  const [currentUser, setCurrentUser] = useState<"study-director" | "sme">("study-director");
  const [validationStatus, setValidationStatus] = useState("pending");
  const [smeAssigned, setSmeAssigned] = useState(false);
  
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

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col font-sans antialiased text-[#1d1d1f]">
      
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

      <div className="flex-1 px-8 pb-8 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="pt-6 pb-2 shrink-0 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Criticality Analysis</h1>
        </div>

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

            {/* --- STEP 9: Criticality Review (Updated with JSON Data) --- */}
            {step === "review-criticality" && currentUser !== "sme" && (
               <motion.div key="rev-crit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-[1200px] mx-auto">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Criticality Mapping</h2>
                        <p className="text-[#86868b] text-sm mt-1">Linking Lineage (SAP) to Data Collection (aCRF).</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <Button onClick={() => setStep("complete")} className="bg-[#34C759] hover:bg-[#34C759]/90 text-white gap-2 rounded-full h-9 px-5 text-xs font-medium shadow-md">
                           Finalize Model <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                     </div>
                  </div>

                  <div className="grid grid-cols-12 gap-6 pb-8">
                      {/* Left Col: Mapped Items */}
                      <div className="col-span-8 space-y-4">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mapped Critical Data Points</h3>
                          {mappedItems.map((item: any, i: number) => (
                              <AppleCard key={i} className="p-5 hover:shadow-md transition-all group">
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
                                                          <div className="leading-relaxed bg-blue-50/50 px-2 py-1.5 rounded border border-blue-100/50 text-blue-900/80">
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
                                              <Database className="h-3.5 w-3.5 text-blue-500" />
                                              <span className="text-xs font-medium text-gray-900">{item.mapped_crf_fields[0].formName}</span>
                                              <span className="text-[10px] text-gray-400">/</span>
                                              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{item.mapped_crf_fields[0].domain}.{item.mapped_crf_fields[0].variableName}</span>
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
