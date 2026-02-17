import { Link, useLocation } from "wouter";
import { 
  Search, 
  ChevronDown,
  ArrowLeft
} from "lucide-react";

export function GlobalNavbar() {
  const [location, setLocation] = useLocation();

  const isLanding = location === "/";

  return (
    <header className="h-[60px] border-b border-[#e5e5e5] flex items-center justify-between px-6 bg-white sticky top-0 z-50 shrink-0">
      <div className="flex items-center h-full gap-4">
        {!isLanding && (
          <button 
            onClick={() => history.back()} 
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        
        <Link href="/">
          <div className="flex items-center h-full cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src="https://www.saama.com/wp-content/uploads/saama_logo.svg" 
              alt="Saama" 
              className="h-6 w-auto"
            />
            <div className="h-6 w-[1px] bg-[#e5e5e5] mx-4" />
            <span className="text-[13px] font-medium text-[#6e6e73]">
              Clinical Trial Intelligence
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#86868b] group-focus-within:text-[#1d1d1f] transition-colors" />
          <input 
            type="text" 
            placeholder="Search sites, protocols, or investigators..." 
            className="h-9 w-[320px] rounded-full bg-[#f5f5f7] border-none pl-9 pr-4 text-[13px] text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-0 focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,125,250,0.1)] transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
            AM
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-[13px] font-medium text-[#1d1d1f]">Alex Morgan</span>
            <ChevronDown className="h-3 w-3 text-[#86868b]" />
          </div>
        </div>
      </div>
    </header>
  );
}
