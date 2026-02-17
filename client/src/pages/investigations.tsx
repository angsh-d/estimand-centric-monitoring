import { AppShell } from "@/components/layout/app-shell";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Send, 
  Paperclip, 
  Bot, 
  User, 
  FileText, 
  ChevronLeft,
  Search,
  CheckCircle2,
  Clock,
  MoreVertical,
  Link as LinkIcon,
  Table,
  ArrowRight,
  MoreHorizontal,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const activeThread = {
  id: "INV-2026-109",
  title: "Site 109 Data Integrity Investigation",
  status: "active",
  context: "Cross-domain anomaly detection (EDC, Safety, IXRS)"
};

const messages = [
  {
    id: 1,
    role: "assistant",
    content: "I've detected a pattern of data anomalies at Site 109 (Charité Berlin) suggesting a potential systemic quality issue.",
    type: "analysis", 
    sources: [],
    time: "10:21 AM"
  },
  {
    id: 2,
    role: "user",
    content: "Show me the specific signals contributing to this alert.",
    time: "10:22 AM"
  },
  {
    id: 3,
    role: "assistant",
    content: "There are two distinct but temporally correlated signals:",
    type: "analysis",
    sources: [
      { sys: "Signal 1", val: "Date Discrepancy (Subj 109-004)", field: "ConMed vs Safety Narrative" },
      { sys: "Signal 2", val: "Stratification Error (Subj 109-007)", field: "IXRS vs EDC Stratum" }
    ],
    time: "10:22 AM"
  },
  {
    id: 4,
    role: "assistant",
    content: "Connecting these domains: The ConMed date error (Safety vs Clinical) and the Stratification error (Randomization vs Clinical) both occurred within 48 hours of data entry. This suggests a breakdown in source document verification processes at the site level.",
    type: "text",
    time: "10:22 AM"
  },
  {
    id: 5,
    role: "user",
    content: "What is the impact on the Primary Estimand?",
    time: "10:23 AM"
  },
  {
    id: 6,
    role: "assistant",
    content: "High Impact. Subject 109-007 was randomized to 'Strata A' (PD-L1 High) in IXRS, but EDC lab data shows PD-L1 < 50%. This mis-stratification directly affects the Primary Analysis Set (ITT) and could bias the Hazard Ratio if not corrected before database lock.",
    type: "text",
    time: "10:23 AM"
  },
  {
    id: 7,
    role: "assistant",
    content: "Recommendation: Trigger a targeted remote monitoring visit for Site 109 to review all source documents for patients randomized in the last 30 days.",
    type: "text",
    time: "10:24 AM"
  }
];

const evidenceData = [
  {
    type: "EDC eCRF Record",
    id: "Rec-CM-9921",
    data: {
      "Form": "Concomitant Medications",
      "Medication": "Dexamethasone",
      "Start Date": "12-Jan-2026",
      "Indication": "Prophylaxis",
      "Status": "Signed by PI"
    }
  },
  {
    type: "Safety Narrative",
    id: "Argus-Case-882",
    text: "...subject experienced Grade 2 Nausea on 10-Jan. Started Dexamethasone 4mg PO BID on 14-Jan for symptom management..."
  },
  {
    type: "IXRS Log",
    id: "Trans-8821",
    data: {
      "Transaction": "Randomization",
      "Date": "05-Jan-2026 09:14",
      "Assigned Stratum": "PD-L1 High (>=50%)",
      "Kit ID": "KIT-10292"
    }
  },
  {
    type: "EDC Lab Form",
    id: "Rec-LB-4421",
    data: {
      "Form": "Local Lab Results",
      "Test Name": "PD-L1 Expression",
      "Result": "42%",
      "Collection Date": "04-Jan-2026"
    }
  }
];

export default function Investigations() {
  const [input, setInput] = useState("");

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="h-14 border-b border-slate-100 bg-white flex items-center justify-between px-6 shrink-0 z-10">
         <div className="flex items-center gap-4">
           <div className="h-8 w-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center border border-red-100">
             <ShieldCheck className="h-4 w-4" />
           </div>
           <div>
             <h1 className="text-[13px] font-semibold text-slate-900 flex items-center gap-2">
               INV-2026-109: Site 109 Integrity Investigation
               <span className="h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-red-100 animate-pulse" />
             </h1>
             <p className="text-[11px] text-slate-500 font-medium">
               Multi-domain anomaly detection (Safety + Randomization)
             </p>
           </div>
         </div>
         
         <div className="flex items-center gap-3">
           <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">JD</div>
              <div className="h-7 w-7 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">AI</div>
           </div>
           <div className="h-4 w-px bg-slate-200 mx-1" />
           <Button variant="outline" size="sm" className="h-8 text-[11px] font-medium border-slate-200">
             Resolve
           </Button>
         </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Related Threads (Sidebar) */}
        <div className="w-64 border-r border-slate-100 bg-slate-50/50 flex flex-col hidden xl:flex">
           <div className="p-4 font-semibold text-[11px] text-slate-400 uppercase tracking-wider">
             Linked Signals
           </div>
           <div className="px-2 space-y-1">
             <div className="p-3 bg-white border border-slate-200/60 rounded-xl shadow-sm cursor-pointer border-l-2 border-l-black">
               <div className="text-[11px] font-bold text-slate-900 mb-0.5">{activeThread.id}</div>
               <div className="text-[11px] text-slate-500 line-clamp-2 leading-snug">{activeThread.title}</div>
               <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                 <Clock className="h-3 w-3" /> Active Now
               </div>
             </div>
             <div className="p-3 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors opacity-70 hover:opacity-100">
               <div className="text-[11px] font-bold text-slate-900 mb-0.5">SIG-2026-045</div>
               <div className="text-[11px] text-slate-500 line-clamp-2 leading-snug">Incorrect Randomization Stratification (Subject 109-007)</div>
             </div>
           </div>
        </div>

        {/* Center: Chat Stream */}
        <div className="flex-1 flex flex-col bg-white relative">
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-2xl mx-auto space-y-6 pb-10">
              <div className="text-center py-4">
                <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                  Today, 10:21 AM
                </span>
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-auto shadow-sm border text-[10px] font-bold",
                    msg.role === "assistant" ? "bg-slate-900 text-white border-transparent" : "bg-slate-100 text-slate-600 border-slate-200"
                  )}>
                    {msg.role === "assistant" ? "AI" : "AM"}
                  </div>

                  <div className={cn("flex flex-col gap-1 max-w-[85%]", msg.role === "user" ? "items-end" : "items-start")}>
                    {msg.type === 'analysis' && msg.sources ? (
                       <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm w-full space-y-3">
                         <p className="text-[13px] text-slate-700 leading-relaxed">{msg.content}</p>
                         <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                           <table className="w-full text-[11px] text-left">
                             <thead className="bg-slate-100/50 text-slate-500 font-medium">
                               <tr>
                                 <th className="px-3 py-2">Source</th>
                                 <th className="px-3 py-2">Field</th>
                                 <th className="px-3 py-2">Value</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                               {msg.sources.map((s, i) => (
                                 <tr key={i}>
                                   <td className="px-3 py-2 font-medium text-slate-700">{s.sys}</td>
                                   <td className="px-3 py-2 text-slate-500 font-mono">{s.field}</td>
                                   <td className={cn("px-3 py-2 font-medium", i===0 ? "text-red-600" : "text-blue-600")}>{s.val}</td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                       </div>
                    ) : (
                      <div className={cn(
                        "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm",
                        msg.role === "user" 
                          ? "bg-slate-900 text-white rounded-br-none" 
                          : "bg-slate-100 text-slate-700 rounded-bl-none"
                      )}>
                        {msg.content}
                      </div>
                    )}
                    <span className="text-[10px] text-slate-300 px-1">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                  <Paperclip className="h-4 w-4" />
                </button>
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message..."
                className="w-full h-10 rounded-full border border-slate-200 bg-slate-50 pl-10 pr-10 text-[13px] shadow-sm focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100 outline-none transition-all placeholder:text-slate-400"
              />
              <button className={cn(
                "absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all",
                input ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-400"
              )}>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Evidence Panel (Sidekick) */}
        <div className="w-[320px] border-l border-slate-100 bg-slate-50/30 flex flex-col shrink-0">
           <div className="p-4 border-b border-slate-100 font-semibold text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between bg-white">
             <span>Evidence Packet</span>
             <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">4 Sources</span>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {evidenceData.map((item, i) => (
                <div key={i} className="group">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                     <FileText className="h-3 w-3" /> {item.type}
                   </div>
                   <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow cursor-default">
                      {item.data ? (
                        <div className="space-y-2">
                          {Object.entries(item.data).map(([k, v]) => (
                            <div key={k} className="flex justify-between border-b border-slate-50 last:border-0 pb-1.5 last:pb-0 text-[11px]">
                              <span className="text-slate-500">{k}</span>
                              <span className="font-medium text-slate-900">{v}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="italic text-slate-600 text-[12px] leading-relaxed font-serif bg-slate-50 p-3 rounded-lg border border-slate-100">
                          "{item.text}"
                        </p>
                      )}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                        <button className="text-[10px] font-medium text-blue-600 hover:underline flex items-center gap-1">
                          View Source <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
