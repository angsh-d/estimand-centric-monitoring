import { Link } from "wouter";
import { 
  ArrowRight, 
  Activity, 
  Calendar, 
  Users, 
  ChevronRight, 
  BrainCircuit,
  ShieldAlert,
  Target,
  Clock,
  CheckCircle2,
  Sparkles,
  LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const criticalActions = [
  {
    id: "ACT-001",
    type: "Safety",
    title: "SAE Reconciliation Required",
    desc: "Subject 109-004: Serious Adverse Event 'Grade 3 Neutropenia' in Safety DB missing from EDC.",
    impact: "High - Patient Safety",
    time: "2 hours ago",
    study: "PEARL (NCT03003962)"
  },
  {
    id: "ACT-002",
    type: "Efficacy",
    title: "Primary Endpoint Risk",
    desc: "3 Sites showing latency > 7 days for Tumor Assessment (RECIST 1.1) data entry.",
    impact: "Critical - PFS Analysis",
    time: "4 hours ago",
    study: "PEARL (NCT03003962)"
  }
];

const insights = [
  {
    id: "INS-001",
    title: "Enrollment Velocity",
    desc: "Site 402 is recruiting 2x faster than projected. Consider increasing monitoring frequency.",
    trend: "positive",
    metric: "+15%"
  },
  {
    id: "INS-002",
    title: "Protocol Deviation Cluster",
    desc: "New pattern detected: 'Missed PK Sample' across 3 EU sites. Potential kit supply issue?",
    trend: "negative",
    metric: "New Pattern"
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col">
      {/* Immersive Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Helix<span className="font-light text-slate-500">Intelligence</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Operational
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
               <div className="text-right hidden md:block">
                 <div className="text-sm font-medium">Alex Morgan</div>
                 <div className="text-xs text-slate-500">Lead Central Monitor</div>
               </div>
               <div className="h-9 w-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-medium">
                 AM
               </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        {/* Personalized Greeting & Context */}
        <section className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-semibold text-slate-900 mb-3">
              Good morning, Alex.
            </h1>
            <p className="text-xl text-slate-500 max-w-3xl leading-relaxed">
              Your <span className="font-medium text-blue-600">Primary Endpoint (PFS)</span> for the PEARL study is currently at <span className="font-medium text-slate-900">98% integrity</span>. 
              However, there are <span className="font-medium text-amber-600">2 critical actions</span> requiring your judgment to maintain this status.
            </p>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed: The "Morning Briefing" */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Critical Actions Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  Priority Actions (Needs Attention)
                </h2>
              </div>
              
              <div className="space-y-4">
                {criticalActions.map((action, idx) => (
                  <motion.div 
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                  >
                     <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
                       action.type === 'Safety' ? "bg-red-500" : "bg-amber-500"
                     )} />
                     
                     <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                         <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border",
                           action.type === 'Safety' ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"
                         )}>
                           {action.type} Impact
                         </span>
                         <span className="text-xs text-slate-400">• {action.study}</span>
                       </div>
                       <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                         <Clock className="h-3 w-3" /> {action.time}
                       </span>
                     </div>
                     
                     <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                       {action.title}
                     </h3>
                     <p className="text-sm text-slate-600 leading-relaxed mb-4">
                       {action.desc}
                     </p>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                           <Target className="h-4 w-4 text-slate-400" />
                           Impact: <span className="text-slate-900">{action.impact}</span>
                        </div>
                        <Link href="/study/investigations">
                          <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                            Investigate Signal <ArrowRight className="h-4 w-4" />
                          </button>
                        </Link>
                     </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Insights Section */}
            <div>
               <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Strategic Insights
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start mb-3">
                       <h3 className="font-semibold text-slate-800 text-sm">{insight.title}</h3>
                       <span className={cn("text-xs font-bold px-2 py-1 rounded", 
                         insight.trend === 'positive' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                       )}>
                         {insight.metric}
                       </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {insight.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar: Study Portfolio */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4 text-slate-400" />
                    Study Portfolio
                  </h3>
                  <button className="text-xs text-blue-600 hover:underline">View All</button>
                </div>
                
                <div className="divide-y divide-slate-100">
                   {[
                     { id: "PEARL", title: "Durvalumab vs SoC", status: "Active", alerts: 5, color: "blue" },
                     { id: "NEPTUNE", title: "Durvalumab + Tremelimumab", status: "Analysis", alerts: 2, color: "slate" },
                     { id: "BRIG-3001", title: "Brigatinib ALK+", status: "Follow-up", alerts: 0, color: "slate" }
                   ].map((study) => (
                     <Link key={study.id} href={study.id === "PEARL" ? "/study/dashboard" : "#"}>
                       <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-slate-500">{study.id}</span>
                            {study.alerts > 0 ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                {study.alerts} Signals
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3" /> Healthy
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-medium text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{study.title}</h4>
                          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                             <div className={cn("h-full w-[70%] rounded-full", study.id === "PEARL" ? "bg-blue-500" : "bg-slate-300")} />
                          </div>
                          <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                             <span>Progress</span>
                             <span>70%</span>
                          </div>
                       </div>
                     </Link>
                   ))}
                </div>
             </div>

             {/* Quick Links */}
             <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-5 text-white shadow-lg">
                <h3 className="font-semibold text-lg mb-1">Analytics Lab</h3>
                <p className="text-blue-100 text-xs mb-4">Run ad-hoc cross-study queries.</p>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <BrainCircuit className="h-4 w-4" />
                  Launch Workspace
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
