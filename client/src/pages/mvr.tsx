import { AppShell } from "@/components/layout/app-shell";
import { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Bot, 
  History,
  Save,
  Wand2,
  Share2,
  MoreHorizontal,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Data
const visitContext = {
  site: "109 - Charité Berlin",
  visit: "Monitoring Visit 4",
  date: "Feb 14, 2026",
  investigator: "Dr. Klaus Webber",
  status: "Drafting"
};

const suggestedPrompts = [
  "Summarize ConMed discrepancy",
  "List open protocol deviations",
  "Draft Safety Review section",
  "Generate follow-up items"
];

const chatHistory = [
  {
    role: "user",
    content: "Summarize the ConMed discrepancy for Subject 109-004",
  },
  {
    role: "assistant",
    content: "I've drafted a summary based on Signal SIG-2026-042. It notes the date mismatch between EDC (Jan 12) and the Safety Narrative (Jan 14).",
    action: "insert_content",
    payload: "Review of Concomitant Medications revealed a discrepancy for Subject 109-004..."
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
  
  return (
    <div className="flex h-[calc(100vh-140px)] flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-white shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            MVR CoPilot
            <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
              Draft Mode
            </span>
          </h1>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-medium">
            <span>{visitContext.site}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
            <span>{visitContext.visit}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900">
            <History className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-slate-200" />
          <Button variant="outline" size="sm" className="h-8 text-[11px] font-medium border-slate-200 text-slate-600 hover:bg-slate-50">
            Share
          </Button>
          <Button size="sm" className="h-8 text-[11px] font-medium bg-slate-900 text-white hover:bg-slate-800 shadow-sm gap-1.5">
            <Save className="h-3 w-3" />
            Finalize
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Document Editor (Left/Center) */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 bg-slate-50/50 text-[11px] font-medium text-slate-500">
            <span className="mr-2 text-slate-400">Sections:</span>
            <button className="hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors">Executive Summary</button>
            <button className="hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors">Protocol Compliance</button>
            <button className="text-slate-900 bg-white shadow-sm border border-slate-200/50 px-2 py-1 rounded transition-colors">Safety Review</button>
            <div className="ml-auto text-[10px] text-slate-400">Saved</div>
          </div>

          {/* Editor Surface */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white">
            <div className="max-w-2xl mx-auto">
              <div className="prose prose-sm prose-slate max-w-none">
                <h2 className="text-base font-semibold text-slate-900 mb-3">1. Executive Summary</h2>
                <p className="text-slate-600 text-[13px] leading-relaxed mb-8">The site continues to demonstrate strong enrollment performance with 12 subjects active. Staff remains engaged and responsive to queries.</p>
                
                <h2 className="text-base font-semibold text-slate-900 mb-3">2. Protocol Compliance</h2>
                <p className="text-slate-600 text-[13px] leading-relaxed mb-8">Overall compliance is acceptable. One minor deviation noted regarding visit window adherence.</p>
                
                <div className="flex items-center justify-between mb-3 group">
                  <h2 className="text-base font-semibold text-slate-900">3. Safety Review</h2>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-medium flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">
                    <Wand2 className="h-3 w-3" /> Regenerate
                  </button>
                </div>
                
                <div className="p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl mb-8 relative group hover:border-blue-200 transition-colors">
                  <p className="text-slate-700 text-[13px] leading-relaxed">
                    Review of Concomitant Medications revealed a discrepancy for Subject 109-004. Steroid start date recorded in EDC is 12-Jan-2026, while the SAE Safety Narrative indicates 14-Jan-2026. This has potential impact on DLT assessment.
                    <br/><br/>
                    <strong className="font-semibold text-slate-900">Action:</strong> Site to verify source documents and correct EDC or Narrative by 20-Feb-2026.
                  </p>
                  <div className="absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-6 w-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform" title="Accept">
                       <CheckCircle2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <h2 className="text-base font-semibold text-slate-400 mb-3">4. Action Items</h2>
                <div className="h-20 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50/50 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all gap-2 text-[11px] font-medium">
                  <Sparkles className="h-3 w-3 text-slate-400" />
                  Click to generate from findings
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar (Right) */}
        <div className="w-[340px] bg-slate-50 border-l border-slate-200 flex flex-col shrink-0 z-10">
          <div className="p-4 border-b border-slate-200/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <span className="text-[13px] font-semibold text-slate-900">Assistant</span>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Stream */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {chatHistory.map((msg, i) => (
                <div key={i} className={cn("flex flex-col gap-1.5", msg.role === 'user' ? "items-end" : "items-start")}>
                   <div className={cn(
                     "max-w-[90%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed shadow-sm border",
                     msg.role === 'user' 
                      ? "bg-slate-900 text-white border-transparent" 
                      : "bg-white text-slate-700 border-slate-200"
                   )}>
                     {msg.content}
                   </div>
                   {msg.role === 'assistant' && msg.action === 'insert_content' && (
                     <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 pl-1">
                       <CheckCircle2 className="h-3 w-3" />
                       Inserted to report
                     </div>
                   )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {suggestedPrompts.map((prompt, i) => (
                <button key={i} className="text-[10px] font-medium bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 px-2 py-1 rounded-md transition-colors">
                  {prompt}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask Assistant..."
                className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 text-[12px] focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none transition-all placeholder:text-slate-400"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 transition-colors">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
