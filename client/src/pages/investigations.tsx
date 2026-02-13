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
  ArrowRight
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const activeThread = {
  id: "SIG-2026-042",
  title: "ConMed Date Mismatch (Subject 109-004)",
  status: "active",
  context: "EDC vs Safety Narrative Reconciliation"
};

const messages = [
  {
    id: 1,
    role: "user",
    content: "What is the discrepancy for Subject 109-004?",
    time: "10:23 AM"
  },
  {
    id: 2,
    role: "assistant",
    content: "I've detected a conflict between two data sources regarding the start date of 'Dexamethasone'.",
    type: "analysis",
    sources: [
      { sys: "Rave EDC", val: "12-Jan-2026", field: "CM.CMSTDTC" },
      { sys: "Argus Safety", val: "14-Jan-2026", field: "Narrative Text" }
    ],
    time: "10:23 AM"
  },
  {
    id: 3,
    role: "user",
    content: "Does this fall within the DLT window?",
    time: "10:24 AM"
  },
  {
    id: 4,
    role: "assistant",
    content: "Yes. The Cycle 1 DLT observation period is Day 1 to Day 21 (Jan 01 - Jan 21).",
    type: "text",
    time: "10:24 AM"
  },
  {
    id: 5,
    role: "assistant",
    content: "Since the medication is a steroid, taking it on Jan 12 (Day 12) vs Jan 14 (Day 14) might impact the attribution of any subsequent AEs, but both dates are within the window.",
    type: "text",
    time: "10:24 AM"
  }
];

const evidenceData = [
  {
    type: "EDC Record",
    id: "Rec-9921",
    data: {
      "Subject": "109-004",
      "Medication": "Dexamethasone",
      "Dose": "4 mg",
      "Route": "Oral",
      "Start Date": "2026-01-12",
      "Indication": "Prophylaxis"
    }
  },
  {
    type: "Safety Narrative Snippet",
    id: "Argus-Case-882",
    text: "...subject experienced Grade 2 Nausea on 10-Jan. Started Dexamethasone 4mg PO BID on 14-Jan for symptom management..."
  }
];

export default function Investigations() {
  const [input, setInput] = useState("");

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-140px)] flex-col">
        {/* Header */}
        <div className="h-16 border-b border-border/60 bg-white flex items-center justify-between px-6 shrink-0 z-10">
           <div className="flex items-center gap-4">
             <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center border border-orange-200">
               <Search className="h-5 w-5" />
             </div>
             <div>
               <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                 Investigation Workspace
                 <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">Active</span>
               </h1>
               <p className="text-xs text-muted-foreground flex items-center gap-2">
                 Ref: {activeThread.id} • {activeThread.title}
               </p>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-medium text-blue-700">JD</div>
                <div className="h-8 w-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs font-medium text-emerald-700">AI</div>
             </div>
             <div className="h-8 w-[1px] bg-border/60 mx-1" />
             <Button variant="outline" size="sm">Resolve Signal</Button>
           </div>
        </div>

        {/* 3-Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Related Signals/Context (Narrow) */}
          <div className="w-64 border-r border-border/60 bg-secondary/5 flex flex-col hidden xl:flex">
             <div className="p-4 border-b border-border/40 font-medium text-sm text-muted-foreground">
               Related Threads
             </div>
             <div className="p-2 space-y-1">
               <div className="p-3 bg-white border border-border/60 rounded-lg shadow-sm cursor-pointer">
                 <div className="text-xs font-semibold text-foreground mb-1">{activeThread.id}</div>
                 <div className="text-xs text-muted-foreground line-clamp-2">{activeThread.title}</div>
                 <div className="mt-2 flex items-center gap-1 text-[10px] text-orange-600">
                   <Clock className="h-3 w-3" /> Updated 5m ago
                 </div>
               </div>
               <div className="p-3 hover:bg-secondary/40 border border-transparent rounded-lg cursor-pointer transition-colors opacity-60 hover:opacity-100">
                 <div className="text-xs font-semibold text-foreground mb-1">SIG-2026-039</div>
                 <div className="text-xs text-muted-foreground line-clamp-2">Potential SAE Under-reporting (Subject 402-011)</div>
               </div>
             </div>
          </div>

          {/* Center: Chat Stream (Wide) */}
          <div className="flex-1 flex flex-col bg-white relative">
            <ScrollArea className="flex-1 p-6 md:p-8">
              <div className="max-w-3xl mx-auto space-y-8 pb-10">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground mb-4">
                    Investigation started today at 10:21 AM
                  </div>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-4", msg.role === "user" ? "flex-row-reverse" : "")}>
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border",
                      msg.role === "assistant" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-white text-gray-600 border-gray-200"
                    )}>
                      {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    <div className={cn("flex flex-col gap-1 max-w-[80%]", msg.role === "user" ? "items-end" : "items-start")}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">{msg.role === "assistant" ? "Agent" : "Dr. Sarah Chen"}</span>
                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                      </div>
                      
                      {msg.type === 'analysis' && msg.sources ? (
                         <div className="bg-white border border-border rounded-xl p-4 shadow-sm w-full space-y-3">
                           <p className="text-sm text-foreground mb-2">{msg.content}</p>
                           <div className="bg-secondary/20 rounded-lg overflow-hidden border border-border/40">
                             <table className="w-full text-xs text-left">
                               <thead className="bg-secondary/40 text-muted-foreground">
                                 <tr>
                                   <th className="px-3 py-2 font-medium">Source</th>
                                   <th className="px-3 py-2 font-medium">Field</th>
                                   <th className="px-3 py-2 font-medium">Value</th>
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-border/40">
                                 {msg.sources.map((s, i) => (
                                   <tr key={i}>
                                     <td className="px-3 py-2 font-medium">{s.sys}</td>
                                     <td className="px-3 py-2 text-muted-foreground font-mono">{s.field}</td>
                                     <td className={cn("px-3 py-2 font-medium", i===0 ? "text-red-600" : "text-blue-600")}>{s.val}</td>
                                   </tr>
                                 ))}
                               </tbody>
                             </table>
                           </div>
                         </div>
                      ) : (
                        <div className={cn(
                          "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                          msg.role === "user" 
                            ? "bg-blue-600 text-white rounded-tr-sm" 
                            : "bg-secondary/30 text-foreground border border-border/60 rounded-tl-sm"
                        )}>
                          {msg.content}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-border/60">
              <div className="max-w-3xl mx-auto relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <button className="p-1.5 text-muted-foreground hover:bg-secondary rounded-md transition-colors">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-muted-foreground hover:bg-secondary rounded-md transition-colors">
                    <Table className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask follow-up questions or request more data..."
                  className="w-full h-12 rounded-xl border border-border/60 pl-24 pr-12 text-sm shadow-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                />
                <button className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
                  input ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700" : "bg-secondary text-muted-foreground cursor-not-allowed"
                )}>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Evidence Panel (Sidekick) */}
          <div className="w-[380px] border-l border-border/60 bg-white flex flex-col shrink-0">
             <div className="p-4 border-b border-border/40 font-medium text-sm flex items-center justify-between">
               <span>Context Data</span>
               <span className="text-xs text-muted-foreground">2 records pinned</span>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {evidenceData.map((item, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                       <FileText className="h-3 w-3" /> {item.type}
                     </div>
                     <div className="bg-card border border-border/60 rounded-xl p-4 text-sm shadow-sm">
                        {item.data ? (
                          <div className="space-y-2">
                            {Object.entries(item.data).map(([k, v]) => (
                              <div key={k} className="flex justify-between border-b border-border/40 last:border-0 pb-1 last:pb-0">
                                <span className="text-muted-foreground">{k}</span>
                                <span className="font-medium text-foreground">{v}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="italic text-muted-foreground leading-relaxed">
                            "{item.text}"
                          </p>
                        )}
                        <div className="mt-3 pt-3 border-t border-border/40 flex justify-end">
                          <button className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                            View Source <LinkIcon className="h-3 w-3" />
                          </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
