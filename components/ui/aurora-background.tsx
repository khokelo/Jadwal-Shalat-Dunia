"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps {
  children?: ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col min-h-screen bg-zinc-950 text-foreground",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `[--dark-gradient:repeating-linear-gradient(100deg,#09090b_0%,#09090b_7%,transparent_10%,transparent_12%,#09090b_16%)]
            [--aurora:repeating-linear-gradient(100deg,#06b6d4_10%,#6366f1_20%,#3b82f6_30%,#a855f7_40%,#06b6d4_50%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            after:content-[''] after:absolute after:inset-0
            after:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:[background-attachment:fixed]
            after:mix-blend-difference
            absolute -inset-[10px] opacity-30 blur-[12px] will-change-transform animate-aurora`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_80%_0%,black_5%,transparent_65%)]`
          )}
        />
      </div>
      {children}
    </div>
  );
};
