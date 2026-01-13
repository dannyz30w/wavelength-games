import React, { useState } from "react";
import { useTheme, themes, ThemeName } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Palette, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSoundEffects } from "@/hooks/useSoundEffects";

// Theme icon component (CSS-based)
const ThemeIcon: React.FC<{ themeId: ThemeName; className?: string }> = ({ themeId, className }) => {
  const iconStyles: Record<ThemeName, React.ReactNode> = {
    space: (
      <svg viewBox="0 0 24 24" className={cn("w-5 h-5", className)} fill="currentColor">
        <circle cx="12" cy="12" r="2" />
        <circle cx="6" cy="8" r="1.5" opacity="0.6" />
        <circle cx="18" cy="6" r="1" opacity="0.4" />
        <circle cx="16" cy="16" r="1.5" opacity="0.7" />
        <circle cx="8" cy="18" r="1" opacity="0.5" />
      </svg>
    ),
    ocean: (
      <svg viewBox="0 0 24 24" className={cn("w-5 h-5", className)} fill="currentColor">
        <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
      </svg>
    ),
    desert: (
      <svg viewBox="0 0 24 24" className={cn("w-5 h-5", className)} fill="currentColor">
        <circle cx="18" cy="6" r="3" opacity="0.8" />
        <path d="M2 20 Q6 12 10 20 Q14 12 18 20 Q20 14 22 20" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    forest: (
      <svg viewBox="0 0 24 24" className={cn("w-5 h-5", className)} fill="currentColor">
        <path d="M12 2 L8 10 L10 10 L6 18 L18 18 L14 10 L16 10 Z" />
        <rect x="11" y="18" width="2" height="4" />
      </svg>
    ),
    neon: (
      <svg viewBox="0 0 24 24" className={cn("w-5 h-5", className)} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    sunset: (
      <svg viewBox="0 0 24 24" className={cn("w-5 h-5", className)} fill="currentColor">
        <circle cx="12" cy="14" r="5" />
        <path d="M2 18 h20" stroke="currentColor" strokeWidth="2" />
        <path d="M12 3 v2 M5 7 l1.5 1.5 M19 7 l-1.5 1.5" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    arctic: (
      <svg viewBox="0 0 24 24" className={cn("w-5 h-5", className)} fill="currentColor">
        <path d="M12 2 v20 M2 12 h20 M5 5 l14 14 M19 5 l-14 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    volcano: (
      <svg viewBox="0 0 24 24" className={cn("w-5 h-5", className)} fill="currentColor">
        <path d="M4 20 L8 10 L10 12 L12 6 L14 12 L16 10 L20 20 Z" />
        <ellipse cx="12" cy="4" rx="3" ry="2" opacity="0.6" />
      </svg>
    ),
    candy: (
      <svg viewBox="0 0 24 24" className={cn("w-5 h-5", className)} fill="currentColor">
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12 Q2 12 2 10 Q2 8 4 8" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M20 12 Q22 12 22 10 Q22 8 20 8" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    aurora: (
      <svg viewBox="0 0 24 24" className={cn("w-5 h-5", className)} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 18 Q7 8 12 12 Q17 16 22 6" />
        <path d="M2 14 Q7 4 12 8 Q17 12 22 2" opacity="0.5" />
      </svg>
    ),
  };

  return iconStyles[themeId] || null;
};

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const { playSound } = useSoundEffects();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (themeId: ThemeName) => {
    playSound("sparkle");
    setTheme(themeId);
  };

  const toggleOpen = () => {
    playSound("pop");
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleOpen}
        className={cn(
          "game-button-ghost flex items-center gap-2 px-3 py-2 transition-all duration-300",
          isOpen && "bg-primary/20"
        )}
      >
        <Palette className="w-4 h-4" />
        <ThemeIcon themeId={currentTheme.id} className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Theme Panel */}
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:translate-y-0 z-50 animate-slide-up">
            <div className="game-card p-4 md:p-5 md:w-80 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Choose Theme</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl transition-all duration-300",
                      "hover:scale-105 active:scale-95",
                      currentTheme.id === theme.id
                        ? "bg-primary/30 ring-2 ring-primary"
                        : "bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <ThemeIcon themeId={theme.id} className="w-5 h-5" />
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-semibold text-xs truncate">{theme.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{theme.description}</p>
                    </div>
                    {currentTheme.id === theme.id && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
