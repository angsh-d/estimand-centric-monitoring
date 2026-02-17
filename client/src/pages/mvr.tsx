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
  ArrowUpRight,
  MessageSquare,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  FileSearch,
  RefreshCcw,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock Data - Connected to the Storyline
const visitContext = {
  site: "109 - Charité Berlin",
  visit: "Monitoring Visit 4",
  date: "Feb 19, 2026",
  investigator: "Dr. Klaus Webber",
  status: "Drafting",
  progress: 65
};

const suggestedPrompts = [
  "Summarize 109-007 Stratification Issue",
  "List Safety/ConMed discrepancies",
  "Draft PD-L1 Protocol Deviation",
  "Generate Action Items for Dr. Webber"
];

const reportSections = [
  { id: "exec", title: "1. Executive Summary", status: "complete" },
  { id: "staff", title: "2. Site Personnel & Facilities", status: "complete" },
  { id: "protocol", title: "3. Protocol Compliance", status: "attention" },
  { id: "safety", title: "4. Safety Review (AE/SAE)", status: "drafting" },
  { id: "sdv", title: "5. Source Data Verification", status: "pending" },
  { id: "ip", title: "6. Investigational Product", status: "pending" }
];

const chatHistory = [
  {
    role: "user",
    content: "Summarize the Stratification Error for Subject 109-007. Include the root cause from the investigation.",
    time: "10:42 AM"
  },
  {
    role: "assistant",
    content: "I've drafted a protocol deviation summary based on Investigation INV-2026-109. It explicitly cites the mismatch between IXRS (High PD-L1) and Lab Data (<50%).",
    action: "suggestion",
    source: "INV-2026-109",
    payload: {
      section: "3. Protocol Compliance",
      text: "Major Protocol Deviation identified for Subject 109-007. Subject was randomized to 'High PD-L1' stratum via IXRS on 05-Jan-2026, but source lab reports dated 04-Jan-2026 confirm PD-L1 expression of 42% (Low). This represents a violation of Inclusion Criterion #4. \n\nRoot Cause: Site Coordinator manually entered unverified values into IXRS before source availability. \n\nImpact: Subject included in incorrect Analysis Set (ITT).",
      status: "pending_review"
    },
    time: "10:42 AM"
  }
];

export default function MVRCopilot() {
  const [activeSection, setActiveSection] = useState("protocol");
  const [showAiPanel, setShowAiPanel] = useState(true);

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm shrink-0 z-20">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-3">
            MVR CoPilot
            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-medium px-2 py-0.5 text-[10px] uppercase tracking-wider">
              Draft Mode
            </Badge>
          </h1>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 font-medium">
            <span className="flex items-center gap-1.5">
              <Building2Icon className="h-3 w-3" /> {visitContext.site}
            </span>
            <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-3 w-3" /> {visitContext.visit} ({visitContext.date})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report Progress</span>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 w-[65%]" />
            </div>
            <span className="text-[11px] font-bold text-slate-900">65%</span>
          </div>
          
          <div className="h-6 w-px bg-slate-200 mx-1" />
          
          <Button variant="outline" size="sm" className="h-8 text-[11px] font-medium border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <Share2 className="h-3.5 w-3.5 mr-2" /> Share Draft
          </Button>
          <Button size="sm" className="h-8 text-[11px] font-medium bg-slate-900 text-white hover:bg-slate-800 shadow-sm gap-2">
            <Save className="h-3.5 w-3.5" />
            Save & Finalize
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Rail (Left) */}
        <div className="w-64 bg-slate-50 border-r border-slate-100 flex flex-col overflow-y-auto py-4 hidden lg:flex shrink-0">
          <div className="px-4 mb-4">
             <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Report Sections</h3>
             <div className="space-y-1">
               {reportSections.map((section) => (
                 <button 
                   key={section.id}
                   onClick={() => setActiveSection(section.id)}
                   className={cn(
                     "w-full text-left px-3 py-2.5 rounded-lg text-[12px] font-medium flex items-center justify-between transition-all",
                     activeSection === section.id 
                       ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                       : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                   )}
                 >
                   <span className="truncate">{section.title}</span>
                   {section.status === "complete" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                   {section.status === "attention" && <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
                   {section.status === "drafting" && <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 animate-pulse" />}
                 </button>
               ))}
             </div>
          </div>
          
          <div className="mt-auto px-4 pt-4 border-t border-slate-200/50">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-3.5 w-3.5 text-slate-900" />
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">Visit Focus</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Targeted review of <span className="font-semibold text-slate-700">Primary Estimand Data</span> for subjects randomized in Jan 2026.
              </p>
            </div>
          </div>
        </div>

        {/* Document Editor (Center) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/30 relative">
          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            <div className="max-w-3xl mx-auto bg-white min-h-[800px] shadow-sm border border-slate-200 rounded-xl p-10 md:p-14 relative">
              
              {/* Report Header in Document */}
              <div className="border-b-2 border-slate-900 pb-6 mb-10 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Monitoring Visit Report</h2>
                  <p className="text-slate-500 text-sm font-medium">Protocol: NCT03003962 • Site 109</p>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Report ID</div>
                  <div className="text-sm font-mono font-medium text-slate-900">MVR-109-04</div>
                </div>
              </div>

              {/* 1. Executive Summary (Completed) */}
              <div className="mb-10 group cursor-text">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">1. Executive Summary</h3>
                </div>
                <p className="text-slate-700 text-[13px] leading-relaxed text-justify">
                  The site continues to demonstrate strong enrollment performance with 12 subjects active. Staff remains engaged and responsive to queries. However, a <span className="bg-rose-50 text-rose-700 px-1 py-0.5 rounded font-medium">Critical Finding</span> regarding Stratification processes was identified during this visit, requiring immediate corrective action. The Principal Investigator was present for the close-out meeting and acknowledged the findings.
                </p>
              </div>

              {/* 2. Personnel (Completed) */}
              <div className="mb-10 group cursor-text opacity-60 hover:opacity-100 transition-opacity">
                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">2. Site Personnel & Facilities</h3>
                 <p className="text-slate-700 text-[13px] leading-relaxed">
                   No changes to Key Site Personnel since last visit. Delegation logs reviewed and confirmed up to date. Pharmacy temperature logs showed no excursions.
                 </p>
              </div>

              {/* 3. Protocol Compliance (Active / Drafting) */}
              <div className="mb-10 relative ring-offset-4 rounded-lg -m-2 p-2 ring-2 ring-blue-500/10 bg-blue-50/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide flex items-center gap-2">
                    3. Protocol Compliance <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  </h3>
                  <div className="flex gap-2">
                     <Button size="sm" variant="ghost" className="h-6 text-[10px] text-blue-600 hover:bg-blue-50 gap-1">
                        <RefreshCcw className="h-3 w-3" /> Regenerate
                     </Button>
                  </div>
                </div>

                {/* AI Suggestion Card */}
                <div className="bg-white border border-slate-200 shadow-md rounded-xl p-5 mb-4 relative overflow-hidden group border-l-4 border-l-blue-500">
                  <div className="absolute top-0 right-0 p-2 opacity-100 transition-opacity flex gap-1">
                     <button className="h-7 w-7 bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors" title="Dismiss">
                        <X className="h-3.5 w-3.5" />
                     </button>
                     <button className="h-7 w-7 bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center justify-center transition-colors shadow-sm" title="Accept">
                        <Check className="h-3.5 w-3.5" />
                     </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                       <Sparkles className="h-3 w-3" /> AI Suggestion
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <FileSearch className="h-3 w-3" />
                      Source: Investigation INV-2026-109
                    </span>
                  </div>

                  <p className="text-slate-800 text-[13px] leading-relaxed font-medium">
                    Major Protocol Deviation identified for Subject 109-007. Subject was randomized to 'High PD-L1' stratum via IXRS on 05-Jan-2026, but source lab reports dated 04-Jan-2026 confirm PD-L1 expression of 42% (Low). This represents a violation of Inclusion Criterion #4.
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                     <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Root Cause Analysis</div>
                       <p className="text-[12px] text-slate-600">Site Coordinator manually entered unverified values into IXRS before source availability.</p>
                     </div>
                     <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estimand Impact</div>
                       <p className="text-[12px] text-rose-600 font-semibold flex items-center gap-1.5">
                         <Target className="h-3 w-3" /> Primary OS (ITT Population)
                       </p>
                     </div>
                  </div>
                </div>

                <p className="text-slate-400 text-[13px] italic pl-2 border-l-2 border-slate-100">
                  [Additional compliance notes to be added here...]
                </p>
              </div>

              {/* 4. Safety Review (Next) */}
              <div className="mb-10 group opacity-40">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">4. Safety Review</h3>
                <div className="h-24 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400">
                   <p className="text-[12px]">Ready to draft. AI has detected 1 discrepancy.</p>
                   <Button variant="outline" size="sm" className="h-7 text-[10px]">
                     <Wand2 className="h-3 w-3 mr-1.5" /> Draft with CoPilot
                   </Button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar (Right) */}
        {showAiPanel && (
          <div className="w-[360px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 shadow-xl shadow-slate-200/50">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm ring-2 ring-slate-100">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                   <span className="text-[13px] font-bold text-slate-900 block">Report Assistant</span>
                   <span className="text-[10px] text-slate-500 font-medium block">Context: Visit 4 (109)</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400" onClick={() => setShowAiPanel(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Stream */}
            <ScrollArea className="flex-1 p-5 bg-white">
              <div className="space-y-6">
                <div className="flex justify-center">
                   <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                     Today, 10:40 AM
                   </span>
                </div>
                
                {chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start")}>
                     <div className={cn(
                       "max-w-[90%] rounded-2xl px-4 py-3 text-[12px] leading-relaxed shadow-sm",
                       msg.role === 'user' 
                        ? "bg-slate-900 text-white rounded-br-sm" 
                        : "bg-slate-50 text-slate-700 border border-slate-100 rounded-bl-sm"
                     )}>
                       {msg.content}
                     </div>
                     {msg.role === 'assistant' && msg.action === 'suggestion' && (
                       <div className="max-w-[90%] w-full">
                         <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                           <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50">
                              <Sparkles className="h-3 w-3 text-blue-500" />
                              <span className="text-[10px] font-bold text-slate-700 uppercase">Suggestion Ready</span>
                              <span className="text-[9px] text-slate-400 ml-auto">Click to insert</span>
                           </div>
                           <div className="text-[11px] text-slate-600 line-clamp-2 font-medium">
                             {msg.payload.text}
                           </div>
                         </div>
                       </div>
                     )}
                     <span className="text-[9px] text-slate-300 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt, i) => (
                  <button key={i} className="text-[10px] font-medium bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg transition-all text-left">
                    {prompt}
                  </button>
                ))}
              </div>
              
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Ask Assistant to draft section..."
                  className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-10 text-[12px] focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none transition-all placeholder:text-slate-400 font-medium"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-sm">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Icons
function Building2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}