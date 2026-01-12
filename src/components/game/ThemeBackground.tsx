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
    case "ocean":
      return <OceanElements />;
    case "desert":
      return <DesertElements />;
    case "forest":
      return <ForestElements />;
    case "neon":
      return <NeonElements />;
    case "sunset":
      return <SunsetElements />;
    case "arctic":
      return <ArcticElements />;
    case "volcano":
      return <VolcanoElements />;
    case "candy":
      return <CandyElements />;
    case "cyberpunk":
      return <CyberpunkElements />;
    case "jungle":
      return <JungleElements />;
    case "aurora":
      return <AuroraElements />;
    case "retro":
      return <RetroElements />;
    default:
      return null;
  }
};

// Space Theme - Stars, shooting stars, planets
const SpaceElements = () => (
  <>
    {/* Twinkling stars */}
    {[...Array(80)].map((_, i) => (
      <div
        key={`star-${i}`}
        className="absolute rounded-full bg-white animate-twinkle"
        style={{
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
          opacity: 0.3 + Math.random() * 0.7,
        }}
      />
    ))}
    {/* Shooting stars */}
    {[...Array(3)].map((_, i) => (
      <div
        key={`shooting-${i}`}
        className="absolute animate-shooting-star"
        style={{
          left: `${20 + i * 30}%`,
          top: `${10 + i * 15}%`,
          animationDelay: `${i * 4}s`,
        }}
      >
        <div className="w-1 h-20 bg-gradient-to-b from-white via-blue-200 to-transparent rotate-45 opacity-70" />
      </div>
    ))}
    {/* Nebula glows */}
    <div className="absolute w-96 h-96 rounded-full bg-purple-500/10 blur-3xl top-10 -left-20 animate-drift" />
    <div className="absolute w-80 h-80 rounded-full bg-blue-500/10 blur-3xl bottom-20 -right-10 animate-drift-reverse" />
    {/* Distant planet */}
    <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-orange-400/20 to-red-500/20 top-20 right-20 animate-float" />
  </>
);

// Ocean Theme - Bubbles, fish, seaweed
const OceanElements = () => (
  <>
    {/* Bubbles */}
    {[...Array(25)].map((_, i) => (
      <div
        key={`bubble-${i}`}
        className="absolute rounded-full border border-cyan-300/30 bg-cyan-200/10 animate-bubble-rise"
        style={{
          width: `${8 + Math.random() * 20}px`,
          height: `${8 + Math.random() * 20}px`,
          left: `${Math.random() * 100}%`,
          bottom: `-${20 + Math.random() * 30}px`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${6 + Math.random() * 6}s`,
        }}
      />
    ))}
    {/* Fish */}
    {[...Array(6)].map((_, i) => (
      <div
        key={`fish-${i}`}
        className="absolute text-2xl animate-swim"
        style={{
          left: i % 2 === 0 ? "-50px" : "100%",
          top: `${15 + i * 15}%`,
          animationDelay: `${i * 2}s`,
          animationDuration: `${15 + Math.random() * 10}s`,
          transform: i % 2 === 0 ? "scaleX(1)" : "scaleX(-1)",
        }}
      >
        {["🐠", "🐟", "🐡", "🦈", "🐬", "🐙"][i]}
      </div>
    ))}
    {/* Seaweed */}
    {[...Array(8)].map((_, i) => (
      <div
        key={`seaweed-${i}`}
        className="absolute bottom-0 text-4xl animate-sway origin-bottom"
        style={{
          left: `${5 + i * 12}%`,
          animationDelay: `${i * 0.3}s`,
        }}
      >
        🌿
      </div>
    ))}
    {/* Light rays */}
    <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-transparent to-blue-900/20" />
  </>
);

// Desert Theme - Sand, cacti, tumbleweeds
const DesertElements = () => (
  <>
    {/* Sand dunes gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-48">
      <svg viewBox="0 0 1440 200" className="absolute bottom-0 w-full opacity-20">
        <path fill="hsl(35, 50%, 30%)" d="M0,160 C280,100 400,180 720,120 C1040,60 1160,160 1440,100 L1440,200 L0,200 Z" />
        <path fill="hsl(35, 45%, 25%)" d="M0,180 C360,130 480,200 800,140 C1120,80 1200,180 1440,120 L1440,200 L0,200 Z" />
      </svg>
    </div>
    {/* Cacti */}
    {[...Array(5)].map((_, i) => (
      <div
        key={`cactus-${i}`}
        className="absolute bottom-16 text-4xl"
        style={{ left: `${10 + i * 20}%`, opacity: 0.4 + i * 0.1 }}
      >
        🌵
      </div>
    ))}
    {/* Sun */}
    <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-400/20 blur-xl animate-pulse-soft" />
    {/* Tumbleweeds */}
    {[...Array(3)].map((_, i) => (
      <div
        key={`tumbleweed-${i}`}
        className="absolute text-3xl animate-tumble"
        style={{
          bottom: `${10 + i * 5}%`,
          animationDelay: `${i * 5}s`,
          animationDuration: `${12 + Math.random() * 8}s`,
        }}
      >
        🌾
      </div>
    ))}
    {/* Heat shimmer effect */}
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-orange-500/5 to-transparent animate-shimmer-heat" />
  </>
);

// Forest Theme - Trees, fireflies, leaves
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
    {/* Falling leaves */}
    {[...Array(15)].map((_, i) => (
      <div
        key={`leaf-${i}`}
        className="absolute text-xl animate-fall-leaf"
        style={{
          left: `${Math.random() * 100}%`,
          top: "-30px",
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${10 + Math.random() * 10}s`,
        }}
      >
        {["🍂", "🍃", "🌿"][i % 3]}
      </div>
    ))}
    {/* Mist */}
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-green-900/20 via-green-800/10 to-transparent" />
  </>
);

// Neon Theme - Glowing lines, pulses
const NeonElements = () => (
  <>
    {/* Neon grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
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

// Sunset Theme - Gradient sky, clouds, birds
const SunsetElements = () => (
  <>
    {/* Sky gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-pink-500/10 to-purple-600/10" />
    {/* Sun */}
    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-gradient-to-b from-yellow-300/30 to-orange-500/20 blur-2xl" />
    {/* Clouds */}
    {[...Array(5)].map((_, i) => (
      <div
        key={`cloud-${i}`}
        className="absolute animate-cloud-drift"
        style={{
          top: `${10 + i * 8}%`,
          animationDuration: `${40 + i * 10}s`,
          animationDelay: `${i * 5}s`,
        }}
      >
        <div className="flex gap-1 opacity-30">
          <div className="w-16 h-8 rounded-full bg-orange-200/50" />
          <div className="w-20 h-10 rounded-full bg-orange-200/50 -mt-2" />
          <div className="w-14 h-7 rounded-full bg-orange-200/50" />
        </div>
      </div>
    ))}
    {/* Flying birds */}
    {[...Array(4)].map((_, i) => (
      <div
        key={`bird-${i}`}
        className="absolute text-sm animate-bird-fly opacity-40"
        style={{
          top: `${20 + i * 10}%`,
          animationDelay: `${i * 3}s`,
        }}
      >
        ∿∿
      </div>
    ))}
  </>
);

// Arctic Theme - Snowflakes, aurora hints
const ArcticElements = () => (
  <>
    {/* Ice gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-blue-300/10 via-transparent to-blue-400/10" />
    {/* Snowflakes */}
    {[...Array(40)].map((_, i) => (
      <div
        key={`snow-${i}`}
        className="absolute animate-snowfall"
        style={{
          left: `${Math.random() * 100}%`,
          top: "-20px",
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${8 + Math.random() * 8}s`,
          fontSize: `${10 + Math.random() * 14}px`,
          opacity: 0.4 + Math.random() * 0.4,
        }}
      >
        ❄
      </div>
    ))}
    {/* Ice crystals */}
    {[...Array(5)].map((_, i) => (
      <div
        key={`crystal-${i}`}
        className="absolute text-4xl opacity-20 animate-sparkle-slow"
        style={{
          left: `${10 + i * 20}%`,
          bottom: `${10 + Math.random() * 20}%`,
          animationDelay: `${i * 0.5}s`,
        }}
      >
        💎
      </div>
    ))}
    {/* Frost overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent" />
  </>
);

// Volcano Theme - Lava, embers, smoke
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

// Candy Theme - Sprinkles, lollipops, swirls
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
    {/* Floating candy */}
    {[...Array(8)].map((_, i) => (
      <div
        key={`candy-${i}`}
        className="absolute text-3xl animate-candy-float"
        style={{
          left: `${10 + i * 12}%`,
          top: `${20 + Math.random() * 50}%`,
          animationDelay: `${i * 0.5}s`,
        }}
      >
        {["🍬", "🍭", "🍩", "🧁", "🍪", "🎂", "🍫", "🍡"][i]}
      </div>
    ))}
    {/* Swirl patterns */}
    <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-8 border-pink-400/20 border-t-transparent animate-spin-slow" />
    <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full border-8 border-cyan-400/20 border-b-transparent animate-spin-reverse-slow" />
  </>
);

// Cyberpunk Theme - Circuit lines, glitch effects
const CyberpunkElements = () => (
  <>
    {/* Circuit grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
    }} />
    {/* Glitch bars */}
    {[...Array(5)].map((_, i) => (
      <div
        key={`glitch-${i}`}
        className="absolute h-1 animate-glitch-bar"
        style={{
          width: `${50 + Math.random() * 100}px`,
          background: Math.random() > 0.5 ? "rgba(0, 255, 255, 0.5)" : "rgba(236, 72, 153, 0.5)",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
    {/* Holographic elements */}
    <div className="absolute top-1/4 left-1/4 w-20 h-20 border border-cyan-400/30 animate-hologram" />
    <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border border-pink-400/30 animate-hologram" style={{ animationDelay: "0.5s" }} />
    {/* Data streams */}
    <div className="absolute right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-data-stream" />
    <div className="absolute left-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-pink-400/30 to-transparent animate-data-stream" style={{ animationDelay: "2s" }} />
  </>
);

// Jungle Theme - Vines, animals, rain
const JungleElements = () => (
  <>
    {/* Vines on sides */}
    <div className="absolute left-0 top-0 h-full w-20 opacity-30">
      {[...Array(5)].map((_, i) => (
        <div key={`vine-l-${i}`} className="absolute text-4xl animate-sway" style={{ top: `${i * 20}%`, left: "10px", animationDelay: `${i * 0.2}s` }}>
          🌿
        </div>
      ))}
    </div>
    <div className="absolute right-0 top-0 h-full w-20 opacity-30">
      {[...Array(5)].map((_, i) => (
        <div key={`vine-r-${i}`} className="absolute text-4xl animate-sway" style={{ top: `${i * 20}%`, right: "10px", animationDelay: `${i * 0.3}s` }}>
          🌿
        </div>
      ))}
    </div>
    {/* Jungle animals */}
    {["🦜", "🐒", "🦋", "🦎"].map((animal, i) => (
      <div
        key={`animal-${i}`}
        className="absolute text-3xl animate-peek"
        style={{
          left: `${15 + i * 25}%`,
          top: `${20 + (i % 2) * 40}%`,
          animationDelay: `${i * 2}s`,
        }}
      >
        {animal}
      </div>
    ))}
    {/* Rain drops */}
    {[...Array(30)].map((_, i) => (
      <div
        key={`rain-${i}`}
        className="absolute w-0.5 h-4 bg-gradient-to-b from-green-300/40 to-transparent animate-rain"
        style={{
          left: `${Math.random() * 100}%`,
          top: "-20px",
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${0.5 + Math.random() * 0.5}s`,
        }}
      />
    ))}
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
              ${["rgba(34,197,94,0.2)", "rgba(168,85,247,0.2)", "rgba(6,182,212,0.2)"][i % 3]} 20%,
              ${["rgba(168,85,247,0.15)", "rgba(6,182,212,0.15)", "rgba(34,197,94,0.15)"][i % 3]} 50%,
              ${["rgba(6,182,212,0.2)", "rgba(34,197,94,0.2)", "rgba(168,85,247,0.2)"][i % 3]} 80%,
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

// Retro Theme - Pixelated, 8-bit aesthetic
const RetroElements = () => (
  <>
    {/* Scanlines */}
    <div className="absolute inset-0 opacity-10" style={{
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
    }} />
    {/* Pixel grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(to right, rgba(168, 85, 247, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(168, 85, 247, 0.05) 1px, transparent 1px)
      `,
      backgroundSize: "8px 8px",
    }} />
    {/* Retro shapes */}
    {[...Array(8)].map((_, i) => (
      <div
        key={`retro-${i}`}
        className="absolute animate-retro-bounce"
        style={{
          left: `${10 + i * 12}%`,
          top: `${20 + Math.random() * 50}%`,
          animationDelay: `${i * 0.3}s`,
        }}
      >
        <div 
          className="w-4 h-4"
          style={{
            background: ["#ec4899", "#06b6d4", "#facc15", "#a855f7"][i % 4],
            clipPath: i % 3 === 0 ? "polygon(50% 0%, 100% 100%, 0% 100%)" : i % 3 === 1 ? "circle(50%)" : "none",
          }}
        />
      </div>
    ))}
    {/* 8-bit characters */}
    {["👾", "🕹️", "🎮", "👻"].map((char, i) => (
      <div
        key={`char-${i}`}
        className="absolute text-2xl opacity-40 animate-pixel-float"
        style={{
          left: `${20 + i * 20}%`,
          top: `${60 + (i % 2) * 20}%`,
          animationDelay: `${i * 0.5}s`,
        }}
      >
        {char}
      </div>
    ))}
  </>
);
