import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SpectrumProps {
  leftLabel: string;
  rightLabel: string;
  targetCenter?: number;
  targetWidth?: number;
  showTarget?: boolean;
  guessValue?: number;
  onGuessChange?: (value: number) => void;
  isDraggable?: boolean;
  showReveal?: boolean;
  className?: string;
}

export const Spectrum: React.FC<SpectrumProps> = ({
  leftLabel,
  rightLabel,
  targetCenter,
  targetWidth,
  showTarget = false,
  guessValue,
  onGuessChange,
  isDraggable = false,
  showReveal = false,
  className,
}) => {
  const [localGuess, setLocalGuess] = useState(guessValue ?? 50);
  const [isDragging, setIsDragging] = useState(false);
  const spectrumRef = useRef<HTMLDivElement>(null);

  const handlePositionUpdate = useCallback((clientX: number) => {
    if (!spectrumRef.current || !isDraggable) return;
    
    const rect = spectrumRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    setLocalGuess(percentage);
    onGuessChange?.(percentage);
  }, [isDraggable, onGuessChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isDraggable) return;
    setIsDragging(true);
    handlePositionUpdate(e.clientX);
  }, [isDraggable, handlePositionUpdate]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isDraggable) return;
    setIsDragging(true);
    handlePositionUpdate(e.touches[0].clientX);
  }, [isDraggable, handlePositionUpdate]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handlePositionUpdate(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handlePositionUpdate(e.touches[0].clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handlePositionUpdate]);

  useEffect(() => {
    if (guessValue !== undefined && !isDragging) {
      setLocalGuess(guessValue);
    }
  }, [guessValue, isDragging]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isDraggable) return;
    
    let newValue = localGuess;
    switch (e.key) {
      case "ArrowLeft":
        newValue = Math.max(0, localGuess - 1);
        break;
      case "ArrowRight":
        newValue = Math.min(100, localGuess + 1);
        break;
      case "Home":
        newValue = 0;
        break;
      case "End":
        newValue = 100;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    setLocalGuess(newValue);
    onGuessChange?.(newValue);
  }, [isDraggable, localGuess, onGuessChange]);

  const targetStart = targetCenter && targetWidth 
    ? targetCenter - targetWidth / 2 
    : 0;
  const targetEnd = targetCenter && targetWidth 
    ? targetCenter + targetWidth / 2 
    : 0;

  return (
    <div className={cn("w-full", className)}>
      {/* Labels */}
      <div className="flex justify-between mb-4 px-2">
        <span className="text-lg md:text-xl font-display text-spectrum-left font-bold uppercase tracking-wider">
          {leftLabel}
        </span>
        <span className="text-lg md:text-xl font-display text-spectrum-right font-bold uppercase tracking-wider">
          {rightLabel}
        </span>
      </div>

      {/* Spectrum Container */}
      <div 
        ref={spectrumRef}
        className={cn(
          "relative h-20 md:h-24 rounded-2xl overflow-hidden cursor-pointer select-none",
          "bg-gradient-to-r from-spectrum-left via-warning to-spectrum-right",
          "shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]",
          isDraggable && "cursor-grab active:cursor-grabbing",
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role={isDraggable ? "slider" : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isDraggable ? Math.round(localGuess) : undefined}
        aria-label={`Spectrum from ${leftLabel} to ${rightLabel}`}
        tabIndex={isDraggable ? 0 : undefined}
        onKeyDown={handleKeyDown}
      >
        {/* Tick marks */}
        <div className="absolute inset-0 flex justify-between px-4 items-end pb-2">
          {[...Array(11)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-0.5 bg-foreground/30",
                i === 5 ? "h-4" : "h-2"
              )}
            />
          ))}
        </div>

        {/* Target zone - only visible to psychic or on reveal */}
        {(showTarget || showReveal) && targetCenter !== undefined && targetWidth !== undefined && (
          <div
            className={cn(
              "absolute top-0 bottom-0 transition-all duration-500",
              showReveal ? "animate-reveal" : "",
              "bg-target/40 border-x-4 border-target",
              "shadow-[0_0_20px_hsl(var(--target-zone)/0.6)]"
            )}
            style={{
              left: `${targetStart}%`,
              width: `${targetWidth}%`,
            }}
          >
            {/* Center marker */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-target left-1/2 -translate-x-1/2"
              style={{
                boxShadow: "0 0 10px hsl(var(--target-zone))",
              }}
            />
          </div>
        )}

        {/* Hidden target overlay for non-psychic */}
        {!showTarget && !showReveal && targetCenter !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-panel px-6 py-3 text-center">
              <span className="text-muted-foreground font-display text-sm uppercase tracking-wider">
                Target Hidden
              </span>
            </div>
          </div>
        )}

        {/* Guess indicator */}
        {(isDraggable || guessValue !== undefined) && (
          <div
            className={cn(
              "absolute top-0 bottom-0 w-1 bg-foreground transition-all",
              isDragging ? "duration-0" : "duration-150",
              "shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            )}
            style={{ left: `${localGuess}%` }}
          >
            {/* Indicator handle */}
            <div 
              className={cn(
                "absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8",
                "bg-foreground rounded-full border-4 border-card",
                "shadow-[0_0_20px_rgba(255,255,255,0.5)]",
                "flex items-center justify-center",
                isDraggable && "cursor-grab active:cursor-grabbing"
              )}
            >
              <svg 
                className="w-4 h-4 text-card" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2L8 6h8L12 2zm0 20l4-4H8l4 4z"/>
              </svg>
            </div>
            
            {/* Value label */}
            <div 
              className={cn(
                "absolute -bottom-10 left-1/2 -translate-x-1/2",
                "bg-card px-3 py-1 rounded-lg border border-border",
                "font-display text-sm tabular-nums"
              )}
            >
              {Math.round(localGuess)}
            </div>
          </div>
        )}
      </div>

      {/* Keyboard hint for accessibility */}
      {isDraggable && (
        <p className="text-xs text-muted-foreground mt-6 text-center">
          Use arrow keys or drag to adjust position
        </p>
      )}
    </div>
  );
};
