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
  Target,
  ChevronDown,
  Printer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Mock Context (Charité Berlin Storyline) ---
const VISIT_CONTEXT = {
  protocolTitle: "Phase III Randomized Trial of Durvalumab vs SoC in NSCLC",
  protocolName: "PEARL (NCT03003962)",
  sponsor: "Saama Pharmaceuticals",
  drugName: "Durvalumab (Medi4736)",
  siteName: "Charité - Universitätsmedizin Berlin",
  siteNumber: "109",
  investigator: "Dr. Klaus Webber",
  activationDate: "15-Aug-2024",
  address: "Charitéplatz 1, 10117 Berlin, Germany",
  lastVisitDate: "12-Jan-2026",
  currentVisitDate: "19-Feb-2026",
  visitType: "IMV", // Interim Monitoring Visit
};

// --- Report Sections Configuration ---
const REPORT_SECTIONS = [
  { id: "admin", title: "1. Administrative Data", status: "complete" },
  { id: "summary", title: "2. Visit Summary", status: "complete" },
  { id: "urgent", title: "3. Urgent Issues", status: "attention" },
  { id: "enrollment", title: "4. Enrolment Status", status: "complete" },
  { id: "icf", title: "5. Informed Consent", status: "attention" },
  { id: "site_mgmt", title: "6. Site Staff & Facilities", status: "pending" },
];

const CHAT_HISTORY = [
  {
    role: "user",
    content: "Draft the Urgent Issues section based on the Stratification Error we found.",
    time: "10:42 AM"
  },
  {
    role: "assistant",
    content: "I've drafted the Urgent Issues section. I included the Stratification Error for Subject 109-007 as a Critical Finding requiring REB notification.",
    action: "suggestion",
    source: "INV-2026-109",
    payload: {
      section: "urgent",
      field: "urgent_description_A",
      text: "Critical Finding: Subject 109-007 was mis-stratified in IXRS (High PD-L1) vs Source (Low PD-L1). This affects the Primary Estimand (ITT). Site must notify REB and submit a protocol deviation immediately.",
      status: "pending_review"
    },
    time: "10:42 AM"
  }
];

export default function MVRCopilot() {
  const [activeSection, setActiveSection] = useState("urgent");
  const [showAiPanel, setShowAiPanel] = useState(true);

  // Form State (Mock)
  const [formData, setFormData] = useState({
    urgentIssues: "yes",
    urgentDescA: "",
    summaryActivities: "This IMV focused on SDV for recent enrollees and closure of pending queries from the Remote Visit on Jan 12. Pharmacy logs were reviewed. Review of Stratification Module in IXRS was prioritized due to central monitoring signals.",
    overallImpression: "Site organization remains high. However, a critical process gap in randomization verification was identified.",
    enrollment: {
      screened: 18,
      consented: 15,
      randomized: 12,
      active: 11,
      completed: 1,
      withdrawn: 0
    }
  });

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm font-sans">
      
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm shrink-0 z-20">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-3">
            MVR CoPilot
            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-medium px-2 py-0.5 text-[10px] uppercase tracking-wider">
              Draft Mode
            </Badge>
          </h1>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 font-medium">
             <span>{VISIT_CONTEXT.protocolName}</span>
             <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
             <span>Site {VISIT_CONTEXT.siteNumber}</span>
             <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
             <span>{VISIT_CONTEXT.visitType}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-8 text-[11px] font-medium border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <Printer className="h-3.5 w-3.5 mr-2" /> Preview PDF
          </Button>
          <Button size="sm" className="h-8 text-[11px] font-medium bg-slate-900 text-white hover:bg-slate-800 shadow-sm gap-2">
            <Save className="h-3.5 w-3.5" />
            Save Report
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Rail (Left) */}
        <div className="w-64 bg-slate-50 border-r border-slate-100 flex flex-col overflow-y-auto py-4 hidden lg:flex shrink-0">
          <div className="px-4 mb-4">
             <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Report Sections</h3>
             <div className="space-y-1">
               {REPORT_SECTIONS.map((section) => (
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
                   {section.status === "pending" && <div className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Form Editor (Center) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/30 relative">
          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            <div className="max-w-4xl mx-auto bg-white min-h-[1000px] shadow-sm border border-slate-200 rounded-xl p-10 md:p-14 relative print-simulate">
              
              {/* Report Header Title Block */}
              <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight mb-2">Monitoring Visit Report</h1>
                <p className="text-sm text-slate-500 font-medium">Confidential • Saama Clinical Intelligence</p>
              </div>

              {/* 1. Administrative Data */}
              <div id="admin" className="mb-12 scroll-mt-20">
                <SectionHeader title="1. Administrative Data" />
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <Field label="Protocol Title" value={VISIT_CONTEXT.protocolTitle} />
                  <Field label="Protocol Name" value={VISIT_CONTEXT.protocolName} />
                  <Field label="Sponsor" value={VISIT_CONTEXT.sponsor} />
                  <Field label="Study Drug Name" value={VISIT_CONTEXT.drugName} />
                  <Field label="Site Name" value={VISIT_CONTEXT.siteName} />
                  <Field label="Site Number" value={VISIT_CONTEXT.siteNumber} />
                  <Field label="Investigator" value={VISIT_CONTEXT.investigator} />
                  <Field label="Site Address" value={VISIT_CONTEXT.address} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Last Visit Date" value={VISIT_CONTEXT.lastVisitDate} />
                    <Field label="Current Visit Date" value={VISIT_CONTEXT.currentVisitDate} />
                  </div>
                  <Field label="Type of Visit" value={VISIT_CONTEXT.visitType} />
                </div>
              </div>

              {/* 2. Summary of Monitoring Visit */}
              <div id="summary" className="mb-12 scroll-mt-20">
                <SectionHeader title="2. Summary of Monitoring Visit" />
                
                <div className="space-y-6">
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Monitoring Activities</Label>
                    <Textarea 
                      className="min-h-[120px] text-[13px] bg-slate-50 border-slate-200"
                      value={formData.summaryActivities}
                      onChange={(e) => setFormData({...formData, summaryActivities: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Overall Impression</Label>
                    <Textarea 
                      className="min-h-[80px] text-[13px] bg-slate-50 border-slate-200"
                      value={formData.overallImpression}
                      onChange={(e) => setFormData({...formData, overallImpression: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Exit Interview Comments</Label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-400 italic">
                      Pending completion of visit...
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Urgent Issues */}
              <div id="urgent" className="mb-12 scroll-mt-20">
                 <div className="flex items-center justify-between mb-4">
                    <SectionHeader title="3. Urgent Issues" className="mb-0" />
                    <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50">Action Required</Badge>
                 </div>
                 
                 <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-4 mb-4">
                       <div className="text-[13px] font-bold text-slate-700 mt-1">
                         Were any issues that require urgent action observed at this visit?
                       </div>
                       <RadioGroup defaultValue="yes" className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="urgent-yes" className="text-rose-600 border-rose-600" />
                            <Label htmlFor="urgent-yes" className="font-semibold text-rose-700">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="urgent-no" />
                            <Label htmlFor="urgent-no">None to Report</Label>
                          </div>
                       </RadioGroup>
                    </div>

                    {/* AI Suggested Content Block */}
                    <div className="relative group">
                      <div className="absolute -left-3 top-0 bottom-0 w-1 bg-rose-500 rounded-full" />
                      <Label className="text-xs font-bold text-rose-700 uppercase mb-2 block flex items-center gap-2">
                        Issue Description (A)
                        <span className="flex items-center gap-1 text-[9px] font-normal bg-white border border-rose-200 px-1.5 py-0.5 rounded text-rose-600">
                          <Sparkles className="h-2.5 w-2.5" /> AI Suggestion Ready
                        </span>
                      </Label>
                      <Textarea 
                        className="min-h-[100px] text-[13px] bg-white border-rose-200 text-slate-800 font-medium focus:ring-rose-100 focus:border-rose-400"
                        placeholder="Describe the urgent issue..."
                        defaultValue={CHAT_HISTORY[1].payload.text} 
                      />
                      <div className="mt-2 flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" className="h-6 text-[10px] text-slate-400 hover:text-slate-900">Dismiss</Button>
                        <Button size="sm" variant="outline" className="h-6 text-[10px] bg-white border-rose-200 text-rose-700 hover:bg-rose-50">Confirm Issue</Button>
                      </div>
                    </div>
                 </div>
              </div>

              {/* 4. Enrolment Status */}
              <div id="enrollment" className="mb-12 scroll-mt-20">
                <SectionHeader title="4. Enrolment Status" />
                
                <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
                  <table className="w-full text-[13px]">
                    <tbody className="divide-y divide-slate-100">
                      <Row label="Total Number of Subjects Screened" value={formData.enrollment.screened} />
                      <Row label="Total Number of Subjects Consented" value={formData.enrollment.consented} />
                      <Row label="Total Number of Pre-Randomization Failure" value={formData.enrollment.screened - formData.enrollment.consented} />
                      <Row label="Total Number of Subjects Randomized" value={formData.enrollment.randomized} highlight />
                      <Row label="Total Number of Subjects Completed Study" value={formData.enrollment.completed} />
                      <Row label="Total Number of Subjects Ongoing" value={formData.enrollment.active} />
                      <Row label="Total Number of Subjects Withdrawn" value={formData.enrollment.withdrawn} />
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Recruitment Plan & Activities</Label>
                    <div className="text-[13px] text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                      Site has met 80% of recruitment target (12/15). No additional advertising required at this time.
                    </div>
                  </div>
                  <div>
                     <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Is recruitment rate adequate?</Label>
                     <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Yes
                        </Badge>
                     </div>
                  </div>
                </div>
              </div>

              {/* 5. Informed Consent */}
              <div id="icf" className="mb-12 scroll-mt-20">
                <SectionHeader title="5. Informed Consent" />
                
                <div className="mb-6">
                   <div className="grid grid-cols-12 gap-4 bg-slate-100 p-2 rounded-t-lg text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <div className="col-span-2">Subject No.</div>
                      <div className="col-span-4">ICF Version Date</div>
                      <div className="col-span-3">Correct Version?</div>
                      <div className="col-span-3">Action</div>
                   </div>
                   <div className="divide-y divide-slate-100 border border-t-0 border-slate-200 rounded-b-lg">
                      <ICFRow subject="109-007" date="29/Apr/2019" correct={true} />
                      <ICFRow subject="109-004" date="29/Apr/2019" correct={true} />
                      <ICFRow subject="109-011" date="21/Feb/2019" correct={false} action="Re-consent required (New Amendment)" />
                   </div>
                </div>

                <div className="space-y-4">
                   <Question 
                     number="1" 
                     text="Was written Informed Consent obtained for every subject reviewed at this visit?" 
                     answer="Yes" 
                   />
                   <Question 
                     number="2" 
                     text="Was Consent obtained for all subjects prior to participation?" 
                     answer="Yes" 
                   />
                   <Question 
                     number="3" 
                     text="Were there any deviations or deficiencies noted in ICFs?" 
                     answer="Yes"
                     comment="Subject 109-011 signed outdated version. Protocol deviation logged."
                     isNegative
                   />
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
                   <span className="text-[13px] font-bold text-slate-900 block">Report CoPilot</span>
                   <span className="text-[10px] text-slate-500 font-medium block">Context: Site 109 / IMV 4</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400" onClick={() => setShowAiPanel(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Stream */}
            <ScrollArea className="flex-1 p-5 bg-white">
              <div className="space-y-6">
                {CHAT_HISTORY.map((msg, i) => (
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
                              <FileText className="h-3 w-3 text-blue-500" />
                              <span className="text-[10px] font-bold text-slate-700 uppercase">Content Drafted</span>
                              <span className="text-[9px] text-slate-400 ml-auto">Section 3</span>
                           </div>
                           <div className="text-[11px] text-slate-600 line-clamp-2 font-medium">
                             {msg.payload.text}
                           </div>
                           <div className="mt-2 text-[10px] font-bold text-blue-600 flex items-center gap-1 group-hover:underline">
                             Jump to Section <ArrowUpRight className="h-3 w-3" />
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
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Ask CoPilot to draft, summarize, or review..."
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

// --- Components ---

function SectionHeader({ title, className }: { title: string, className?: string }) {
  return (
    <h2 className={cn("text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 mb-4", className)}>
      {title}
    </h2>
  );
}

function Field({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[13px] font-medium text-slate-900 border-b border-slate-100 pb-1">{value}</div>
    </div>
  );
}

function Row({ label, value, highlight = false }: { label: string, value: number, highlight?: boolean }) {
  return (
    <tr className={cn("group hover:bg-slate-50", highlight ? "bg-slate-50/50" : "")}>
      <td className="py-2.5 px-4 text-slate-600 font-medium border-r border-slate-100 w-3/4">{label}</td>
      <td className={cn("py-2.5 px-4 font-bold text-center", highlight ? "text-slate-900" : "text-slate-700")}>{value}</td>
    </tr>
  );
}

function ICFRow({ subject, date, correct, action }: { subject: string, date: string, correct: boolean, action?: string }) {
  return (
    <div className="grid grid-cols-12 gap-4 p-2 text-[12px] items-center hover:bg-slate-50">
       <div className="col-span-2 font-bold text-slate-900">{subject}</div>
       <div className="col-span-4 text-slate-600 font-mono">{date}</div>
       <div className="col-span-3">
         {correct ? (
           <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Yes</Badge>
         ) : (
           <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">No</Badge>
         )}
       </div>
       <div className="col-span-3 text-slate-500 text-[11px] leading-tight">{action || "-"}</div>
    </div>
  );
}

function Question({ number, text, answer, comment, isNegative = false }: { number: string, text: string, answer: string, comment?: string, isNegative?: boolean }) {
  return (
    <div className="p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
       <div className="flex items-start justify-between gap-4">
         <div className="flex gap-3">
           <div className="h-5 w-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-0.5">{number}</div>
           <p className="text-[13px] text-slate-700 font-medium">{text}</p>
         </div>
         <div className="flex gap-4 shrink-0">
           <div className={cn("font-bold text-[13px]", isNegative ? "text-rose-600" : "text-slate-900")}>{answer}</div>
         </div>
       </div>
       {comment && (
         <div className="mt-2 ml-8 text-[12px] bg-slate-50 p-2 rounded border border-slate-200 text-slate-600 italic">
           {comment}
         </div>
       )}
    </div>
  );
}