import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Activity, 
  Search, 
  Settings, 
  Bell, 
  ChevronRight,
  Database,
  Files,
  Menu,
  Network,
  GitBranch,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Study Overview", icon: LayoutDashboard, href: "/study/overview" },
    { label: "Criticality Model", icon: GitBranch, href: "/study/critical-data" },
    { label: "Signal Dashboard", icon: Activity, href: "/study/dashboard" },
    { label: "Investigation", icon: Search, href: "/study/investigations" },
    { label: "Site Dossiers", icon: Files, href: "/study/dossier" },
    { label: "MVR CoPilot", icon: FileText, href: "/study/mvr" },
    { label: "Data Status", icon: Database, href: "/study/data-status" },
    { label: "Configuration", icon: Settings, href: "/study/config" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between py-2">
      <div>
        <div className="px-2 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white/50 hover:bg-white border border-slate-200/60 rounded-xl transition-all text-left group shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                 <div className="flex flex-col overflow-hidden">
                   <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">Current Study</span>
                   <span className="text-sm font-semibold text-slate-900 truncate">PEARL (NCT03003962)</span>
                 </div>
                 <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Switch Study</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>PEARL (NCT03003962)</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>NEPTUNE (NCT02542293)</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Brigatinib-3001</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/">Back to All Studies</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer group",
                    isActive 
                      ? "bg-slate-900 text-white shadow-sm" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <item.icon className={cn("h-4 w-4 stroke-[2]", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 px-5">
          <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Recent Dossiers</h3>
          <div className="space-y-2">
            {['Site 402 - Boston', 'Site 109 - London', 'Site 331 - Tokyo'].map((site, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-900 cursor-pointer transition-colors group">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors" />
                {site}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-2 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/50 cursor-pointer transition-colors">
          <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
            AM
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 font-medium text-xs">Alex Morgan</span>
            <span className="text-[10px] text-slate-500">Lead Central Monitor</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#F5F5F7] overflow-hidden font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-slate-200/60 bg-white/70 backdrop-blur-xl z-20 hidden md:flex flex-col h-full">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-14 border-b border-slate-200/60 bg-white/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-4">
             {/* Mobile Menu Trigger */}
             <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-slate-500">
                   <Menu className="h-5 w-5" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="w-72 p-0 bg-[#F5F5F7] border-r border-slate-200">
                 <SidebarContent />
               </SheetContent>
             </Sheet>

             <div className="flex items-center text-sm text-slate-500 truncate">
                <span className="hidden sm:inline font-medium text-slate-900">Protocol: NCT03003962</span>
                <ChevronRight className="h-4 w-4 mx-2 text-slate-300 hidden sm:block" />
                <span className="truncate">Durvalumab vs SoC in NSCLC</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="h-9 w-48 md:w-64 rounded-lg bg-white border border-slate-200/80 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all pl-9 pr-4 text-sm outline-none placeholder:text-slate-400 font-medium"
              />
            </div>
            <button className="sm:hidden p-2 text-slate-500">
              <Search className="h-5 w-5" />
            </button>
            <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200">
              <Bell className="h-5 w-5 stroke-[1.5]" />
              <span className="absolute top-2 right-2.5 h-1.5 w-1.5 bg-red-500 rounded-full ring-2 ring-[#F5F5F7]" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // Apple-style spring/ease
              className="max-w-7xl mx-auto min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
