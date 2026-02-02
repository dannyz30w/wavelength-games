import React, { useMemo } from "react";
import { useTheme, ThemeName } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeBackgroundProps {
  className?: string;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ className }) => {
  const { currentTheme } = useTheme();

  const elements = useMemo(() => {
    return generateThemeElements(currentTheme.id);
  }, [currentTheme.id]);

  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden z-0", className)}>
      {/* Base gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, hsl(${currentTheme.colors.primary} / 0.2) 0%, transparent 60%),
                       radial-gradient(ellipse at 0% 100%, hsl(${currentTheme.colors.secondary} / 0.15) 0%, transparent 50%),
                       radial-gradient(ellipse at 100% 100%, hsl(${currentTheme.colors.accent} / 0.1) 0%, transparent 50%)`
        }}
      />
      
      {/* Animated elements */}
      {elements}
    </div>
  );
};

const generateThemeElements = (themeId: ThemeName) => {
  switch (themeId) {
    case "space":
      return <SpaceElements />;
    case "desert":
      return <DesertElements />;
    case "forest":
      return <ForestElements />;
    case "neon":
      return <NeonElements />;
    case "arctic":
      return <ArcticElements />;
    case "volcano":
      return <VolcanoElements />;
    case "candy":
      return <CandyElements />;
    case "aurora":
      return <AuroraElements />;
    default:
      return null;
  }
};

// Space Theme - Stars with parallax effect (moving straight, not diagonal)
const SpaceElements = () => (
  <>
    {/* Distant stars layer (slow) */}
    {[...Array(60)].map((_, i) => (
      <div
        key={`star-far-${i}`}
        className="absolute rounded-full bg-white animate-star-drift-slow"
        style={{
          width: `${1 + Math.random() * 1.5}px`,
          height: `${1 + Math.random() * 1.5}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          opacity: 0.3 + Math.random() * 0.4,
        }}
      />
    ))}
    {/* Mid stars layer */}
    {[...Array(30)].map((_, i) => (
      <div
        key={`star-mid-${i}`}
        className="absolute rounded-full bg-white animate-star-drift-mid"
        style={{
          width: `${2 + Math.random() * 1}px`,
          height: `${2 + Math.random() * 1}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 15}s`,
          opacity: 0.5 + Math.random() * 0.5,
        }}
      />
    ))}
    {/* Twinkling stars */}
    {[...Array(20)].map((_, i) => (
      <div
        key={`star-twinkle-${i}`}
        className="absolute rounded-full bg-white animate-twinkle"
        style={{
          width: `${2 + Math.random() * 2}px`,
          height: `${2 + Math.random() * 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        }}
      />
    ))}
    {/* Nebula glows */}
    <div className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-3xl top-10 -left-20 animate-drift" />
    <div className="absolute w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl bottom-20 -right-10 animate-drift-reverse" />
    {/* Distant planet */}
    <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-orange-400/20 to-red-500/20 top-20 right-20 animate-float" />
  </>
);


// Desert Theme - Sand dunes and cacti (CSS only)
const DesertElements = () => (
  <>
    {/* Sand dunes gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-48">
      <svg viewBox="0 0 1440 200" className="absolute bottom-0 w-full opacity-20">
        <path fill="hsl(35, 50%, 30%)" d="M0,160 C280,100 400,180 720,120 C1040,60 1160,160 1440,100 L1440,200 L0,200 Z" />
        <path fill="hsl(35, 45%, 25%)" d="M0,180 C360,130 480,200 800,140 C1120,80 1200,180 1440,120 L1440,200 L0,200 Z" />
      </svg>
    </div>
    {/* SVG Cacti */}
    {[...Array(4)].map((_, i) => (
      <div
        key={`cactus-${i}`}
        className="absolute bottom-16"
        style={{ left: `${15 + i * 22}%`, opacity: 0.4 + i * 0.1 }}
      >
        <svg width="30" height="60" viewBox="0 0 30 60" className="opacity-60">
          <rect x="12" y="10" width="6" height="50" rx="3" fill="hsl(140, 40%, 35%)" />
          <rect x="0" y="25" width="12" height="5" rx="2" fill="hsl(140, 40%, 35%)" />
          <rect x="0" y="15" width="5" height="15" rx="2" fill="hsl(140, 40%, 35%)" />
          <rect x="18" y="20" width="12" height="5" rx="2" fill="hsl(140, 40%, 35%)" />
          <rect x="25" y="8" width="5" height="17" rx="2" fill="hsl(140, 40%, 35%)" />
        </svg>
      </div>
    ))}
    {/* Sun */}
    <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-400/20 blur-xl animate-pulse-soft" />
    {/* Heat shimmer effect */}
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-orange-500/5 to-transparent animate-shimmer-heat" />
  </>
);

// Forest Theme - Trees, fireflies, leaves (CSS/SVG)
const ForestElements = () => (
  <>
    {/* Tree silhouettes */}
    <div className="absolute bottom-0 left-0 right-0 h-72 opacity-20">
      <svg viewBox="0 0 1440 300" className="absolute bottom-0 w-full">
        <path fill="hsl(140, 40%, 15%)" d="M0,250 L80,180 L120,250 L200,150 L240,250 L320,120 L360,250 L440,160 L480,250 L560,140 L600,250 L680,170 L720,250 L800,130 L840,250 L920,150 L960,250 L1040,140 L1080,250 L1160,160 L1200,250 L1280,130 L1320,250 L1400,150 L1440,250 L1440,300 L0,300 Z" />
      </svg>
    </div>
    {/* Fireflies */}
    {[...Array(20)].map((_, i) => (
      <div
        key={`firefly-${i}`}
        className="absolute w-2 h-2 rounded-full bg-yellow-300 animate-firefly"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${30 + Math.random() * 50}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
          boxShadow: "0 0 10px 4px rgba(250, 204, 21, 0.6)",
        }}
      />
    ))}
    {/* Falling leaves (SVG) */}
    {[...Array(12)].map((_, i) => (
      <div
        key={`leaf-${i}`}
        className="absolute animate-fall-leaf"
        style={{
          left: `${Math.random() * 100}%`,
          top: "-30px",
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${10 + Math.random() * 10}s`,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" style={{ opacity: 0.6 }}>
          <path d="M10 0 Q15 5 15 10 Q15 18 10 20 Q5 18 5 10 Q5 5 10 0" 
                fill={i % 2 === 0 ? "hsl(35, 70%, 45%)" : "hsl(100, 50%, 40%)"} />
        </svg>
      </div>
    ))}
    {/* Mist */}
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-green-900/20 via-green-800/10 to-transparent" />
  </>
);

// Neon Theme - Glowing lines, pulses (no purple gradients)
const NeonElements = () => (
  <>
    {/* Neon grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(to right, rgba(236, 72, 153, 0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
    }} />
    {/* Glowing orbs */}
    {[...Array(6)].map((_, i) => (
      <div
        key={`orb-${i}`}
        className="absolute rounded-full animate-neon-pulse"
        style={{
          width: `${60 + Math.random() * 80}px`,
          height: `${60 + Math.random() * 80}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `radial-gradient(circle, ${["rgba(236,72,153,0.3)", "rgba(6,182,212,0.3)", "rgba(250,204,21,0.3)"][i % 3]} 0%, transparent 70%)`,
          animationDelay: `${i * 0.5}s`,
        }}
      />
    ))}
    {/* Scan lines */}
    <div className="absolute inset-0 opacity-10" style={{
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
    }} />
  </>
);


// Arctic Theme - Snowflakes (CSS shapes, no gem emoji)
const ArcticElements = () => (
  <>
    {/* Ice gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-blue-300/10 via-transparent to-blue-400/10" />
    {/* Snowflakes (CSS) */}
    {[...Array(40)].map((_, i) => (
      <div
        key={`snow-${i}`}
        className="absolute animate-snowfall"
        style={{
          left: `${Math.random() * 100}%`,
          top: "-20px",
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${8 + Math.random() * 8}s`,
        }}
      >
        <div 
          className="snowflake-css"
          style={{
            width: `${8 + Math.random() * 12}px`,
            height: `${8 + Math.random() * 12}px`,
            opacity: 0.4 + Math.random() * 0.4,
          }}
        />
      </div>
    ))}
    {/* Ice crystals (CSS shapes instead of emoji) */}
    {[...Array(5)].map((_, i) => (
      <div
        key={`crystal-${i}`}
        className="absolute animate-sparkle-slow"
        style={{
          left: `${10 + i * 20}%`,
          bottom: `${10 + Math.random() * 20}%`,
          animationDelay: `${i * 0.5}s`,
        }}
      >
        <div className="ice-crystal" style={{ width: 24, height: 24, opacity: 0.3 }} />
      </div>
    ))}
    {/* Frost overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent" />
  </>
);

// Volcano Theme - Lava, embers, smoke (CSS only)
const VolcanoElements = () => (
  <>
    {/* Lava glow at bottom */}
    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-orange-600/30 via-red-600/20 to-transparent animate-lava-glow" />
    {/* Rising embers */}
    {[...Array(30)].map((_, i) => (
      <div
        key={`ember-${i}`}
        className="absolute w-2 h-2 rounded-full animate-ember-rise"
        style={{
          background: `radial-gradient(circle, ${Math.random() > 0.5 ? "#f97316" : "#ef4444"}, transparent)`,
          left: `${Math.random() * 100}%`,
          bottom: "-10px",
          animationDelay: `${Math.random() * 6}s`,
          animationDuration: `${4 + Math.random() * 4}s`,
          boxShadow: `0 0 ${4 + Math.random() * 6}px #f97316`,
        }}
      />
    ))}
    {/* Smoke clouds */}
    {[...Array(4)].map((_, i) => (
      <div
        key={`smoke-${i}`}
        className="absolute w-32 h-32 rounded-full bg-gray-600/10 blur-2xl animate-smoke-rise"
        style={{
          left: `${20 + i * 20}%`,
          bottom: "20%",
          animationDelay: `${i * 2}s`,
        }}
      />
    ))}
  </>
);

// Candy Theme - Sprinkles only (no emojis)
const CandyElements = () => (
  <>
    {/* Sprinkles */}
    {[...Array(50)].map((_, i) => (
      <div
        key={`sprinkle-${i}`}
        className="absolute w-1 h-3 rounded-full animate-sprinkle-fall"
        style={{
          background: ["#ec4899", "#06b6d4", "#facc15", "#a855f7", "#22c55e"][i % 5],
          left: `${Math.random() * 100}%`,
          top: "-20px",
          transform: `rotate(${Math.random() * 360}deg)`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${6 + Math.random() * 6}s`,
        }}
      />
    ))}
    {/* Swirl patterns */}
    <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-8 border-pink-400/20 border-t-transparent animate-spin-slow" />
    <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full border-8 border-cyan-400/20 border-b-transparent animate-spin-reverse-slow" />
  </>
);

// Aurora Theme - Flowing northern lights
const AuroraElements = () => (
  <>
    {/* Aurora waves */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div
          key={`aurora-${i}`}
          className="absolute w-full h-40 animate-aurora-wave"
          style={{
            top: `${10 + i * 15}%`,
            background: `linear-gradient(90deg, 
              transparent 0%, 
              ${["rgba(34,197,94,0.2)", "rgba(6,182,212,0.2)", "rgba(34,197,94,0.2)"][i % 3]} 20%,
              ${["rgba(6,182,212,0.15)", "rgba(34,197,94,0.15)", "rgba(6,182,212,0.15)"][i % 3]} 50%,
              ${["rgba(34,197,94,0.2)", "rgba(6,182,212,0.2)", "rgba(34,197,94,0.2)"][i % 3]} 80%,
              transparent 100%
            )`,
            animationDelay: `${i * 1}s`,
            filter: "blur(30px)",
          }}
        />
      ))}
    </div>
    {/* Stars behind aurora */}
    {[...Array(40)].map((_, i) => (
      <div
        key={`astar-${i}`}
        className="absolute w-1 h-1 rounded-full bg-white animate-twinkle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 60}%`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: 0.3 + Math.random() * 0.4,
        }}
      />
    ))}
  </>
);
