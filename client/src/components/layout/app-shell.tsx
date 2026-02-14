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
  BarChart3,
  ListChecks,
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
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="px-2 py-4 mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white/50 hover:bg-white/80 border border-border/40 rounded-lg transition-all text-left group">
                 <div className="flex flex-col overflow-hidden">
                   <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">Current Study</span>
                   <span className="text-sm font-semibold text-foreground truncate">PEARL (NCT03003962)</span>
                 </div>
                 <ChevronDown className="h-4 w-4 text-muted-foreground" />
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

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 cursor-pointer group",
                    isActive 
                      ? "bg-secondary text-primary font-medium shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 px-3">
          <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Recent Dossiers</h3>
          <div className="space-y-1">
            {['Site 402 - Boston', 'Site 109 - London', 'Site 331 - Tokyo'].map((site, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors group">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-400/50 group-hover:bg-orange-500 transition-colors" />
                {site}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 shadow-inner" />
          <div className="flex flex-col">
            <span className="text-foreground font-medium text-xs">Alex Morgan</span>
            <span className="text-[10px]">Clinical Research Associate</span>
          </div>
          <Settings className="ml-auto h-4 w-4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans text-foreground">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border/60 bg-sidebar/50 backdrop-blur-xl p-4 z-20 hidden md:flex flex-col h-full">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-4">
             {/* Mobile Menu Trigger */}
             <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-muted-foreground">
                   <Menu className="h-5 w-5" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="w-72 p-4 bg-background/95 backdrop-blur-xl border-r border-border/60">
                 <SidebarContent />
               </SheetContent>
             </Sheet>

             <div className="flex items-center text-sm text-muted-foreground truncate">
                <span className="hidden sm:inline">Protocol: NCT03003962 (PEARL)</span>
                <ChevronRight className="h-4 w-4 mx-2 hidden sm:block" />
                <span className="text-foreground font-medium truncate">Durvalumab vs SoC in NSCLC</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search signals..." 
                className="h-9 w-48 md:w-64 rounded-full bg-secondary/50 border border-transparent focus:border-border/50 focus:bg-white transition-all pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </div>
            <button className="sm:hidden p-2 text-muted-foreground">
              <Search className="h-5 w-5" />
            </button>
            <button className="relative h-8 w-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5 md:h-4 md:w-4" />
              <span className="absolute top-2 right-2.5 h-1.5 w-1.5 bg-red-500 rounded-full border border-background" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
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
