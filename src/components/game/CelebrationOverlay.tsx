import React, { useMemo } from "react";
import { Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CelebrationOverlayProps {
  show: boolean;
  points: number;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ show, points }) => {
  const items = useMemo(
    () => [
      { left: "12%", top: "20%", Icon: Sparkles, size: "w-6 h-6", delay: "0s" },
      { left: "78%", top: "18%", Icon: Star, size: "w-5 h-5", delay: "0.1s" },
      { left: "18%", top: "62%", Icon: Star, size: "w-4 h-4", delay: "0.2s" },
      { left: "86%", top: "58%", Icon: Sparkles, size: "w-6 h-6", delay: "0.15s" },
      { left: "40%", top: "12%", Icon: Sparkles, size: "w-5 h-5", delay: "0.05s" },
      { left: "55%", top: "70%", Icon: Star, size: "w-4 h-4", delay: "0.25s" },
    ],
    []
  );

  if (!show || points <= 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Soft center pulse */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className={cn(
            "rounded-full",
            "bg-primary/15",
            "animate-ping",
            points >= 30 ? "w-56 h-56" : points >= 20 ? "w-44 h-44" : "w-36 h-36"
          )}
          style={{ animationDuration: "900ms" }}
        />
      </div>

      {/* A few fixed sparkles (no per-render randomness) */}
      {items.map(({ left, top, Icon, size, delay }, idx) => (
        <div
          key={idx}
          className="absolute animate-sparkle-float"
          style={{ left, top, animationDelay: delay, animationDuration: "1400ms" }}
        >
          <Icon className={cn(size, "text-warning")} />
        </div>
      ))}
    </div>
  );
};
