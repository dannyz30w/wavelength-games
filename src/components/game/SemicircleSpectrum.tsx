import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SemicircleSpectrumProps {
  leftLabel: string;
  rightLabel: string;
  targetCenter?: number; // 0-180 degrees
  targetWidth?: number; // degrees width
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
  targetWidth,
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

  // Convert mouse position to angle
  const getAngleFromPosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return localAngle;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.bottom;
    
    const dx = clientX - centerX;
    const dy = centerY - clientY;
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Clamp to 0-180 range
    angle = Math.max(0, Math.min(180, angle));
    
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

  // Calculate target arc positions (for SVG)
  const targetStartAngle = targetCenter !== undefined && targetWidth !== undefined
    ? targetCenter - targetWidth / 2
    : 0;
  const targetEndAngle = targetCenter !== undefined && targetWidth !== undefined
    ? targetCenter + targetWidth / 2
    : 0;

  // SVG arc helper
  const describeArc = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const startRad = (180 - startAngle) * Math.PI / 180;
    const endRad = (180 - endAngle) * Math.PI / 180;
    
    const x1Outer = 200 + outerRadius * Math.cos(startRad);
    const y1Outer = 200 - outerRadius * Math.sin(startRad);
    const x2Outer = 200 + outerRadius * Math.cos(endRad);
    const y2Outer = 200 - outerRadius * Math.sin(endRad);
    
    const x1Inner = 200 + innerRadius * Math.cos(startRad);
    const y1Inner = 200 - innerRadius * Math.sin(startRad);
    const x2Inner = 200 + innerRadius * Math.cos(endRad);
    const y2Inner = 200 - innerRadius * Math.sin(endRad);
    
    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    
    return [
      "M", x1Outer, y1Outer,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, x2Outer, y2Outer,
      "L", x2Inner, y2Inner,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, x1Inner, y1Inner,
      "Z"
    ].join(" ");
  };

  // Calculate needle position
  const needleRad = (180 - localAngle) * Math.PI / 180;
  const needleLength = 175;

  return (
    <div className={cn("w-full max-w-lg mx-auto", className)}>
      {/* SVG Semicircle */}
      <div 
        ref={containerRef}
        className={cn(
          "relative select-none",
          isDraggable && "cursor-pointer"
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
          {/* Background gradient arc */}
          <defs>
            <linearGradient id="spectrumGradient" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="hsl(var(--spectrum-left))" />
              <stop offset="50%" stopColor="hsl(var(--warning))" />
              <stop offset="100%" stopColor="hsl(var(--spectrum-right))" />
            </linearGradient>
          </defs>
          
          {/* Main semicircle background */}
          <path
            d={describeArc(0, 180, 80, 190)}
            fill="url(#spectrumGradient)"
            className="opacity-30"
          />
          
          {/* Outer border */}
          <path
            d="M 10 200 A 190 190 0 0 1 390 200"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="3"
          />
          
          {/* Inner border */}
          <path
            d="M 120 200 A 80 80 0 0 1 280 200"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />

          {/* Target zone - multi-colored bands (red center, orange sides, yellow outer) */}
          {(showTarget || showReveal) && targetCenter !== undefined && targetWidth !== undefined && (
            <g className={cn(showReveal && "animate-reveal")}>
              {/* Yellow outer band (10 points) */}
              <path
                d={describeArc(targetStartAngle - 15, targetStartAngle, 85, 185)}
                fill="hsl(48, 96%, 53%)"
                opacity="0.8"
              />
              <path
                d={describeArc(targetEndAngle, targetEndAngle + 15, 85, 185)}
                fill="hsl(48, 96%, 53%)"
                opacity="0.8"
              />
              
              {/* Orange band (20 points) */}
              <path
                d={describeArc(targetStartAngle - 5, targetStartAngle, 85, 185)}
                fill="hsl(25, 95%, 53%)"
                opacity="0.9"
              />
              <path
                d={describeArc(targetEndAngle, targetEndAngle + 5, 85, 185)}
                fill="hsl(25, 95%, 53%)"
                opacity="0.9"
              />
              
              {/* Red center band (30 points - bullseye) */}
              <path
                d={describeArc(targetStartAngle, targetEndAngle, 85, 185)}
                fill="hsl(0, 84%, 60%)"
                opacity="0.95"
              />
              
              {/* Center line indicator */}
              <line
                x1={200 + 80 * Math.cos((180 - targetCenter) * Math.PI / 180)}
                y1={200 - 80 * Math.sin((180 - targetCenter) * Math.PI / 180)}
                x2={200 + 190 * Math.cos((180 - targetCenter) * Math.PI / 180)}
                y2={200 - 190 * Math.sin((180 - targetCenter) * Math.PI / 180)}
                stroke="hsl(0, 84%, 40%)"
                strokeWidth="3"
              />
            </g>
          )}

          {/* Tick marks */}
          {[...Array(19)].map((_, i) => {
            const angle = i * 10;
            const rad = (180 - angle) * Math.PI / 180;
            const inner = i % 2 === 0 ? 185 : 182;
            const outer = 195;
            return (
              <line
                key={i}
                x1={200 + inner * Math.cos(rad)}
                y1={200 - inner * Math.sin(rad)}
                x2={200 + outer * Math.cos(rad)}
                y2={200 - outer * Math.sin(rad)}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={i % 2 === 0 ? 2 : 1}
                opacity={0.5}
              />
            );
          })}

          {/* Needle */}
          {(isDraggable || needleAngle !== undefined) && (
            <g>
              {/* Needle line */}
              <line
                x1="200"
                y1="200"
                x2={200 + needleLength * Math.cos(needleRad)}
                y2={200 - needleLength * Math.sin(needleRad)}
                stroke="hsl(var(--destructive))"
                strokeWidth="4"
                strokeLinecap="round"
                className={cn(
                  "transition-all",
                  isDragging ? "duration-0" : "duration-150"
                )}
                style={{
                  filter: "drop-shadow(0 0 8px hsl(var(--destructive) / 0.8))"
                }}
              />
              
              {/* Needle base circle */}
              <circle
                cx="200"
                cy="200"
                r="12"
                fill="hsl(var(--destructive))"
                stroke="hsl(var(--card))"
                strokeWidth="3"
              />
              
              {/* Needle tip */}
              <circle
                cx={200 + needleLength * Math.cos(needleRad)}
                cy={200 - needleLength * Math.sin(needleRad)}
                r="8"
                fill="hsl(var(--destructive))"
                stroke="hsl(var(--card))"
                strokeWidth="2"
                className={cn(
                  "transition-all",
                  isDragging ? "duration-0" : "duration-150",
                  isDraggable && "cursor-grab"
                )}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-4 px-4">
        <span className="text-base md:text-lg font-display text-spectrum-left font-bold uppercase tracking-wider text-center max-w-[120px]">
          {leftLabel}
        </span>
        <div className="flex-1 flex justify-center items-center">
          <div className="h-0.5 w-20 bg-gradient-to-r from-spectrum-left via-muted to-spectrum-right opacity-50" />
        </div>
        <span className="text-base md:text-lg font-display text-spectrum-right font-bold uppercase tracking-wider text-center max-w-[120px]">
          {rightLabel}
        </span>
      </div>

      {/* Keyboard hint for accessibility */}
      {isDraggable && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Drag the needle or use arrow keys to adjust
        </p>
      )}
    </div>
  );
};