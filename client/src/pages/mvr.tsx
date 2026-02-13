import { AppShell } from "@/components/layout/app-shell";
import { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Bot,
  MessageSquare,
  History,
  Save,
  Wand2,
  ChevronRight,
  Printer,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Mock Data
const visitContext = {
  site: "109 - Charité Berlin",
  visit: "Monitoring Visit 4",
  date: "Feb 14, 2026",
  investigator: "Dr. Klaus Webber",
  status: "Drafting"
};

const suggestedPrompts = [
  "Summarize the ConMed discrepancy for Subject 109-004",
  "List all open protocol deviations since last visit",
  "Draft the Safety Review section based on recent SAEs",
  "Generate follow-up items for the site coordinator"
];

const chatHistory = [
  {
    role: "user",
    content: "Summarize the ConMed discrepancy for Subject 109-004",
  },
  {
    role: "assistant",
    content: "I've drafted a summary based on Signal SIG-2026-042. It notes the date mismatch between EDC (Jan 12) and the Safety Narrative (Jan 14). I've recommended a source data verification action.",
    action: "insert_content",
    payload: "Review of Concomitant Medications revealed a discrepancy for Subject 109-004. Steroid start date recorded in EDC is 12-Jan-2026, while the SAE Safety Narrative indicates 14-Jan-2026. This has potential impact on DLT assessment. \n\nAction: Site to verify source documents and correct EDC or Narrative by 20-Feb-2026."
  }
];

export default function MVRCopilot() {
  const [editorContent, setEditorContent] = useState<string>(`
    <h2>1. Executive Summary</h2>
    <p>The site continues to demonstrate strong enrollment performance with 12 subjects active. Staff remains engaged and responsive to queries.</p>
    
    <h2>2. Protocol Compliance</h2>
    <p>Overall compliance is acceptable. One minor deviation noted regarding visit window adherence.</p>
    
    <h2>3. Safety Review</h2>
    <p>[Content to be generated]</p>
  `);
  
  const [activeChat, setActiveChat] = useState(true);

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-140px)] flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-white shrink-0">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              MVR CoPilot
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>{visitContext.site}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{visitContext.visit}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="flex items-center gap-1 text-emerald-600 font-medium text-xs bg-emerald-50 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" /> AI Active
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <History className="h-4 w-4" />
              History
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4" />
              Finalize Report
            </Button>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Document Editor (Left/Center) */}
          <div className="flex-1 bg-secondary/5 flex flex-col overflow-hidden relative">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-6 py-2 border-b border-border/40 bg-white/50 backdrop-blur text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Section:</span>
              <button className="hover:text-foreground hover:bg-secondary px-2 py-1 rounded transition-colors">Executive Summary</button>
              <button className="hover:text-foreground hover:bg-secondary px-2 py-1 rounded transition-colors">Protocol Compliance</button>
              <button className="text-foreground font-medium bg-secondary px-2 py-1 rounded transition-colors">Safety Review</button>
              <div className="ml-auto text-xs">Last saved: Just now</div>
            </div>

            {/* Editor Surface */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <div className="max-w-3xl mx-auto bg-white min-h-[800px] shadow-sm border border-border/40 p-12 rounded-lg relative">
                {/* Simulated Content */}
                <div className="prose prose-sm max-w-none text-foreground">
                  <h2 className="text-lg font-bold mb-4">1. Executive Summary</h2>
                  <p className="mb-6 leading-relaxed text-muted-foreground">The site continues to demonstrate strong enrollment performance with 12 subjects active. Staff remains engaged and responsive to queries.</p>
                  
                  <h2 className="text-lg font-bold mb-4">2. Protocol Compliance</h2>
                  <p className="mb-6 leading-relaxed text-muted-foreground">Overall compliance is acceptable. One minor deviation noted regarding visit window adherence.</p>
                  
                  <h2 className="text-lg font-bold mb-4 flex items-center justify-between group">
                    <span>3. Safety Review</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-normal flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">
                      <Wand2 className="h-3 w-3" /> Regenerate
                    </button>
                  </h2>
                  <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-md mb-6 relative group">
                    <p className="leading-relaxed text-foreground">
                      Review of Concomitant Medications revealed a discrepancy for Subject 109-004. Steroid start date recorded in EDC is 12-Jan-2026, while the SAE Safety Narrative indicates 14-Jan-2026. This has potential impact on DLT assessment.
                      <br/><br/>
                      <strong>Action:</strong> Site to verify source documents and correct EDC or Narrative by 20-Feb-2026.
                    </p>
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button className="p-1 hover:bg-blue-100 rounded text-blue-600" title="Accept">
                         <CheckCircle2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold mb-4 text-muted-foreground/50">4. Action Items</h2>
                  <div className="h-24 border-2 border-dashed border-border/60 rounded-lg flex items-center justify-center text-muted-foreground bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors gap-2">
                    <Sparkles className="h-4 w-4" />
                    Click to generate from findings
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Sidebar (Right) */}
          <div className="w-[400px] bg-white border-l border-border/60 flex flex-col shrink-0 shadow-xl z-10">
            <div className="p-4 border-b border-border/40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="h-5 w-5" />
                <h2 className="font-medium">Report Assistant</h2>
              </div>
              <p className="text-xs text-blue-100">
                I have access to Protocol, EDC, and Safety databases to help you write this report.
              </p>
            </div>

            {/* Chat Stream */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start")}>
                     <div className={cn(
                       "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                       msg.role === 'user' 
                        ? "bg-secondary text-foreground rounded-br-none" 
                        : "bg-blue-50 text-blue-900 border border-blue-100 rounded-bl-none"
                     )}>
                       {msg.content}
                     </div>
                     {msg.role === 'assistant' && msg.action === 'insert_content' && (
                       <div className="text-[10px] text-muted-foreground flex items-center gap-1 pl-2">
                         <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                         Content inserted into report
                       </div>
                     )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Suggestion Chips & Input */}
            <div className="p-4 bg-secondary/10 border-t border-border/60">
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button key={i} className="text-xs bg-white border border-border/60 hover:border-blue-300 hover:text-blue-600 px-3 py-1.5 rounded-full transition-colors shadow-sm text-muted-foreground text-left">
                    {prompt}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask to draft a section or analyze data..."
                  className="w-full h-11 rounded-xl border border-border/60 pl-4 pr-10 text-sm shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
