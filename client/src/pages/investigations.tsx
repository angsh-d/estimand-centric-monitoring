import { AppShell } from "@/components/layout/app-shell";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send, Paperclip, Bot, User, FileText, ChevronLeft } from "lucide-react";

const threads = [
  {
    id: 1,
    title: "Subject 109-004 Concomitant Meds",
    preview: "The dates in EDC don't match the narrative...",
    time: "2m ago",
    active: true,
  },
  {
    id: 2,
    title: "Site 402 Temp Excursion",
    preview: "Analyzing the impact on the PK samples...",
    time: "1h ago",
    active: false,
  },
  {
    id: 3,
    title: "Missing AE Reporting",
    preview: "Review complete. Recommendation attached.",
    time: "1d ago",
    active: false,
  },
];

const messages = [
  {
    id: 1,
    role: "user",
    content: "Show me the discrepancy for Subject 109-004 regarding the steroid administration.",
    time: "10:23 AM"
  },
  {
    id: 2,
    role: "assistant",
    content: "I've found a mismatch between the EDC Concomitant Medication log and the Safety Narrative from the SAE report.",
    attachments: [
      { type: "record", title: "EDC Record #4928", desc: "Start Date: 12-Jan-2026" },
      { type: "doc", title: "Safety Narrative PDF", desc: "Page 4: '...patient started steroids on Jan 14...'" }
    ],
    time: "10:23 AM"
  },
  {
    id: 3,
    role: "user",
    content: "Does this impact the primary endpoint analysis?",
    time: "10:24 AM"
  },
  {
    id: 4,
    role: "assistant",
    content: "Yes. This subject is in the Per-Protocol population. If the start date is confirmed as Jan 12, it falls within the DLT observation window, potentially classifying this as a DLT. If Jan 14, it is outside the window.",
    time: "10:24 AM"
  }
];

export default function Investigations() {
  const [input, setInput] = useState("");

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-140px)] rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
        
        {/* Sidebar List */}
        <div className="w-80 border-r border-border/60 bg-secondary/10 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-border/60">
            <h2 className="font-semibold text-foreground">Active Investigations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map((thread) => (
              <div 
                key={thread.id} 
                className={cn(
                  "p-4 border-b border-border/40 cursor-pointer hover:bg-secondary/30 transition-colors",
                  thread.active ? "bg-secondary/40 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"
                )}
              >
                <div className="flex justify-between mb-1">
                  <h3 className={cn("font-medium text-sm truncate pr-2", thread.active ? "text-foreground" : "text-muted-foreground")}>
                    {thread.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{thread.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{thread.preview}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="h-14 border-b border-border/60 flex items-center px-6 justify-between">
            <div className="flex items-center gap-2">
               <span className="md:hidden mr-2">
                 <ChevronLeft className="h-5 w-5 text-muted-foreground" />
               </span>
               <div>
                 <h2 className="font-semibold text-sm">Investigating: SIG-2025-092</h2>
                 <p className="text-xs text-muted-foreground">Cross-System Discrepancy • Site 109</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-xs font-medium text-muted-foreground">AI Agent Active</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-4 max-w-3xl", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}>
                 <div className={cn(
                   "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                   msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                 )}>
                   {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                 </div>
                 
                 <div className={cn("space-y-1", msg.role === "user" ? "items-end flex flex-col" : "")}>
                   <div className={cn(
                     "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                     msg.role === "user" 
                       ? "bg-blue-600 text-white rounded-tr-sm" 
                       : "bg-secondary/30 border border-border/60 text-foreground rounded-tl-sm"
                   )}>
                     {msg.content}
                   </div>
                   
                   {/* Attachments */}
                   {msg.attachments && (
                     <div className="grid grid-cols-1 gap-2 mt-2 w-full max-w-md">
                       {msg.attachments.map((att, i) => (
                         <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-card hover:bg-secondary/20 transition-colors cursor-pointer">
                            <div className="h-8 w-8 rounded bg-secondary/50 flex items-center justify-center text-muted-foreground">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium text-foreground truncate">{att.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{att.desc}</p>
                            </div>
                         </div>
                       ))}
                     </div>
                   )}
                   
                   <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
                 </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/60 bg-background/50 backdrop-blur-sm">
            <div className="relative max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about this signal or request document retrieval..."
                className="w-full h-12 rounded-full border border-border/60 bg-card pl-12 pr-12 text-sm shadow-sm focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
              <button className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <Paperclip className="h-4 w-4" />
              </button>
              <button className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all",
                input ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
