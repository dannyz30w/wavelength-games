import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeName = 
  | "space" 
  | "ocean" 
  | "desert" 
  | "forest" 
  | "neon" 
  | "sunset"
  | "arctic"
  | "volcano"
  | "candy"
  | "cyberpunk"
  | "jungle"
  | "aurora"
  | "retro";

export interface Theme {
  id: ThemeName;
  name: string;
  emoji: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
  };
}

export const themes: Theme[] = [
  {
    id: "space",
    name: "Deep Space",
    emoji: "🚀",
    description: "Stars and galaxies",
    colors: {
      primary: "210 100% 55%",
      secondary: "265 90% 62%",
      accent: "15 95% 60%",
      background: "235 15% 6%",
      card: "235 12% 9%",
    },
  },
  {
    id: "ocean",
    name: "Ocean Depths",
    emoji: "🐠",
    description: "Underwater adventure",
    colors: {
      primary: "195 100% 50%",
      secondary: "175 70% 45%",
      accent: "50 100% 60%",
      background: "200 80% 8%",
      card: "200 60% 12%",
    },
  },
  {
    id: "desert",
    name: "Desert Oasis",
    emoji: "🏜️",
    description: "Sandy dunes & cacti",
    colors: {
      primary: "35 100% 55%",
      secondary: "25 85% 50%",
      accent: "150 60% 45%",
      background: "30 30% 10%",
      card: "30 25% 14%",
    },
  },
  {
    id: "forest",
    name: "Enchanted Forest",
    emoji: "🌲",
    description: "Mystical woodland",
    colors: {
      primary: "140 70% 45%",
      secondary: "100 60% 40%",
      accent: "45 100% 55%",
      background: "140 30% 8%",
      card: "140 25% 12%",
    },
  },
  {
    id: "neon",
    name: "Neon Nights",
    emoji: "💜",
    description: "Electric vibes",
    colors: {
      primary: "320 100% 60%",
      secondary: "180 100% 50%",
      accent: "60 100% 50%",
      background: "270 50% 5%",
      card: "270 40% 10%",
    },
  },
  {
    id: "sunset",
    name: "Golden Sunset",
    emoji: "🌅",
    description: "Warm twilight",
    colors: {
      primary: "25 100% 55%",
      secondary: "350 85% 55%",
      accent: "50 100% 55%",
      background: "15 40% 8%",
      card: "15 35% 12%",
    },
  },
  {
    id: "arctic",
    name: "Arctic Ice",
    emoji: "❄️",
    description: "Frozen wonderland",
    colors: {
      primary: "200 80% 70%",
      secondary: "220 70% 80%",
      accent: "180 60% 55%",
      background: "210 40% 10%",
      card: "210 35% 15%",
    },
  },
  {
    id: "volcano",
    name: "Volcanic",
    emoji: "🌋",
    description: "Molten fire",
    colors: {
      primary: "15 100% 55%",
      secondary: "35 100% 50%",
      accent: "0 90% 60%",
      background: "0 50% 6%",
      card: "0 40% 10%",
    },
  },
  {
    id: "candy",
    name: "Candy Land",
    emoji: "🍭",
    description: "Sweet treats",
    colors: {
      primary: "330 100% 65%",
      secondary: "180 80% 60%",
      accent: "60 100% 60%",
      background: "340 30% 12%",
      card: "340 25% 16%",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    emoji: "🤖",
    description: "Future tech",
    colors: {
      primary: "180 100% 50%",
      secondary: "320 100% 55%",
      accent: "60 100% 50%",
      background: "240 50% 5%",
      card: "240 45% 10%",
    },
  },
  {
    id: "jungle",
    name: "Jungle Safari",
    emoji: "🦁",
    description: "Wild adventure",
    colors: {
      primary: "80 70% 45%",
      secondary: "35 90% 45%",
      accent: "160 70% 40%",
      background: "80 40% 8%",
      card: "80 35% 12%",
    },
  },
  {
    id: "aurora",
    name: "Aurora Borealis",
    emoji: "✨",
    description: "Northern lights",
    colors: {
      primary: "160 100% 50%",
      secondary: "280 80% 60%",
      accent: "200 100% 55%",
      background: "220 50% 8%",
      card: "220 45% 12%",
    },
  },
  {
    id: "retro",
    name: "Retro Arcade",
    emoji: "👾",
    description: "80s nostalgia",
    colors: {
      primary: "350 100% 60%",
      secondary: "180 100% 45%",
      accent: "60 100% 50%",
      background: "260 60% 8%",
      card: "260 50% 12%",
    },
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("wavelength_theme");
    if (savedTheme) {
      const theme = themes.find((t) => t.id === savedTheme);
      if (theme) setCurrentTheme(theme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", currentTheme.colors.primary);
    root.style.setProperty("--secondary", currentTheme.colors.secondary);
    root.style.setProperty("--accent", currentTheme.colors.accent);
    root.style.setProperty("--background", currentTheme.colors.background);
    root.style.setProperty("--card", currentTheme.colors.card);
  }, [currentTheme]);

  const setTheme = (themeId: ThemeName) => {
    const theme = themes.find((t) => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem("wavelength_theme", themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
