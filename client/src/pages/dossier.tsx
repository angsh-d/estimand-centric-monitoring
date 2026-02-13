import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton-loader";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Download, Share2, Printer, AlertTriangle, CheckCircle, Calendar } from "lucide-react";

export default function Dossier() {
  const [loading, setLoading] = useState(true);
  
  // Simulate loading
  setTimeout(() => setLoading(false), 2000);

  return (
    <AppShell>
      <div className="flex justify-center pb-20">
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/95 backdrop-blur py-4 z-10 border-b border-border/40">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Site Dossier: 109 - Charité Berlin</h1>
              <p className="text-muted-foreground text-xs mt-1">Generated: Feb 14, 2026 • For Visit: Monitor Visit 4</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-white hover:bg-secondary/50 text-sm font-medium transition-colors shadow-sm">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors shadow-sm">
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div className="bg-white border border-border/60 shadow-sm rounded-xl overflow-hidden min-h-[800px] relative">
            {loading ? (
              <div className="p-12 space-y-8">
                <Skeleton height={40} width="60%" />
                <div className="space-y-2">
                  <Skeleton height={16} width="100%" />
                  <Skeleton height={16} width="90%" />
                  <Skeleton height={16} width="95%" />
                </div>
                <div className="grid grid-cols-2 gap-8 pt-8">
                   <div className="space-y-4">
                     <Skeleton height={24} width="40%" />
                     <Skeleton height={120} className="rounded-lg" />
                   </div>
                   <div className="space-y-4">
                     <Skeleton height={24} width="40%" />
                     <Skeleton height={120} className="rounded-lg" />
                   </div>
                </div>
              </div>
            ) : (
              <div className="p-8 md:p-12">
                {/* Document Header */}
                <div className="border-b border-border/40 pb-8 mb-8">
                   <div className="flex justify-between items-start">
                     <div>
                       <h2 className="font-serif text-3xl text-gray-900 mb-2">Pre-Visit Monitoring Intelligence</h2>
                       <p className="text-gray-500 text-sm font-sans">Protocol: NCT03003962 | Site: 109 (Charité Berlin)</p>
                     </div>
                     <div className="text-right">
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full border border-red-100 text-xs font-medium uppercase tracking-wide">
                         <AlertTriangle className="h-3 w-3" />
                         High Priority
                       </div>
                     </div>
                   </div>
                </div>

                {/* Executive Summary */}
                <section className="mb-10">
                  <h3 className="font-serif text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
                    Executive Summary
                  </h3>
                  <div className="bg-secondary/20 p-6 rounded-lg border border-border/40 text-gray-700 text-sm leading-relaxed font-sans">
                    <p>
                      Site 109 shows emerging risk patterns in <span className="font-semibold text-gray-900">Concomitant Medication reporting</span> and <span className="font-semibold text-gray-900">RECIST 1.1 assessment windows</span>. 
                      Cross-system validation between EDC and Safety narratives indicates 3 high-confidence discrepancies. 
                      Enrollment is on track (12/15 subjects), but data entry latency has increased by 15% since last visit.
                    </p>
                  </div>
                </section>

                {/* Critical Findings Grid */}
                <section className="mb-10">
                  <h3 className="font-serif text-xl font-medium text-gray-900 mb-6">Open Signals & Recommended Actions</h3>
                  
                  <div className="space-y-6">
                    {[
                      {
                        title: "Concomitant Medication Discrepancy",
                        desc: "Subject 109-004: Steroid start date in EDC (12-Jan) conflicts with Narrative (14-Jan). Critical for immune-response evaluation.",
                        impact: "Analysis Impact: Potential confounding variable for primary endpoint.",
                        action: "Review source logs for Jan 12-14. Request query if source confirms 14-Jan.",
                        severity: "High"
                      },
                      {
                        title: "Missed Tumor Assessment Window",
                        desc: "Subject 109-002: Visit 6 scan scheduled 3 days outside protocol window (+/- 7 days).",
                        impact: "Regulatory Impact: Minor protocol deviation.",
                        action: "Document deviation note. Re-train coordinator on window calculator tool.",
                        severity: "Medium"
                      }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-lg border border-border/40 hover:bg-secondary/10 transition-colors">
                        <div className={cn("w-1 h-full rounded-full flex-shrink-0 self-stretch", 
                          item.severity === "High" ? "bg-red-500" : "bg-orange-400"
                        )} />
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900 text-sm font-sans">{item.title}</h4>
                            <span className="text-xs text-muted-foreground font-mono uppercase">{item.severity}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                          <div className="pt-2 flex gap-4 text-xs">
                             <div className="flex-1 bg-gray-50 p-2 rounded border border-gray-100">
                               <span className="block font-semibold text-gray-700 mb-0.5">Impact</span>
                               <span className="text-gray-500">{item.impact}</span>
                             </div>
                             <div className="flex-1 bg-blue-50/50 p-2 rounded border border-blue-100/50">
                               <span className="block font-semibold text-blue-800 mb-0.5">Recommended Action</span>
                               <span className="text-blue-700">{item.action}</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Operational Metrics */}
                <section>
                  <h3 className="font-serif text-xl font-medium text-gray-900 mb-6">Site Performance Metrics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Data Entry Lag", value: "4.2 Days", status: "Warning", color: "text-orange-600" },
                      { label: "Query Response", value: "24 Hours", status: "Good", color: "text-emerald-600" },
                      { label: "SDV Completion", value: "92%", status: "Good", color: "text-emerald-600" },
                    ].map((metric, i) => (
                      <div key={i} className="p-4 rounded-lg bg-gray-50/50 border border-border/40 text-center">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{metric.label}</div>
                        <div className="text-2xl font-semibold text-gray-900 mb-1">{metric.value}</div>
                        <div className={cn("text-xs font-medium", metric.color)}>{metric.status}</div>
                      </div>
                    ))}
                  </div>
                </section>
                
                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground font-sans">
                  <p>Confidential • Generated by Clinical Intelligence Platform • Do Not Distribute</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
