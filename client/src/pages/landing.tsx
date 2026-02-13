import { Link } from "wouter";
import { ArrowRight, Activity, Calendar, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const studies = [
  {
    id: "NCT03003962",
    title: "PEARL: Durvalumab vs SoC",
    phase: "Phase III",
    indication: "PD-L1-High Advanced NSCLC",
    sites: 142,
    patients: 680,
    status: "Active - Enrolling",
    nextVisit: "19 Feb 2026",
    alerts: 5
  },
  {
    id: "NCT02542293",
    title: "NEPTUNE: Durvalumab + Tremelimumab",
    phase: "Phase III",
    indication: "Metastatic NSCLC",
    sites: 210,
    patients: 800,
    status: "Active - Analysis",
    nextVisit: "22 Feb 2026",
    alerts: 2
  },
  {
    id: "NCT03596866",
    title: "Brigatinib-3001: ALK+ NSCLC",
    phase: "Phase III",
    indication: "ALK+ NSCLC (Post-Crizotinib)",
    sites: 85,
    patients: 240,
    status: "Active - Long Term Follow-up",
    nextVisit: "28 Feb 2026",
    alerts: 0
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      {/* Top Navigation */}
      <nav className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center h-full">
          <img 
            src="https://www.saama.com/wp-content/uploads/saama_logo.svg" 
            alt="Saama" 
            className="h-8 w-auto mr-6"
          />
          <div className="h-6 w-px bg-border mx-2" />
          <span className="text-sm font-medium tracking-tight ml-4 text-foreground/90">Clinical Trial Intelligence</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium">Alex Morgan</div>
            <div className="text-xs text-muted-foreground">Clinical Research Associate</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground border border-border">
            <span className="font-semibold text-xs">AM</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-primary mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                System Operational
              </div>
              <h1 className="text-5xl font-serif font-medium tracking-tight text-foreground mb-6 leading-[1.1]">
                Welcome back, Alex.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                You have <span className="text-foreground font-medium">5 active signals</span> requiring attention across your assigned studies. 
                Intelligence analysis for "PEARL: Durvalumab vs SoC" was last updated 15 minutes ago.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Studies Grid */}
        <section className="flex-1 bg-secondary/10 border-t border-border/40 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold tracking-tight">Assigned Studies</h2>
              <div className="flex gap-2">
                 <span className="text-sm text-muted-foreground">Sorted by: Priority</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studies.map((study, idx) => (
                <Link key={study.id} href={study.id === "NCT03003962" ? "/study/dashboard" : "#"}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="group bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-border transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2.5 py-1 rounded bg-secondary text-xs font-medium text-muted-foreground border border-border/50">
                        {study.id}
                      </div>
                      {study.alerts > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-medium">
                          <Activity className="h-3 w-3" />
                          {study.alerts} Signals
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {study.indication} • {study.phase}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 opacity-70" />
                        <span>{study.patients} Patients</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 opacity-70" />
                        <span>Next Visit: {study.nextVisit.split(' ')[0]} {study.nextVisit.split(' ')[1]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        {study.status}
                      </span>
                      <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
              
              {/* Add New Study Placeholder */}
              <div className="border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-secondary/20 transition-colors cursor-not-allowed opacity-60">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-2xl text-muted-foreground font-light">+</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Request Access</h3>
                  <p className="text-sm text-muted-foreground">Join another study team</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
