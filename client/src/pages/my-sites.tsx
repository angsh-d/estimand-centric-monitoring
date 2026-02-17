import { AppShell } from "@/components/layout/app-shell";
import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  ChevronRight, 
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  ArrowRight,
  Plane
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "wouter";

// Mock Data for Sites
const sites = [
  {
    id: "109",
    name: "Charité Berlin",
    location: "Berlin, Germany",
    pi: "Dr. Klaus Webber",
    status: "Active",
    nextVisit: "Feb 19, 2026",
    visitType: "On-site - Targeted",
    alerts: 3,
    queries: 12,
    recruitment: "12/15",
    health: "warning"
  },
  {
    id: "204",
    name: "Manchester Royal Infirmary",
    location: "Manchester, UK",
    pi: "Dr. Sarah Chen",
    status: "Active",
    nextVisit: "Feb 22, 2026",
    visitType: "Remote Monitoring",
    alerts: 0,
    queries: 4,
    recruitment: "8/10",
    health: "good"
  },
  {
    id: "882",
    name: "Hôpital Saint-Louis",
    location: "Paris, France",
    pi: "Dr. Jean Dupont",
    status: "Active",
    nextVisit: "Mar 05, 2026",
    visitType: "On-site Monitoring",
    alerts: 1,
    queries: 7,
    recruitment: "15/15",
    health: "good"
  },
  {
    id: "402",
    name: "Mass General",
    location: "Boston, USA",
    pi: "Dr. James Wilson",
    status: "Active",
    nextVisit: "Mar 10, 2026",
    visitType: "Remote - Targeted",
    alerts: 1,
    queries: 0,
    recruitment: "14/20",
    health: "neutral"
  }
];

// Mock Data for Schedule
const upcomingVisits = [
  {
    id: "V-109-04",
    siteId: "109",
    siteName: "Charité Berlin",
    type: "On-site - Targeted",
    date: "Feb 19, 2026",
    duration: "2 Days",
    status: "Confirmed",
    tasks: ["SDV (Source Data Verification)", "Pharmacy Review", "ISF Check"]
  },
  {
    id: "V-204-02",
    siteId: "204",
    siteName: "Manchester Royal",
    type: "Remote Monitoring",
    date: "Feb 22, 2026",
    duration: "4 Hours",
    status: "Scheduled",
    tasks: ["Data Review", "Query Resolution"]
  }
];

export default function MySites() {
  const [view, setView] = useState<"list" | "map">("list");

  return (
    <div className="space-y-8 pb-10 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My Sites & Schedule</h1>
        <p className="text-slate-500 text-[13px] max-w-2xl font-normal">
          Manage your assigned sites, track upcoming visits, and monitor site health.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Site List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Assigned Sites (4)</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search sites..." 
                   className="h-8 w-48 rounded-lg bg-white border border-slate-200 pl-9 pr-4 text-[12px] focus:ring-2 focus:ring-slate-100 outline-none transition-all placeholder:text-slate-400"
                 />
              </div>
              <button className="h-8 w-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
                <Filter className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sites.map((site) => (
              <motion.div 
                key={site.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
                   site.health === 'warning' ? "bg-amber-500" : 
                   site.health === 'good' ? "bg-emerald-500" : "bg-slate-300"
                )} />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                     <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg shadow-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                       {site.id}
                     </div>
                     <div>
                       <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                         {site.name}
                         {site.alerts > 0 && (
                           <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full border border-red-100 font-medium flex items-center gap-1">
                             <AlertCircle className="h-3 w-3" /> {site.alerts} Alerts
                           </span>
                         )}
                       </h3>
                       <div className="flex items-center gap-3 text-[13px] text-slate-500 mt-1">
                         <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {site.location}</span>
                         <span className="h-1 w-1 rounded-full bg-slate-300" />
                         <span>PI: {site.pi}</span>
                       </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-6 pl-16 md:pl-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Recruitment</div>
                      <div className="text-[13px] font-medium text-slate-900">{site.recruitment}</div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Next Visit</div>
                      <div className="text-[13px] font-medium text-slate-900">{site.nextVisit}</div>
                    </div>
                    <Link href={`/study/site-dossier/${site.id}`}>
                      <button className="h-9 w-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Schedule */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Upcoming Visits</h2>
            <button className="text-[11px] font-medium text-blue-600 hover:underline">View Calendar</button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
               <div className="flex items-center justify-between">
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">February 2026</span>
                 <div className="flex gap-1">
                   <button className="p-1 hover:bg-white rounded text-slate-400 hover:text-slate-900 transition-colors"><ChevronRight className="h-4 w-4 rotate-180" /></button>
                   <button className="p-1 hover:bg-white rounded text-slate-400 hover:text-slate-900 transition-colors"><ChevronRight className="h-4 w-4" /></button>
                 </div>
               </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {upcomingVisits.map((visit) => (
                <div key={visit.id} className="p-5 hover:bg-slate-50 transition-colors group cursor-default">
                   <div className="flex justify-between items-start mb-3">
                     <div className="flex flex-col">
                       <span className="text-2xl font-light text-slate-900">{visit.date.split(' ')[1].replace(',', '')}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{visit.date.split(' ')[0]}</span>
                     </div>
                     <div className={cn(
                       "px-2 py-1 rounded text-[10px] font-medium border",
                       visit.type.includes("Remote") ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                     )}>
                       {visit.type}
                     </div>
                   </div>

                   <h3 className="text-[13px] font-semibold text-slate-900 mb-1">{visit.siteName} (Site {visit.siteId})</h3>
                   
                   <div className="space-y-2 mt-3">
                     {visit.tasks.map((task, i) => (
                       <div key={i} className="flex items-center gap-2 text-[11px] text-slate-500">
                         <div className="h-1 w-1 rounded-full bg-slate-300" />
                         {task}
                       </div>
                     ))}
                   </div>

                   <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {visit.duration}
                      </div>
                      <button className="text-[11px] font-medium text-slate-900 hover:text-blue-600 flex items-center gap-1 transition-colors">
                        <Plane className="h-3 w-3" />
                        Logistics
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
