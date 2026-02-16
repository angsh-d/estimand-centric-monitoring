import { useState } from "react";
import { 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppleCard, SkeletonLine } from "@/components/criticality/shared";
import { LINEAGE_GRAPH } from "@/data/mock-sap-data";

// Helper to extract estimands from lineage graph (duplicated here for now or should be shared)
const getEstimandsFromGraph = (graph: typeof LINEAGE_GRAPH) => {
  return graph.nodes
    .filter(n => n.type === "ESTIMAND" && ["PRIMARY", "SECONDARY", "KEY_SECONDARY"].includes(n.attributes.objective_type || ""))
    .map(n => {
      // Find method targeting this estimand
      const methodEdge = graph.edges.find(e => e.from === n.id && e.relationship === "targeted_by");
      const methodNode = methodEdge ? graph.nodes.find(mn => mn.id === methodEdge.to) : null;
      
      const popEdge = methodNode ? graph.edges.find(e => e.from === methodNode.id && e.relationship === "analyzed_on") : null;
      const popNode = popEdge ? graph.nodes.find(pn => pn.id === popEdge.to) : null;

      const iceEdges = graph.edges.filter(e => e.from === n.id && e.relationship === "handles");
      const iceNodes = iceEdges.map(e => graph.nodes.find(in_ => in_.id === e.to)).filter(Boolean);

      let objectiveLabel = "Secondary Endpoint";
      if (n.attributes.objective_type === "PRIMARY") objectiveLabel = "Primary Endpoint";
      if (n.attributes.objective_type === "KEY_SECONDARY") objectiveLabel = "Key Secondary Endpoint";

      return {
        id: n.id,
        label: n.label,
        var: objectiveLabel, 
        pop: popNode ? popNode.label : (n.attributes.population || "ITT"),
        trt: "Durvalumab vs SoC", 
        algo: methodNode ? `${methodNode.label} (${methodNode.attributes.test_statistic || 'Statistical Model'})` : "Standard Analysis",
        ic: iceNodes.map(ice => ({ ev: ice?.label, st: ice?.attributes.strategy, source: "Lineage" })),
        sum: "Derived from Lineage Graph",
        conf: 0.98,
        reasoning: "Extracted directly from SAP Lineage Graph JSON.",
        source: "lineage_graph.json"
      };
    });
};

const ESTS_FROM_GRAPH = getEstimandsFromGraph(LINEAGE_GRAPH);

export default function SapAnalysis() {
  const [step, setStep] = useState("upload-sap");
  const [estimands, setEstimands] = useState(ESTS_FROM_GRAPH);

  const handleSapFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStep("processing-sap");
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col font-sans antialiased text-[#1d1d1f]">
      {/* Header */}
      <div className="px-8 pt-6 pb-2 shrink-0 flex items-center justify-between">
         <h1 className="text-2xl font-semibold">SAP Analysis</h1>
      </div>

      <div className="flex-1 px-8 pb-8 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto scroll-smooth py-4">
          <AnimatePresence mode="wait">
            
            {/* --- STEP 5: Upload SAP --- */}
            {step === "upload-sap" && (
              <motion.div 
                key="upload-sap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <div className="mb-8 flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide">
                  <CheckCircle2 className="h-3 w-3" /> Protocol Analysis Complete
                </div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-3">Analysis Plan</h2>
                <div 
                  className="bg-white border border-black/10 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all w-[480px] h-[280px]"
                  onClick={() => document.getElementById('sap-upload')?.click()}
                >
                   <input 
                    type="file" 
                    id="sap-upload" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleSapFileSelect}
                  />
                   <div className="h-14 w-14 bg-[#F5F5F7] text-black/40 rounded-2xl flex items-center justify-center mb-6">
                     <Database className="h-6 w-6" />
                   </div>
                   <h3 className="font-semibold text-lg text-[#1d1d1f]">Select SAP Document</h3>
                   <p className="text-[#86868b] text-sm mt-2">ADaM Specifications</p>
                </div>
              </motion.div>
            )}

            {/* --- STEP 6: Process SAP --- */}
            {step === "processing-sap" && (
               <motion.div key="proc-sap" className="h-full flex items-center justify-center">
                 <div className="flex flex-col items-center w-64">
                    <div className="h-12 w-12 rounded-full border-[3px] border-black/5 border-t-black animate-spin mb-6" />
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
            {step === "review-estimand" && (
               <motion.div key="rev-est" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-[1000px] mx-auto">
                  <div className="flex justify-between items-center mb-8">
                     <div>
                        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Review Estimands</h2>
                        <p className="text-[#86868b] text-sm mt-1">Extracted from SAP. Defines primary objectives.</p>
                     </div>
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
                              <div className="col-span-2 bg-[#F5F5F7] p-4 rounded-xl">
                                 <div className="text-[10px] font-semibold text-black/40 uppercase mb-1">Estimator Algorithm</div>
                                 <div className="font-medium text-[#1d1d1f] text-sm font-mono leading-relaxed">{est.algo}</div>
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

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
