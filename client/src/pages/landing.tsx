import { Link, useLocation } from "wouter";
import { 
  Search, 
  ChevronDown,
  ArrowRight,
  BrainCircuit,
  Activity,
  FileText,
  Database,
  Users,
  ShieldCheck,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock Data for Clinical Studies
const STUDIES = [
  {
    id: "NCT03003962",
    code: "PEARL",
    title: "Durvalumab vs SoC in Stage IV NSCLC",
    phase: "Phase III",
    status: "Active",
    sites: 42,
    patients: 680,
    alerts: 5,
    lastUpdate: "2h ago",
    progress: 68
  },
  {
    id: "NCT04561234",
    code: "NEPTUNE",
    title: "Durvalumab + Tremelimumab in mUC",
    phase: "Phase III",
    status: "Recruiting",
    sites: 89,
    patients: 320,
    alerts: 2,
    lastUpdate: "5h ago",
    progress: 42
  },
  {
    id: "NCT05519876",
    code: "BRIG-3001",
    title: "Brigatinib in ALK+ NSCLC (First Line)",
    phase: "Phase II",
    status: "Startup",
    sites: 24,
    patients: 0,
    alerts: 0,
    lastUpdate: "1d ago",
    progress: 5
  }
];

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-full bg-white font-sans text-[#1d1d1f] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <section className="pt-24 pb-20 px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[56px] leading-[1.05] font-semibold tracking-tight text-[#1d1d1f] mb-4">
              Estimand-Centric Monitoring
            </h1>
            <p className="text-[24px] leading-normal text-[#6e6e73] font-normal mb-8 max-w-2xl mx-auto">
              Monitor What Matters.
            </p>
            <p className="text-[17px] leading-relaxed text-[#424245] font-normal max-w-xl mx-auto mb-10">
              Transform clinical oversight from reactive signal counting to proactive health assessment of your study's primary objectives.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setLocation("/study/dashboard")}
                className="h-10 px-6 rounded-full bg-[#1d1d1f] text-white text-[13px] font-medium hover:bg-[#333336] transition-colors shadow-sm"
              >
                View Dashboard
              </button>
              <button className="h-10 px-6 rounded-full bg-white border border-[#d2d2d7] text-[#1d1d1f] text-[13px] font-medium hover:border-[#86868b] transition-colors">
                Learn Methodology
              </button>
            </div>
          </motion.div>
        </section>

        {/* Clinical Studies Grid */}
        <section className="bg-[#f5f5f7] py-20 px-6 min-h-[500px]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[24px] font-semibold text-[#1d1d1f]">Onboarded Studies</h2>
              <button className="text-[13px] font-medium text-[#0066cc] hover:underline flex items-center gap-1">
                View all studies <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {STUDIES.map((study, i) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  onClick={() => setLocation("/study/dashboard")}
                  className="bg-white rounded-[20px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all cursor-pointer group border border-transparent hover:border-[#0066cc]/20 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider mb-1">
                        {study.code}
                      </span>
                      <span className="text-[10px] font-medium text-[#424245] bg-[#f5f5f7] px-2 py-0.5 rounded-full inline-block w-fit">
                        {study.id}
                      </span>
                    </div>
                    {study.alerts > 0 ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-medium border border-red-100">
                        <Activity className="h-3 w-3" />
                        {study.alerts} Signals
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-medium border border-emerald-100">
                        <ShieldCheck className="h-3 w-3" />
                        Healthy
                      </div>
                    )}
                  </div>

                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2 leading-tight group-hover:text-[#0066cc] transition-colors">
                    {study.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-[13px] text-[#6e6e73] mb-6">
                    <span className="flex items-center gap-1.5">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      {study.phase}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {study.sites} Sites
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[11px] font-medium mb-1.5">
                      <span className="text-[#86868b]">Enrollment Progress</span>
                      <span className="text-[#1d1d1f]">{study.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f5f5f7] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1d1d1f] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${study.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#f5f5f7] flex items-center justify-between">
                    <span className="text-[11px] text-[#86868b]">
                      Updated {study.lastUpdate}
                    </span>
                    <div className="h-7 w-7 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] group-hover:bg-[#0066cc] group-hover:text-white transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add New Study Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white rounded-[20px] p-6 border border-dashed border-[#d2d2d7] flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-[#86868b] hover:bg-[#fafafa] transition-all min-h-[280px] group"
              >
                <div className="h-12 w-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#86868b] group-hover:text-[#1d1d1f] transition-colors">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Onboard New Study</h3>
                  <p className="text-[13px] text-[#86868b] mt-1">
                    Import protocol or start from scratch
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
