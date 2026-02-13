import { AppShell } from "@/components/layout/app-shell";
import { useState } from "react";
import { 
  GitBranch, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Filter, 
  UploadCloud, 
  Loader2,
  Table as TableIcon,
  Network
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

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
          "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors border border-transparent",
          isSelected ? "bg-primary/10 border-primary/20" : "hover:bg-secondary/50",
          level === 0 && "font-medium text-foreground",
          level > 0 && "text-sm text-muted-foreground"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className={cn("p-0.5 rounded hover:bg-black/5 transition-colors", !hasChildren && "invisible")}
        >
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        
        {/* Node Icon/Badge */}
        <div className={cn(
          "h-2 w-2 rounded-full shrink-0",
          node.type === 'estimand' ? "bg-primary" :
          node.type === 'analysis' ? "bg-blue-500" :
          node.type === 'adam' ? "bg-indigo-400" :
          node.type === 'sdtm' ? "bg-violet-400" :
          "bg-slate-300"
        )} />
        
        <span className={cn("truncate", isSelected && "text-primary")}>{node.label}</span>
        
        {node.confidence === 'low' && (
          <AlertTriangle className="h-3 w-3 text-amber-500 ml-auto" />
        )}
      </div>
      
      {expanded && hasChildren && (
        <div className="border-l border-border/40 ml-[calc(1rem+3px)]">
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
  const [processing, setProcessing] = useState(false); // Simulate extraction state

  return (
    <AppShell>
      <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 pb-4">
        
        {/* Header with Mode Switcher */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <GitBranch className="h-6 w-6 text-muted-foreground" />
              Criticality Model Builder
            </h1>
            <p className="text-muted-foreground text-xs mt-1">
              Validating derivation chains for PEARL (NCT03003962) • Draft v0.4
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg border border-border/40">
            <button 
              onClick={() => setViewMode("tree")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                viewMode === "tree" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Network className="h-3 w-3" />
              Derivation Tree
            </button>
            <button 
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                viewMode === "table" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <TableIcon className="h-3 w-3" />
              Tier Table
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden flex flex-col relative">
          
          {processing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-sm font-medium">Extracting insights from Protocol & SAP...</p>
              <p className="text-xs text-muted-foreground mt-1">Mapping SDTM domains to CRF fields</p>
            </div>
          )}

          {viewMode === "tree" ? (
            <div className="flex h-full">
              {/* Left Panel: Tree */}
              <div className="w-1/3 border-r border-border/60 bg-secondary/5 flex flex-col">
                <div className="p-3 border-b border-border/60 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <input className="w-full bg-white h-8 rounded-md border border-border/60 pl-7 pr-2 text-xs" placeholder="Search estimands or variables..." />
                  </div>
                  <button className="p-2 bg-white border border-border/60 rounded-md text-muted-foreground hover:text-foreground">
                    <Filter className="h-3 w-3" />
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
                    <div className="p-6 border-b border-border/40">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                              selectedNode.type === 'estimand' ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary text-muted-foreground border-border"
                            )}>
                              {selectedNode.type}
                            </span>
                            {selectedNode.confidence === 'low' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> Inferred
                              </span>
                            )}
                          </div>
                          <h2 className="text-xl font-serif text-foreground">{selectedNode.label}</h2>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground rounded-md transition-colors">
                            Flag for Review
                          </button>
                          <button className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-md transition-colors flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3" />
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Node Details */}
                    <div className="p-6 space-y-8 overflow-y-auto flex-1">
                      
                      {/* Derivation Logic */}
                      <section>
                        <h3 className="text-sm font-medium text-foreground mb-3">Derivation Logic & Context</h3>
                        <div className="p-4 bg-secondary/10 rounded-lg border border-border/40 text-sm text-muted-foreground leading-relaxed">
                          {selectedNode.type === 'estimand' ? (
                            <p>Derived from Protocol Section 8.1. Primary efficacy analysis based on ITT population. Censoring rules applied for new anti-cancer therapy start date.</p>
                          ) : (
                            <p>Mapped automatically from SAP Table 14.2. Source variable traces to specific CRF field. Confidence level is high based on exact string match.</p>
                          )}
                        </div>
                      </section>

                      {/* Source Traceability */}
                      <section>
                        <h3 className="text-sm font-medium text-foreground mb-3">Source Traceability</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border border-border/60 rounded-lg bg-card">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center border border-blue-100">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-xs font-medium">Protocol V4.0</div>
                                <div className="text-[10px] text-muted-foreground">Page 42, Section 8.1</div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex items-center justify-between p-3 border border-border/60 rounded-lg bg-card">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center border border-indigo-100">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-xs font-medium">Statistical Analysis Plan v1.2</div>
                                <div className="text-[10px] text-muted-foreground">Page 18, Table 3</div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </section>

                      {/* Tier Classification Editor (only for leaf nodes) */}
                      {selectedNode.type === 'crf' && (
                        <section>
                          <h3 className="text-sm font-medium text-foreground mb-3">Criticality Tier</h3>
                          <div className="flex gap-4">
                            {['1', '2', '3'].map(tier => (
                              <button
                                key={tier}
                                className={cn(
                                  "flex-1 py-3 border rounded-lg text-sm font-medium transition-all",
                                  selectedNode.tier === tier 
                                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20" 
                                    : "border-border/60 hover:bg-secondary/20 text-muted-foreground"
                                )}
                              >
                                Tier {tier}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Tier 1: Critical for primary/key secondary analysis. Requires 100% SDV.
                          </p>
                        </section>
                      )}

                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    <GitBranch className="h-12 w-12 mb-4 opacity-20" />
                    <p>Select a node from the derivation tree to view details</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Table View
            <div className="flex flex-col h-full bg-white">
              <div className="p-4 border-b border-border/60 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <Filter className="h-4 w-4 text-muted-foreground" />
                   <span className="text-xs font-medium text-muted-foreground">Filtering by: All Fields</span>
                 </div>
                 <div className="flex gap-2">
                   <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-secondary">
                     Bulk Edit
                   </button>
                   <button className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                     Export CSV
                   </button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/30 text-xs text-muted-foreground uppercase tracking-wider sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 font-medium border-b border-border/60">Form</th>
                      <th className="px-6 py-3 font-medium border-b border-border/60">Field</th>
                      <th className="px-6 py-3 font-medium border-b border-border/60">SDTM Mapping</th>
                      <th className="px-6 py-3 font-medium border-b border-border/60">Tier</th>
                      <th className="px-6 py-3 font-medium border-b border-border/60">Estimand</th>
                      <th className="px-6 py-3 font-medium border-b border-border/60">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {crfFields.map((field, i) => (
                      <tr key={i} className="hover:bg-secondary/10 transition-colors">
                        <td className="px-6 py-3 text-foreground">{field.form}</td>
                        <td className="px-6 py-3 text-foreground font-medium">{field.field}</td>
                        <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{field.sdtm}</td>
                        <td className="px-6 py-3">
                          <span className={cn(
                            "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                            field.tier === '1' ? "bg-primary text-primary-foreground" : 
                            field.tier === '2' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                          )}>
                            {field.tier}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">{field.estimand}</td>
                        <td className="px-6 py-3">
                          {field.status === 'Flagged' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                              <AlertTriangle className="h-3 w-3" /> Flagged
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              <CheckCircle2 className="h-3 w-3" /> Confirmed
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
