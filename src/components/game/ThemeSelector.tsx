import React, { useState } from "react";
import { useTheme, themes, ThemeName } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Palette, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSoundEffects } from "@/hooks/useSoundEffects";

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
        <span className="text-lg">{currentTheme.emoji}</span>
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
                    <span className="text-xl">{theme.emoji}</span>
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
