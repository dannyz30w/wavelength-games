import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SemicircleSpectrumProps {
  leftLabel: string;
  rightLabel: string;
  targetCenter?: number;
  showTarget?: boolean;
  needleAngle?: number;
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

  const getAngleFromPosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return localAngle;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height;
    
    const dx = clientX - centerX;
    const dy = centerY - clientY;
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = Math.max(3, Math.min(177, angle));
    
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isDraggable) return;
    
    let newAngle = localAngle;
    switch (e.key) {
      case "ArrowLeft":
        newAngle = Math.min(177, localAngle + 2);
        break;
      case "ArrowRight":
        newAngle = Math.max(3, localAngle - 2);
        break;
      default:
        return;
    }
    
    e.preventDefault();
    setLocalAngle(newAngle);
    onNeedleChange?.(newAngle);
  }, [isDraggable, localAngle, onNeedleChange]);

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

  const needleRad = localAngle * Math.PI / 180;
  const needleLength = 155;

  // Smaller zones (3/4 original size)
  const redWidth = 4;
  const orangeWidth = 6;
  const yellowWidth = 8;
  const radius = 175;

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
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
        <svg viewBox="0 0 400 220" className="w-full">
          <defs>
            {/* Glow filters for animations */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background semicircle */}
          <path
            d={describePieSlice(0, 180, radius)}
            fill="hsl(240 8% 10%)"
          />
          
          {/* Outer arc border with subtle glow */}
          <path
            d={`M ${200 - radius} 200 A ${radius} ${radius} 0 0 1 ${200 + radius} 200`}
            fill="none"
            stroke="hsl(215 60% 30%)"
            strokeWidth="2"
            opacity="0.5"
          />
          
          {/* Base line */}
          <line 
            x1={200 - radius} 
            y1="200" 
            x2={200 + radius} 
            y2="200" 
            stroke="hsl(215 40% 25%)" 
            strokeWidth="2" 
          />

          {/* Target zone - static, no animations */}
          {(showTarget || showReveal) && targetCenter !== undefined && (
            <g className={cn(showReveal && "animate-pop")} filter={showReveal ? "url(#glow)" : undefined}>
              {/* Yellow outer zones */}
              <path
                d={describePieSlice(
                  Math.max(0, targetCenter - redWidth/2 - orangeWidth - yellowWidth), 
                  Math.max(0, targetCenter - redWidth/2 - orangeWidth), 
                  radius - 6
                )}
                fill="hsl(48, 100%, 55%)"
              />
              <path
                d={describePieSlice(
                  Math.min(180, targetCenter + redWidth/2 + orangeWidth), 
                  Math.min(180, targetCenter + redWidth/2 + orangeWidth + yellowWidth), 
                  radius - 6
                )}
                fill="hsl(48, 100%, 55%)"
              />
              
              {/* Orange middle zones */}
              <path
                d={describePieSlice(
                  Math.max(0, targetCenter - redWidth/2 - orangeWidth), 
                  Math.max(0, targetCenter - redWidth/2), 
                  radius - 6
                )}
                fill="hsl(28, 100%, 55%)"
              />
              <path
                d={describePieSlice(
                  Math.min(180, targetCenter + redWidth/2), 
                  Math.min(180, targetCenter + redWidth/2 + orangeWidth), 
                  radius - 6
                )}
                fill="hsl(28, 100%, 55%)"
              />
              
              {/* Red center zone with glow on reveal */}
              <path
                d={describePieSlice(
                  Math.max(0, targetCenter - redWidth/2), 
                  Math.min(180, targetCenter + redWidth/2), 
                  radius - 6
                )}
                fill="hsl(0, 85%, 55%)"
                filter={showReveal ? "url(#strongGlow)" : undefined}
              />
            </g>
          )}

          {/* Tick marks with gradient opacity */}
          {[...Array(37)].map((_, i) => {
            const angle = i * 5;
            const rad = angle * Math.PI / 180;
            const isMajor = i % 4 === 0;
            const inner = radius - (isMajor ? 10 : 5);
            const outer = radius;
            return (
              <line
                key={i}
                x1={200 + inner * Math.cos(rad)}
                y1={200 - inner * Math.sin(rad)}
                x2={200 + outer * Math.cos(rad)}
                y2={200 - outer * Math.sin(rad)}
                stroke="hsl(215, 50%, 70%)"
                strokeWidth={isMajor ? 2 : 1}
                opacity={isMajor ? 0.25 : 0.12}
              />
            );
          })}

          {/* Needle with enhanced design */}
          {(isDraggable || needleAngle !== undefined) && (
            <g className={cn(
              !isDragging && "transition-all ease-out",
              showReveal ? "duration-700" : "duration-300"
            )}>
              {/* Needle shadow */}
              <line
                x1="200"
                y1="202"
                x2={200 + needleLength * Math.cos(needleRad)}
                y2={202 - needleLength * Math.sin(needleRad)}
                stroke="hsl(0, 0%, 0%)"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.3"
              />
              
              {/* Needle main line */}
              <line
                x1="200"
                y1="200"
                x2={200 + needleLength * Math.cos(needleRad)}
                y2={200 - needleLength * Math.sin(needleRad)}
                stroke="hsl(0, 0%, 100%)"
                strokeWidth="4"
                strokeLinecap="round"
                filter={isDragging ? "url(#glow)" : undefined}
              />
              
              {/* Needle base */}
              <circle
                cx="200"
                cy="200"
                r="14"
                fill="hsl(240 8% 8%)"
                stroke="hsl(0, 0%, 100%)"
                strokeWidth="3"
              />
              <circle
                cx="200"
                cy="200"
                r="6"
                fill="hsl(215, 80%, 60%)"
              />
              
              {/* Needle tip - static, no animation */}
              <circle
                cx={200 + needleLength * Math.cos(needleRad)}
                cy={200 - needleLength * Math.sin(needleRad)}
                r="11"
                fill="hsl(0, 0%, 100%)"
                className={cn(
                  isDraggable && "cursor-grab active:cursor-grabbing"
                )}
              />
              <circle
                cx={200 + needleLength * Math.cos(needleRad)}
                cy={200 - needleLength * Math.sin(needleRad)}
                r="5"
                fill="hsl(215, 80%, 60%)"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Labels with enhanced styling */}
      <div className="flex justify-between mt-5 px-1">
        <span className="text-sm font-bold text-muted-foreground max-w-[140px] text-left leading-tight tracking-tight">
          {leftLabel}
        </span>
        <span className="text-sm font-bold text-muted-foreground max-w-[140px] text-right leading-tight tracking-tight">
          {rightLabel}
        </span>
      </div>

      {isDraggable && (
        <p className="text-xs text-muted-foreground/70 mt-3 text-center tracking-wide">
          Drag or tap anywhere
        </p>
      )}
    </div>
  );
};
