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
      { left: "14%", top: "22%", Icon: Sparkles, size: "w-6 h-6", delay: "0s" },
      { left: "82%", top: "20%", Icon: Star, size: "w-5 h-5", delay: "0.08s" },
      { left: "55%", top: "68%", Icon: Sparkles, size: "w-5 h-5", delay: "0.16s" },
    ],
    []
  );

  if (!show || points <= 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* A few fixed sparkles only (no pulse rings / no randomness) */}
      {items.map(({ left, top, Icon, size, delay }, idx) => (
        <div
          key={idx}
          className="absolute animate-sparkle-float"
          style={{ left, top, animationDelay: delay, animationDuration: "1200ms" }}
        >
          <Icon className={cn(size, "text-warning/90")} />
        </div>
      ))}
    </div>
  );
};
