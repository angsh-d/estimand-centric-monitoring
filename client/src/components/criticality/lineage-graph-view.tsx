import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LINEAGE_GRAPH } from "@/data/mock-sap-data";

export const LineageGraphView = ({ graph }: { graph: typeof LINEAGE_GRAPH }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Simple layout logic: Assign columns based on node type
  const getColumn = (node: any) => {
    if (node.type === "ESTIMAND") return 4;
    if (node.type === "METHOD") return 3;
    if (node.type === "POPULATION") return 2;
    if (node.type === "VARIABLE") {
      if (node.attributes.variable_role === "BASELINE" || node.attributes.variable_role === "COMPONENT") return 1;
      return 2; // Derived/Intermediate
    }
    if (node.type === "ICE" || node.type === "DEVIATION") return 0; // Events/Deviations
    return 0;
  };

  const columns = [[], [], [], [], []]; // 0: Events, 1: Source Vars, 2: Derived/Pop, 3: Methods, 4: Estimands
  
  graph.nodes.forEach(node => {
    const colIndex = getColumn(node);
    // @ts-ignore
    columns[colIndex].push(node);
  });

  // Coordinate system for SVG (1000 x 600)
  // Matches the container's relative layout
  const SVG_WIDTH = 1000;
  const SVG_HEIGHT = 600;

  // Helper to calculate coordinates in the 1000x600 space
  const getCoordinates = (nodeId: string) => {
    // Find column and index
    for (let c = 0; c < columns.length; c++) {
      // @ts-ignore
      const index = columns[c].findIndex(n => n.id === nodeId);
      if (index !== -1) {
        // Map 5 columns to 1000 width
        // Col centers: 10%, 30%, 50%, 70%, 90%
        const x = (0.1 + (c * 0.2)) * SVG_WIDTH;
        
        // Map rows to height (fixed pixels in CSS, so we match them here)
        // HeaderOffset (40px) + Padded Top (16px in col) -> Start at ~100px?
        // Actually, CSS says: pt-16 (64px) + gap-6 (24px)
        // First card center: 64 + 40 (half height) = 104
        // Gap is 24, Card is 80. Stride = 104.
        // Let's approximate to match the visual center
        const y = 100 + (index * 90) + 40;
        
        return { x, y };
      }
    }
    return null;
  };

  // Helper to check if a node is connected to the selected node
  const isConnected = (targetId: string) => {
    if (!selectedNodeId) return false;
    if (targetId === selectedNodeId) return true;
    
    // Check direct edges (both directions for full trace)
    // In a real app, we would do a recursive traversal (BFS/DFS) to find the full path
    // For this mockup, we'll just check immediate neighbors to show the concept
    return graph.edges.some(e => 
      (e.from === selectedNodeId && e.to === targetId) || 
      (e.to === selectedNodeId && e.from === targetId)
    );
  };

  const getEdgeStatus = (from: string, to: string) => {
    if (!selectedNodeId) return "default";
    if (from === selectedNodeId || to === selectedNodeId) return "active";
    // Check if edge is part of the path of selected node (simplified)
    return "dimmed";
  };
  
  const selectedNode = selectedNodeId ? graph.nodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
           <h4 className="text-sm font-semibold text-blue-900">How is this derived?</h4>
           <p className="text-xs text-blue-800/80 leading-relaxed mt-1">
             This graph visualizes the <span className="font-medium">Traceability Chain</span> extracted from the SAP. 
             It shows how raw data (Source Variables) flows into analysis definitions (Methods & Populations) to calculate the final Estimands.
             <br/><span className="opacity-80 mt-1 block">Click on any box to see its specific derivation logic and connections.</span>
           </p>
        </div>
      </div>

      <div className="h-[600px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative flex">
         {/* Background Grid */}
         <div className="absolute inset-0 grid grid-cols-5 divide-x divide-slate-200/50 pointer-events-none">
            <div className="bg-slate-50/50" />
            <div className="bg-white/50" />
            <div className="bg-slate-50/50" />
            <div className="bg-white/50" />
            <div className="bg-slate-50/50" />
         </div>
         
         {/* SVG Edges Layer */}
         <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            preserveAspectRatio="none"
         >
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto" fill="#94a3b8">
                <polygon points="0 0, 6 2, 0 4" />
              </marker>
              <marker id="arrowhead-active" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto" fill="#3b82f6">
                <polygon points="0 0, 6 2, 0 4" />
              </marker>
            </defs>
            {graph.edges.map((edge, i) => {
               const start = getCoordinates(edge.to); // Reverse direction for flow: Source -> Target
               const end = getCoordinates(edge.from); // But graph edges are "targeted_by", "derived_from" (Backwards)
               
               if (!start || !end) return null;

               const x1 = start.x;
               const y1 = start.y;
               const x2 = end.x;
               const y2 = end.y;
               
               const isActive = getEdgeStatus(edge.from, edge.to) === "active";
               const isDimmed = getEdgeStatus(edge.from, edge.to) === "dimmed";

               return (
                 <path 
                   key={i}
                   d={`M ${x1} ${y1} C ${x1 + 100} ${y1}, ${x2 - 100} ${y2}, ${x2} ${y2}`}
                   fill="none"
                   stroke={isActive ? "#3b82f6" : "#cbd5e1"}
                   strokeWidth={isActive ? "2" : "1.5"}
                   markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                   className={cn("transition-all duration-300", isDimmed && "opacity-20", !isDimmed && "opacity-60", isActive && "opacity-100")}
                 />
               );
            })}
         </svg>
         
         {/* Columns */}
         {columns.map((col, colIndex) => (
           <div key={colIndex} className="flex-1 flex flex-col justify-start gap-4 p-4 relative z-10 pt-16">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-4 absolute top-4 left-0 right-0 h-8 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm z-20 border-b border-slate-100">
                 {colIndex === 0 ? "Events / Deviations" :
                  colIndex === 1 ? "Source Vars" :
                  colIndex === 2 ? "Derived / Populations" :
                  colIndex === 3 ? "Analysis Methods" :
                  "Estimands"}
              </div>
              <div className="flex flex-col gap-6"> 
                 {col.map((node: any) => {
                   const active = selectedNodeId === node.id;
                   const dim = selectedNodeId && !active && !isConnected(node.id);
                   
                   return (
                     <div 
                        key={node.id} 
                        onClick={() => setSelectedNodeId(active ? null : node.id)}
                        className={cn(
                          "p-3 rounded-xl border shadow-sm text-xs transition-all cursor-pointer relative group z-10 h-[80px] flex flex-col justify-center",
                          active ? "ring-2 ring-blue-500 scale-105 shadow-md" : "hover:border-blue-300 hover:shadow-md",
                          dim ? "opacity-30 blur-[1px] grayscale" : "opacity-100",
                          node.type === "ESTIMAND" ? "bg-slate-900 text-white border-slate-900" :
                          node.type === "METHOD" ? "bg-white border-blue-200 text-slate-900" :
                          node.type === "POPULATION" ? "bg-emerald-50 border-emerald-100 text-emerald-800" :
                          "bg-white border-slate-200 text-slate-600"
                       )}>
                        <div className="font-bold mb-0.5 flex items-center justify-between">
                          {node.id}
                          {active && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
                        </div>
                        <div className="leading-tight opacity-90 line-clamp-2">{node.label}</div>
                     </div>
                   );
                 })}
              </div>
           </div>
         ))}
         
         {/* Detail Panel Overlay (Bottom) */}
         <AnimatePresence>
            {selectedNode && (
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-4 z-50 flex items-start gap-4"
              >
                 <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                     selectedNode.type === "ESTIMAND" ? "bg-slate-900 text-white" :
                     selectedNode.type === "METHOD" ? "bg-blue-100 text-blue-700" :
                     selectedNode.type === "POPULATION" ? "bg-emerald-100 text-emerald-700" :
                     "bg-slate-100 text-slate-700"
                 )}>
                    {selectedNode.id}
                 </div>
                 <div className="flex-1">
                    <h5 className="font-semibold text-sm mb-1">{selectedNode.label}</h5>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p><span className="font-medium text-slate-900">Type:</span> {selectedNode.type}</p>
                      {Object.entries(selectedNode.attributes).map(([k, v]) => (
                        <p key={k}><span className="font-medium text-slate-900 capitalize">{k.replace('_', ' ')}:</span> {String(v)}</p>
                      ))}
                    </div>
                 </div>
                 <div className="w-px bg-slate-200 self-stretch mx-2" />
                 <div className="flex-1">
                    <h5 className="font-semibold text-sm mb-1">Logic Trace</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedNode.type === "VARIABLE" && "This is a base component derived directly from raw source data. It feeds into downstream calculations."}
                      {selectedNode.type === "POPULATION" && "This Analysis Set is defined by specific inclusion/exclusion criteria based on subject attributes."}
                      {selectedNode.type === "METHOD" && "This statistical method is applied to the population data to generate the estimand result."}
                      {selectedNode.type === "ESTIMAND" && "This is a final clinical objective derived from the specific population and analysis method shown."}
                    </p>
                 </div>
                 <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full -mt-1 -mr-1" onClick={(e) => { e.stopPropagation(); setSelectedNodeId(null); }}>
                    <X className="h-4 w-4" />
                 </Button>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};
