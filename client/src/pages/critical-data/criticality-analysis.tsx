import { useState } from "react";
import { 
  CheckCircle2, 
  UserCheck, 
  Lock, 
  Download,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  User
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
import { LineageGraphView } from "@/components/criticality/lineage-graph-view";
import { LINEAGE_GRAPH } from "@/data/mock-sap-data";

export default function CriticalityAnalysis() {
  const [step, setStep] = useState("review-criticality");
  const [currentUser, setCurrentUser] = useState<"study-director" | "sme">("study-director");
  const [validationStatus, setValidationStatus] = useState("pending");
  const [smeAssigned, setSmeAssigned] = useState(false);

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
                            <AppleCard className="p-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                                    Review Data Lineage & Criticality
                                </h3>
                                {/* Graph View for SME */}
                                <LineageGraphView graph={LINEAGE_GRAPH} />
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

            {/* --- STEP 9: Criticality Review (Replaced with Graph) --- */}
            {step === "review-criticality" && currentUser !== "sme" && (
               <motion.div key="rev-crit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-[1200px] mx-auto">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Criticality Review</h2>
                        <p className="text-[#86868b] text-sm mt-1">Traceability: Source Data → Analysis Variables → Estimands.</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <Button onClick={() => setStep("complete")} className="bg-[#34C759] hover:bg-[#34C759]/90 text-white gap-2 rounded-full h-9 px-5 text-xs font-medium shadow-md">
                           Finalize Model <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                     </div>
                  </div>

                  <LineageGraphView graph={LINEAGE_GRAPH} />
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
