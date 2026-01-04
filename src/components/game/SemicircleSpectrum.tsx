import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SemicircleSpectrumProps {
  leftLabel: string;
  rightLabel: string;
  targetCenter?: number; // 0-180 degrees
  showTarget?: boolean;
  needleAngle?: number; // 0-180 degrees
  onNeedleChange?: (angle: number) => void;
  isDraggable?: boolean;
  showReveal?: boolean;
  className?: string;
}

export const SemicircleSpectrum: React.FC<SemicircleSpectrumProps> = ({
  leftLabel,
  rightLabel,
  targetCenter,
  showTarget = false,
  needleAngle,
  onNeedleChange,
  isDraggable = false,
  showReveal = false,
  className,
}) => {
  const [localAngle, setLocalAngle] = useState(needleAngle ?? 90);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert mouse position to angle - fixed for proper direction
  const getAngleFromPosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return localAngle;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height; // bottom of semicircle
    
    const dx = clientX - centerX;
    const dy = centerY - clientY;
    
    // Calculate angle from center, 0° is right, 180° is left
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Clamp to valid semicircle range
    angle = Math.max(5, Math.min(175, angle));
    
    return angle;
  }, [localAngle]);

  const handlePositionUpdate = useCallback((clientX: number, clientY: number) => {
    if (!isDraggable) return;
    
    const angle = getAngleFromPosition(clientX, clientY);
    setLocalAngle(angle);
    onNeedleChange?.(angle);
  }, [isDraggable, getAngleFromPosition, onNeedleChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isDraggable) return;
    e.preventDefault();
    setIsDragging(true);
    handlePositionUpdate(e.clientX, e.clientY);
  }, [isDraggable, handlePositionUpdate]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isDraggable) return;
    e.preventDefault();
    setIsDragging(true);
    handlePositionUpdate(e.touches[0].clientX, e.touches[0].clientY);
  }, [isDraggable, handlePositionUpdate]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handlePositionUpdate(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handlePositionUpdate(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handlePositionUpdate]);

  useEffect(() => {
    if (needleAngle !== undefined && !isDragging) {
      setLocalAngle(needleAngle);
    }
  }, [needleAngle, isDragging]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isDraggable) return;
    
    let newAngle = localAngle;
    switch (e.key) {
      case "ArrowLeft":
        newAngle = Math.min(180, localAngle + 2);
        break;
      case "ArrowRight":
        newAngle = Math.max(0, localAngle - 2);
        break;
      case "Home":
        newAngle = 180;
        break;
      case "End":
        newAngle = 0;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    setLocalAngle(newAngle);
    onNeedleChange?.(newAngle);
  }, [isDraggable, localAngle, onNeedleChange]);

  // SVG pie slice helper - creates a wedge from center
  const describePieSlice = (startAngle: number, endAngle: number, radius: number) => {
    const startRad = startAngle * Math.PI / 180;
    const endRad = endAngle * Math.PI / 180;
    
    const x1 = 200 + radius * Math.cos(startRad);
    const y1 = 200 - radius * Math.sin(startRad);
    const x2 = 200 + radius * Math.cos(endRad);
    const y2 = 200 - radius * Math.sin(endRad);
    
    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    
    return [
      "M", 200, 200,
      "L", x1, y1,
      "A", radius, radius, 0, largeArcFlag, 0, x2, y2,
      "Z"
    ].join(" ");
  };

  // Calculate needle position
  const needleRad = localAngle * Math.PI / 180;
  const needleLength = 170;

  // Target zone - smaller, fills completely from center
  // Red (center): 6°, Orange: 8° each side, Yellow: 10° each side
  // Total: 6 + 16 + 20 = 42 degrees (~1/4 of 180)
  const redWidth = 6;
  const orangeWidth = 8;
  const yellowWidth = 10;

  const radius = 180;

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* SVG Semicircle */}
      <div 
        ref={containerRef}
        className={cn(
          "relative select-none touch-none",
          isDraggable && "cursor-crosshair"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role={isDraggable ? "slider" : undefined}
        aria-valuemin={0}
        aria-valuemax={180}
        aria-valuenow={isDraggable ? Math.round(localAngle) : undefined}
        aria-label={`Spectrum from ${leftLabel} to ${rightLabel}`}
        tabIndex={isDraggable ? 0 : undefined}
        onKeyDown={handleKeyDown}
      >
        <svg viewBox="0 0 400 210" className="w-full drop-shadow-lg">
          <defs>
            {/* Smooth gradient for background */}
            <linearGradient id="spectrumBg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(220, 70%, 50%)" />
              <stop offset="50%" stopColor="hsl(280, 50%, 40%)" />
              <stop offset="100%" stopColor="hsl(340, 70%, 50%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main semicircle background - clean gradient */}
          <path
            d={describePieSlice(0, 180, radius)}
            fill="url(#spectrumBg)"
            opacity="0.3"
          />
          
          {/* Outer arc border */}
          <path
            d={`M ${200 - radius} 200 A ${radius} ${radius} 0 0 1 ${200 + radius} 200`}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="4"
          />
          
          {/* Base line */}
          <line x1={200 - radius} y1="200" x2={200 + radius} y2="200" stroke="hsl(var(--border))" strokeWidth="4" />

          {/* Target zone - colored pie slices from center */}
          {(showTarget || showReveal) && targetCenter !== undefined && (
            <g className={cn(showReveal && "animate-reveal")} filter="url(#glow)">
              {/* Yellow outer band (10 points) */}
              <path
                d={describePieSlice(
                  targetCenter - redWidth/2 - orangeWidth - yellowWidth, 
                  targetCenter - redWidth/2 - orangeWidth, 
                  radius
                )}
                fill="hsl(48, 96%, 53%)"
              />
              <path
                d={describePieSlice(
                  targetCenter + redWidth/2 + orangeWidth, 
                  targetCenter + redWidth/2 + orangeWidth + yellowWidth, 
                  radius
                )}
                fill="hsl(48, 96%, 53%)"
              />
              
              {/* Orange band (20 points) */}
              <path
                d={describePieSlice(
                  targetCenter - redWidth/2 - orangeWidth, 
                  targetCenter - redWidth/2, 
                  radius
                )}
                fill="hsl(25, 95%, 53%)"
              />
              <path
                d={describePieSlice(
                  targetCenter + redWidth/2, 
                  targetCenter + redWidth/2 + orangeWidth, 
                  radius
                )}
                fill="hsl(25, 95%, 53%)"
              />
              
              {/* Red center (30 points - bullseye) */}
              <path
                d={describePieSlice(
                  targetCenter - redWidth/2, 
                  targetCenter + redWidth/2, 
                  radius
                )}
                fill="hsl(0, 72%, 50%)"
              />
            </g>
          )}

          {/* Tick marks around edge */}
          {[...Array(19)].map((_, i) => {
            const angle = i * 10;
            const rad = angle * Math.PI / 180;
            const inner = radius - 8;
            const outer = radius;
            return (
              <line
                key={i}
                x1={200 + inner * Math.cos(rad)}
                y1={200 - inner * Math.sin(rad)}
                x2={200 + outer * Math.cos(rad)}
                y2={200 - outer * Math.sin(rad)}
                stroke="hsl(var(--foreground))"
                strokeWidth={i % 2 === 0 ? 2 : 1}
                opacity={0.4}
              />
            );
          })}

          {/* Needle */}
          {(isDraggable || needleAngle !== undefined) && (
            <g filter="url(#glow)">
              {/* Needle shadow */}
              <line
                x1="200"
                y1="200"
                x2={200 + needleLength * Math.cos(needleRad)}
                y2={200 - needleLength * Math.sin(needleRad)}
                stroke="hsl(0, 0%, 0%)"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.2"
                className={cn(!isDragging && "transition-all duration-100 ease-out")}
              />
              {/* Needle line */}
              <line
                x1="200"
                y1="200"
                x2={200 + needleLength * Math.cos(needleRad)}
                y2={200 - needleLength * Math.sin(needleRad)}
                stroke="hsl(var(--destructive))"
                strokeWidth="6"
                strokeLinecap="round"
                className={cn(!isDragging && "transition-all duration-100 ease-out")}
              />
              
              {/* Needle base */}
              <circle
                cx="200"
                cy="200"
                r="12"
                fill="hsl(var(--card))"
                stroke="hsl(var(--destructive))"
                strokeWidth="4"
              />
              
              {/* Needle tip pointer */}
              <circle
                cx={200 + needleLength * Math.cos(needleRad)}
                cy={200 - needleLength * Math.sin(needleRad)}
                r="8"
                fill="hsl(var(--destructive))"
                className={cn(
                  !isDragging && "transition-all duration-100 ease-out",
                  isDraggable && "cursor-grab active:cursor-grabbing"
                )}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 px-2">
        <span className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-wide max-w-[100px] text-left">
          {leftLabel}
        </span>
        <span className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-wide max-w-[100px] text-right">
          {rightLabel}
        </span>
      </div>

      {/* Instruction */}
      {isDraggable && (
        <p className="text-xs text-muted-foreground mt-2 text-center opacity-70">
          Click or drag to position the needle
        </p>
      )}
    </div>
  );
};