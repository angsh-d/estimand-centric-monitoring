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
  LayoutDashboard,
  Zap,
  MapPin,
  CalendarDays
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRole } from "@/components/layout/app-shell";

// --- Data for Lead Central Monitor ---
const leadActions = [
  {
    id: "ACT-001",
    type: "Safety",
    title: "SAE Reconciliation Required",
    desc: "Subject 109-004: Serious Adverse Event 'Grade 3 Neutropenia' in Safety DB missing from EDC.",
    impact: "High Impact",
    time: "2h ago",
    study: "PEARL"
  },
  {
    id: "ACT-002",
    type: "Efficacy",
    title: "Primary Endpoint Risk",
    desc: "3 Sites showing latency > 7 days for Tumor Assessment (RECIST 1.1) data entry.",
    impact: "Critical",
    time: "4h ago",
    study: "PEARL"
  }
];

const leadInsights = [
  {
    id: "INS-001",
    title: "Enrollment Velocity",
    desc: "Site 402 is recruiting 2x faster than projected.",
    trend: "positive",
    metric: "+15%"
  },
  {
    id: "INS-002",
    title: "Protocol Deviation Cluster",
    desc: "New pattern: 'Missed PK Sample' across 3 EU sites.",
    trend: "negative",
    metric: "New Pattern"
  }
];

// --- Data for CRA (Clinical Research Associate) ---
const craActions = [
  {
    id: "TASK-109",
    type: "Visit Prep",
    title: "Prepare for Site 109 Visit",
    desc: "Upcoming Monitoring Visit on Feb 18. 3 open queries and 1 SAE reconciliation pending review.",
    impact: "Due in 2 days",
    time: "10:00 AM",
    study: "PEARL"
  },
  {
    id: "TASK-204",
    type: "Query",
    title: "Site 204: Query Response",
    desc: "Dr. Chen replied to query #9921 regarding concomitant medication dose. Verify against source.",
    impact: "Action Required",
    time: "1h ago",
    study: "PEARL"
  }
];

const craSites = [
  { id: "109", name: "Charité Berlin", status: "Visit Planned", date: "Feb 18", alert: true },
  { id: "204", name: "Manchester Royal", status: "Remote Monitoring", date: "Feb 22", alert: false },
  { id: "882", name: "Hôpital Saint-Louis", status: "Report Pending", date: "Feb 10", alert: false },
];

export default function Landing() {
  const { role } = useRole();
  const isLead = role === "Lead Central Monitor";

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans text-slate-900 flex flex-col">
      {/* Immersive Header - Apple Style */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 transition-all duration-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-slate-900" />
            <span className="font-semibold text-base tracking-tight text-slate-900">Helix</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-[11px] font-medium text-slate-500 bg-slate-100/50 px-2 py-1 rounded-md border border-slate-200/50">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              System Operational
            </div>
            <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
              AM
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {/* Personalized Greeting */}
        <section className="mb-10 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3 tracking-tight">
              Good morning, Alex.
            </h1>
            
            {isLead ? (
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-2xl">
                Your Primary Endpoint (PFS) is at <span className="text-slate-900 font-medium">98% integrity</span>. 
                <br className="hidden md:block"/>
                However, <span className="text-amber-600 font-medium">2 critical actions</span> require your attention.
              </p>
            ) : (
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-2xl">
                You have <span className="text-slate-900 font-medium">1 monitoring visit</span> coming up this week.
                <br className="hidden md:block"/>
                Site 109 has <span className="text-amber-600 font-medium">3 items</span> to review before you travel.
              </p>
            )}
          </motion.div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main Feed */}
          <div className="md:col-span-8 space-y-8">
            
            {/* Critical Actions */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {isLead ? "Priority Actions" : "My Tasks"}
                </h2>
              </div>
              
              <div className="space-y-4">
                {(isLead ? leadActions : craActions).map((action, idx) => (
                  <motion.div 
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="group bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-white hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden active:scale-[0.99]"
                  >
                     <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                         <span className={cn("h-2 w-2 rounded-full",
                           action.type === 'Safety' || action.type === 'Visit Prep' ? "bg-amber-500" : "bg-blue-500"
                         )} />
                         <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                           {action.type}
                         </span>
                       </div>
                       <span className="text-[11px] font-medium text-slate-400">
                         {action.time}
                       </span>
                     </div>
                     
                     <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                       {action.title}
                     </h3>
                     <p className="text-[13px] text-slate-500 leading-relaxed mb-4 font-normal">
                       {action.desc}
                     </p>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                           <Target className="h-3 w-3" />
                           {action.impact}
                        </div>
                        <Link href={isLead ? "/study/investigations" : "/study/mvr"}>
                          <button className="text-[13px] font-medium text-blue-600 flex items-center gap-1 transition-opacity hover:opacity-80">
                            {isLead ? "Investigate" : "Open Workspace"} <ChevronRight className="h-3 w-3" />
                          </button>
                        </Link>
                     </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Insights (Only for Lead) or Recent Activity (For CRA) */}
            {isLead && (
              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Strategic Insights
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {leadInsights.map((insight) => (
                    <div key={insight.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <Zap className="h-4 w-4 text-slate-400" />
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", 
                          insight.trend === 'positive' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                        )}>
                          {insight.metric}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-[13px] mb-1">{insight.title}</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {insight.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-6">
             {isLead ? (
               // Lead: Study Portfolio
               <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 text-[13px]">Study Portfolio</h3>
                    <button className="text-[11px] font-medium text-blue-600">All</button>
                  </div>
                  
                  <div className="divide-y divide-slate-50">
                     {[
                       { id: "PEARL", title: "Durvalumab vs SoC", status: "Active", alerts: 5, color: "blue" },
                       { id: "NEPTUNE", title: "Durvalumab + Tremelimumab", status: "Analysis", alerts: 2, color: "slate" },
                       { id: "BRIG-3001", title: "Brigatinib ALK+", status: "Follow-up", alerts: 0, color: "slate" }
                     ].map((study) => (
                       <Link key={study.id} href={study.id === "PEARL" ? "/study/dashboard" : "#"}>
                         <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-bold text-slate-400">{study.id}</span>
                              {study.alerts > 0 ? (
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-red-100" />
                              ) : (
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                              )}
                            </div>
                            <h4 className="text-[13px] font-medium text-slate-900 mb-2">{study.title}</h4>
                            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                               <div className={cn("h-full w-[70%] rounded-full", study.id === "PEARL" ? "bg-slate-900" : "bg-slate-300")} />
                            </div>
                         </div>
                       </Link>
                     ))}
                  </div>
               </div>
             ) : (
               // CRA: Assigned Sites
               <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 text-[13px]">My Sites</h3>
                    <button className="text-[11px] font-medium text-blue-600">Map View</button>
                  </div>
                  
                  <div className="divide-y divide-slate-50">
                     {craSites.map((site) => (
                       <div key={site.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {site.id}
                            </span>
                            {site.alert && (
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-amber-100" />
                            )}
                          </div>
                          <h4 className="text-[13px] font-medium text-slate-900 mb-2">{site.name}</h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                             <CalendarDays className="h-3 w-3 text-slate-400" />
                             <span>{site.status}: {site.date}</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             )}

             {/* Quick Actions (Context Aware) */}
             <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
                <h3 className="font-semibold text-base mb-1">
                  {isLead ? "Analytics Lab" : "Travel Portal"}
                </h3>
                <p className="text-blue-100 text-[11px] mb-4 leading-relaxed opacity-90">
                  {isLead ? "Run ad-hoc cross-study queries." : "Book flights and hotels for Site 109."}
                </p>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-2 text-[12px] font-medium transition-colors flex items-center justify-center gap-2">
                  {isLead ? <BrainCircuit className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                  {isLead ? "Launch Workspace" : "Manage Bookings"}
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
