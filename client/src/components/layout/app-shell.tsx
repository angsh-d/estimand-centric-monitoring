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
  ChevronDown,
  UserCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, createContext, useContext } from "react";
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

// --- Role Context ---
type UserRole = "Lead Central Monitor" | "Clinical Research Associate";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("Lead Central Monitor");

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <ShellContent>{children}</ShellContent>
    </RoleContext.Provider>
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role, setRole } = useRole();

  const navItems = role === "Lead Central Monitor" 
    ? [
        { label: "Study Overview", icon: LayoutDashboard, href: "/study/overview" },
        { label: "Criticality Model", icon: GitBranch, href: "/study/critical-data" },
        { label: "Signal Dashboard", icon: Activity, href: "/study/dashboard" },
        { label: "Investigation", icon: Search, href: "/study/investigations" },
        { label: "Site Dossiers", icon: Files, href: "/study/dossier" },
        { label: "MVR CoPilot", icon: FileText, href: "/study/mvr" },
        { label: "Data Status", icon: Database, href: "/study/data-status" },
        { label: "Configuration", icon: Settings, href: "/study/config" },
      ]
    : [
        { label: "My Sites", icon: LayoutDashboard, href: "/sites/my-sites" }, // Placeholder link
        { label: "Visit Schedule", icon: Calendar, href: "/sites/schedule" }, // Placeholder
        { label: "Site Dossiers", icon: Files, href: "/study/dossier" },
        { label: "MVR CoPilot", icon: FileText, href: "/study/mvr" },
        { label: "Query Resolution", icon: Search, href: "/study/investigations" },
      ];

  // Placeholder icon needed for CRA list above if not imported
  // Adding Calendar import to top... (handled below in standard way if I could edit imports directly but I am rewriting file)
  
  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between py-2">
      <div>
        <div className="px-2 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white/50 hover:bg-white border border-slate-200/60 rounded-xl transition-all text-left group shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                 <div className="flex flex-col overflow-hidden">
                   <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">Current Context</span>
                   <span className="text-sm font-semibold text-slate-900 truncate">
                     {role === "Lead Central Monitor" ? "PEARL (NCT03003962)" : "Northeast Region"}
                   </span>
                 </div>
                 <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Switch Role View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRole("Lead Central Monitor")}>
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", role === "Lead Central Monitor" ? "bg-blue-600" : "bg-slate-200")} />
                  <span>Lead Central Monitor</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRole("Clinical Research Associate")}>
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", role === "Clinical Research Associate" ? "bg-blue-600" : "bg-slate-200")} />
                  <span>Clinical Research Associate</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="space-y-0.5 px-2">
          {navItems.map((item) => {
            // Simple logic to handle placeholder links for now
            const isPlaceholder = item.href.startsWith("/sites/");
            const linkHref = isPlaceholder ? "/" : item.href; 
            
            const isActive = location === linkHref;
            return (
              <Link key={item.label} href={linkHref} onClick={() => setMobileOpen(false)}>
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
          <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">
            {role === "Lead Central Monitor" ? "Recent Dossiers" : "My Sites"}
          </h3>
          <div className="space-y-2">
            {(role === "Lead Central Monitor" 
              ? ['Site 402 - Boston', 'Site 109 - London', 'Site 331 - Tokyo'] 
              : ['Site 109 - London (Next Visit)', 'Site 204 - Manchester', 'Site 882 - Paris']
            ).map((site, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-900 cursor-pointer transition-colors group">
                <div className={cn("h-1.5 w-1.5 rounded-full transition-colors", 
                  role === "Clinical Research Associate" && i === 0 ? "bg-emerald-500 ring-2 ring-emerald-100" : "bg-slate-300 group-hover:bg-blue-500"
                )} />
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
            <span className="text-[10px] text-slate-500">{role}</span>
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
                <span className="hidden sm:inline font-medium text-slate-900">
                  {role === "Lead Central Monitor" ? "Protocol: NCT03003962" : "Region: EMEA North"}
                </span>
                <ChevronRight className="h-4 w-4 mx-2 text-slate-300 hidden sm:block" />
                <span className="truncate">
                  {role === "Lead Central Monitor" ? "Durvalumab vs SoC in NSCLC" : "3 Sites Assigned"}
                </span>
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
              key={location + role} // Force re-render on role change
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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

// Add Calendar icon import to the list
import { Calendar } from "lucide-react";
