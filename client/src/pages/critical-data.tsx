import { AppShell } from "@/components/layout/app-shell";
import { useState } from "react";
import { 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Filter, 
  Loader2,
  Table as TableIcon,
  Network,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Derivation Tree
const derivationTree = [
  {
    id: "EST-001",
    type: "estimand",
    label: "Primary Endpoint: PFS (ITT)",
    status: "validated",
    children: [
      {
        id: "ANL-001",
        type: "analysis",
        label: "Kaplan-Meier Estimation",
        status: "validated",
        children: [
          {
            id: "ADM-001",
            type: "adam",
            label: "ADaM.ADPFS (PFS Analysis Dataset)",
            status: "validated",
            children: [
              {
                id: "SDTM-001",
                type: "sdtm",
                label: "SDTM.RS (Response)",
                status: "validated",
                children: [
                  { id: "CRF-001", type: "crf", label: "RECIST 1.1 Assessment Date", tier: "1", confidence: "high", status: "validated" },
                  { id: "CRF-002", type: "crf", label: "Target Lesion Size", tier: "1", confidence: "high", status: "validated" }
                ]
              },
              {
                id: "SDTM-002",
                type: "sdtm",
                label: "SDTM.TU (Tumor Identification)",
                status: "needs_review",
                children: [
                  { id: "CRF-003", type: "crf", label: "Lesion Location", tier: "2", confidence: "low", status: "flagged" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "EST-002",
    type: "estimand",
    label: "Secondary Endpoint: OS (ITT)",
    status: "validated",
    children: []
  }
];

// Mock Data for Tabular View
const crfFields = [
  { form: "Tumor Assessment", field: "Assessment Date", sdtm: "RS.RSDTC", tier: "1", estimand: "PFS", confidence: "High", status: "Confirmed" },
  { form: "Tumor Assessment", field: "Lesion Size", sdtm: "TR.TRORRES", tier: "1", estimand: "PFS", confidence: "High", status: "Confirmed" },
  { form: "Tumor Identification", field: "Lesion Location", sdtm: "TU.TULOC", tier: "2", estimand: "PFS", confidence: "Low", status: "Flagged" },
  { form: "Death Report", field: "Date of Death", sdtm: "DS.DSSTDTC", tier: "1", estimand: "OS", confidence: "High", status: "Confirmed" },
];

function TreeNode({ node, level = 0, onSelect, selectedId }: { node: any, level?: number, onSelect: (node: any) => void, selectedId: string | null }) {
  const [expanded, setExpanded] = useState(true);
  
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-all border border-transparent",
          isSelected ? "bg-blue-50 border-blue-100" : "hover:bg-slate-50",
          level === 0 && "font-medium text-slate-900",
          level > 0 && "text-[13px] text-slate-600"
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className={cn("p-0.5 rounded hover:bg-slate-200 transition-colors text-slate-400", !hasChildren && "invisible")}
        >
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        
        {/* Node Icon/Badge */}
        <div className={cn(
          "h-2 w-2 rounded-full shrink-0 ring-2 ring-white",
          node.type === 'estimand' ? "bg-slate-900" :
          node.type === 'analysis' ? "bg-blue-500" :
          node.type === 'adam' ? "bg-indigo-400" :
          node.type === 'sdtm' ? "bg-violet-400" :
          "bg-slate-300"
        )} />
        
        <span className={cn("truncate", isSelected && "text-blue-700 font-medium")}>{node.label}</span>
        
        {node.confidence === 'low' && (
          <AlertTriangle className="h-3 w-3 text-amber-500 ml-auto" />
        )}
      </div>
      
      {expanded && hasChildren && (
        <div className="border-l border-slate-100 ml-[calc(1.25rem+4px)]">
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} level={level + 1} onSelect={onSelect} selectedId={selectedId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CriticalData() {
  const [viewMode, setViewMode] = useState<"tree" | "table">("tree");
  const [selectedNode, setSelectedNode] = useState<any>(derivationTree[0]);
  const [processing, setProcessing] = useState(false);

  return (
    <AppShell>
      <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 pb-4">
        
        {/* Header with Mode Switcher */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
              Criticality Model Builder
            </h1>
            <p className="text-slate-500 text-[13px] mt-1 font-medium">
              Mapping Protocol → Analysis → Data Source
            </p>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setViewMode("tree")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all",
                viewMode === "tree" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Network className="h-3 w-3" />
              Tree View
            </button>
            <button 
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all",
                viewMode === "table" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <TableIcon className="h-3 w-3" />
              Tier Table
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
          
          {processing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-900 mb-4" />
              <p className="text-sm font-medium text-slate-900">Analyzing Protocol...</p>
            </div>
          )}

          {viewMode === "tree" ? (
            <div className="flex h-full">
              {/* Left Panel: Tree */}
              <div className="w-1/3 border-r border-slate-200 bg-slate-50/50 flex flex-col">
                <div className="p-3 border-b border-slate-200 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input className="w-full bg-white h-9 rounded-lg border border-slate-200 pl-8 pr-2 text-[12px] focus:ring-2 focus:ring-slate-100 outline-none placeholder:text-slate-400" placeholder="Search..." />
                  </div>
                  <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {derivationTree.map(node => (
                    <TreeNode key={node.id} node={node} onSelect={setSelectedNode} selectedId={selectedNode?.id} />
                  ))}
                </div>
              </div>

              {/* Right Panel: Detail View */}
              <div className="flex-1 bg-white flex flex-col">
                {selectedNode ? (
                  <>
                    {/* Node Header */}
                    <div className="p-8 border-b border-slate-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                              selectedNode.type === 'estimand' ? "bg-slate-900 text-white border-slate-900" : "bg-slate-100 text-slate-500 border-slate-200"
                            )}>
                              {selectedNode.type}
                            </span>
                            {selectedNode.confidence === 'low' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> Inferred
                              </span>
                            )}
                          </div>
                          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{selectedNode.label}</h2>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 text-[11px] font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            Flag
                          </button>
                          <button className="px-3 py-1.5 text-[11px] font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                            <CheckCircle2 className="h-3 w-3" />
                            Verify
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Node Details */}
                    <div className="p-8 space-y-8 overflow-y-auto flex-1">
                      
                      {/* Derivation Logic */}
                      <section>
                        <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide mb-3">Logic & Context</h3>
                        <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-100 text-[13px] text-slate-600 leading-relaxed">
                          {selectedNode.type === 'estimand' ? (
                            <p>Derived from Protocol Section 8.1. Primary efficacy analysis based on ITT population. Censoring rules applied for new anti-cancer therapy start date.</p>
                          ) : (
                            <p>Mapped automatically from SAP Table 14.2. Source variable traces to specific CRF field. Confidence level is high based on exact string match.</p>
                          )}
                        </div>
                      </section>

                      {/* Source Traceability */}
                      <section>
                        <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide mb-3">Traceability</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors group cursor-pointer shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-slate-50 text-slate-500 rounded-lg flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="text-[13px] font-semibold text-slate-900">Protocol V4.0</div>
                                <div className="text-[11px] text-slate-500 font-medium">Page 42, Section 8.1</div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                          </div>
                        </div>
                      </section>

                      {/* Tier Classification Editor (only for leaf nodes) */}
                      {selectedNode.type === 'crf' && (
                        <section>
                          <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide mb-3">Criticality Tier</h3>
                          <div className="flex gap-4">
                            {['1', '2', '3'].map(tier => (
                              <button
                                key={tier}
                                className={cn(
                                  "flex-1 py-3 border rounded-xl text-[13px] font-medium transition-all",
                                  selectedNode.tier === tier 
                                    ? "border-slate-900 bg-slate-900 text-white shadow-md" 
                                    : "border-slate-200 hover:bg-slate-50 text-slate-500"
                                )}
                              >
                                Tier {tier}
                              </button>
                            ))}
                          </div>
                        </section>
                      )}

                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <GitBranch className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium">Select a node to view details</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Table View
            <div className="flex flex-col h-full bg-white">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <div className="flex items-center gap-2">
                   <Filter className="h-3.5 w-3.5 text-slate-400" />
                   <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Filtering: All Fields</span>
                 </div>
                 <div className="flex gap-2">
                   <button className="px-3 py-1.5 text-[11px] font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm">
                     Export CSV
                   </button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <table className="w-full text-[13px] text-left">
                  <thead className="bg-white text-slate-500 font-medium sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Form</th>
                      <th className="px-6 py-3 font-semibold">Field</th>
                      <th className="px-6 py-3 font-semibold">SDTM Mapping</th>
                      <th className="px-6 py-3 font-semibold text-center">Tier</th>
                      <th className="px-6 py-3 font-semibold">Estimand</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {crfFields.map((field, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-3 text-slate-900 font-medium">{field.form}</td>
                        <td className="px-6 py-3 text-slate-600">{field.field}</td>
                        <td className="px-6 py-3 font-mono text-[11px] text-slate-400">{field.sdtm}</td>
                        <td className="px-6 py-3 text-center">
                          <span className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold border",
                            field.tier === '1' ? "bg-slate-900 text-white border-slate-900" : 
                            field.tier === '2' ? "bg-white text-slate-600 border-slate-200" : "bg-slate-50 text-slate-400 border-slate-100"
                          )}>
                            {field.tier}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-500">{field.estimand}</td>
                        <td className="px-6 py-3">
                          {field.status === 'Flagged' ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase tracking-wide">
                              <AlertTriangle className="h-3 w-3" /> Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                              <CheckCircle2 className="h-3 w-3" /> Valid
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
