import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton-loader";
import { useState } from "react";
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const pendingVisits = [
  {
    id: "VST-2026-004",
    site: "109 - Charité Berlin",
    date: "Feb 12, 2026",
    type: "Monitoring Visit",
    status: "Drafting",
    signals_addressed: 5,
    completion: 65
  },
  {
    id: "VST-2026-003",
    site: "402 - Mass General",
    date: "Feb 10, 2026",
    type: "Site Initiation",
    status: "Pending",
    signals_addressed: 0,
    completion: 0
  }
];

const generatedDraftSections = [
  {
    title: "Executive Summary",
    content: "The site continues to perform well with enrollment targets (12/15 active). However, a critical finding regarding Concomitant Medication reconciliation (Subject 109-004) was identified and discussed with the PI. The site has agreed to implement a new source document verification workflow by next week.",
    status: "AI Generated"
  },
  {
    title: "Protocol Deviations",
    content: "One major deviation noted: Missed tumor assessment window for Subject 109-002. Root cause identified as scheduling conflict; site retraining completed.",
    status: "AI Generated"
  },
  {
    title: "Safety Review",
    content: "All SAEs reported to date have been reconciled. No new safety signals requiring expedited reporting were observed during this visit.",
    status: "AI Generated"
  }
];

export default function MVRCopilot() {
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState<string | null>("VST-2026-004");

  // Simulate loading
  setTimeout(() => setLoading(false), 1500);

  return (
    <AppShell>
      <div className="space-y-8 pb-10 h-[calc(100vh-140px)] flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col gap-1 shrink-0">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
            MVR CoPilot
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Assisted
            </span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Automated Monitoring Visit Report generation based on identified signals, site discussions, and recorded dispositions.
          </p>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          
          {/* Left Panel: Visit List */}
          <div className="w-1/3 bg-card border border-border/60 rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b border-border/60 bg-secondary/20">
              <h2 className="font-medium text-sm text-foreground">Pending Reports</h2>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
              {pendingVisits.map((visit) => (
                <div 
                  key={visit.id}
                  onClick={() => setSelectedVisit(visit.id)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    selectedVisit === visit.id 
                      ? "bg-primary/5 border-primary/20 shadow-sm" 
                      : "bg-background border-border/40 hover:border-border hover:bg-secondary/30"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-foreground text-sm">{visit.site}</span>
                    {visit.status === 'Drafting' ? (
                       <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                         <Bot className="h-3 w-3" /> Drafting
                       </span>
                    ) : (
                       <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                         Pending
                       </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3" />
                    {visit.date} • {visit.type}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Completion</span>
                      <span>{visit.completion}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                       <div className="h-full bg-primary transition-all duration-500" style={{ width: `${visit.completion}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Editor / Preview */}
          <div className="flex-1 bg-white border border-border/60 rounded-xl shadow-sm flex flex-col overflow-hidden relative">
            {loading ? (
              <div className="p-8 space-y-6">
                <Skeleton height={40} width="50%" />
                <Skeleton height={20} width="100%" />
                <Skeleton height={20} width="90%" />
                <div className="space-y-4 pt-8">
                  <Skeleton height={100} width="100%" />
                  <Skeleton height={100} width="100%" />
                </div>
              </div>
            ) : (
              <>
                 <div className="p-4 border-b border-border/60 flex justify-between items-center bg-gray-50/50">
                    <div>
                      <h2 className="font-semibold text-foreground">Draft Report: {selectedVisit}</h2>
                      <p className="text-xs text-muted-foreground">Last auto-saved: 2 minutes ago</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-white border border-border/60 rounded-md shadow-sm transition-colors">
                         View Source Data
                       </button>
                       <button className="px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-colors flex items-center gap-2">
                         <CheckCircle2 className="h-3 w-3" />
                         Approve Draft
                       </button>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {generatedDraftSections.map((section, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="group relative"
                      >
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="font-medium text-foreground text-sm">{section.title}</h3>
                           <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity">
                             {section.status}
                           </span>
                        </div>
                        <div className="p-4 rounded-lg border border-transparent hover:border-border/60 hover:bg-secondary/10 transition-all text-sm leading-relaxed text-muted-foreground hover:text-foreground cursor-text relative">
                           {section.content}
                           <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded cursor-pointer text-muted-foreground">
                              <Sparkles className="h-3 w-3" />
                           </div>
                        </div>
                      </motion.div>
                    ))}

                    <div className="p-4 border-t border-dashed border-border flex items-center justify-center gap-2 text-sm text-muted-foreground cursor-pointer hover:bg-secondary/10 rounded-lg transition-colors">
                       <Bot className="h-4 w-4" />
                       <span>Generate Next Section: "Investigational Product Accountability"</span>
                    </div>
                 </div>
              </>
            )}
          </div>

        </div>
      </div>
    </AppShell>
  );
}
