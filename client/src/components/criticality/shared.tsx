import { cn } from "@/lib/utils";
import { FileText, AlertCircle, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const AppleCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-black/[0.03]", className)}>
    {children}
  </div>
);

export const AppleBadge = ({ children, active, color = "gray" }: { children: React.ReactNode, active?: boolean, color?: "blue" | "green" | "amber" | "gray" | "black" }) => {
  const colors = {
    blue: "bg-black",
    green: "bg-black",
    amber: "bg-gray-400",
    gray: "bg-gray-300",
    black: "bg-black"
  };
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors",
      active ? "bg-black/[0.03] text-black" : "text-black/60"
    )}>
      <div className={cn("h-1.5 w-1.5 rounded-full", colors[color])} />
      {children}
    </div>
  );
};

export const SkeletonLine = ({ className }: { className?: string }) => (
  <div className={cn("h-4 bg-black/[0.04] rounded animate-pulse", className)} />
);

export const ProvenanceTooltip = ({ source, conf = "high", children }: { source: string, conf?: string, children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild className="cursor-help">
        {children}
      </TooltipTrigger>
      <TooltipContent sideOffset={4} className="bg-white/90 backdrop-blur-xl text-black border-black/5 text-xs p-3 max-w-xs shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl z-50">
        <div className="font-semibold mb-1 flex items-center gap-1.5 text-black/60 uppercase tracking-wider text-[10px]">
          <FileText className="h-3 w-3" /> Provenance
        </div>
        <p className="mb-2 text-black/90">Extracted from: <span className="font-medium">{source}</span></p>
        {conf === "low" && (
            <div className="flex items-start gap-1.5 text-amber-700 bg-amber-50 p-2 rounded-lg text-[10px] leading-tight">
                <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                <span>Low confidence extraction. System inferred this relationship. Verification recommended.</span>
            </div>
        )}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
