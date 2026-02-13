import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export function Skeleton({ className, width, height, circle, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-secondary/80",
        circle ? "rounded-full" : "rounded-md",
        className
      )}
      style={{
        width: width,
        height: height,
      }}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton height={20} width="40%" />
        <Skeleton height={16} width={24} circle />
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton height={12} width="100%" />
        <Skeleton height={12} width="85%" />
        <Skeleton height={12} width="90%" />
      </div>
      <div className="pt-4 flex gap-2">
        <Skeleton height={24} width={60} className="rounded-full" />
        <Skeleton height={24} width={60} className="rounded-full" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <Skeleton height={24} width={120} />
        <Skeleton height={32} width={100} className="rounded-full" />
      </div>
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <div className="bg-secondary/30 h-10 w-full mb-1" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center p-4 border-b border-border/50 last:border-0 gap-4">
            <Skeleton height={16} width={16} className="rounded-sm" />
            <Skeleton height={16} width="20%" />
            <Skeleton height={16} width="30%" />
            <Skeleton height={16} width="15%" />
            <Skeleton height={16} width="10%" />
          </div>
        ))}
      </div>
    </div>
  );
}
