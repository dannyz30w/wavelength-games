import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeName = 
  | "space" 
  | "desert" 
  | "forest" 
  | "neon" 
  | "arctic"
  | "volcano"
  | "candy"
  | "aurora";

export interface Theme {
  id: ThemeName;
  name: string;
  icon: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
  };
  soundProfile: "space" | "desert" | "forest" | "neon" | "ice" | "fire" | "sweet" | "ethereal";
}

export const themes: Theme[] = [
  {
    id: "space",
    name: "Deep Space",
    icon: "theme-icon-space",
    description: "Stars and galaxies",
    colors: {
      primary: "210 100% 55%",
      secondary: "265 90% 62%",
      accent: "15 95% 60%",
      background: "235 15% 6%",
      card: "235 12% 9%",
    },
    soundProfile: "space",
  },
  {
    id: "desert",
    name: "Desert Oasis",
    icon: "theme-icon-desert",
    description: "Sandy dunes",
    colors: {
      primary: "35 100% 55%",
      secondary: "25 85% 50%",
      accent: "150 60% 45%",
      background: "30 30% 10%",
      card: "30 25% 14%",
    },
    soundProfile: "desert",
  },
  {
    id: "forest",
    name: "Enchanted Forest",
    icon: "theme-icon-forest",
    description: "Mystical woodland",
    colors: {
      primary: "140 70% 45%",
      secondary: "100 60% 40%",
      accent: "45 100% 55%",
      background: "140 30% 8%",
      card: "140 25% 12%",
    },
    soundProfile: "forest",
  },
  {
    id: "neon",
    name: "Neon Nights",
    icon: "theme-icon-neon",
    description: "Electric vibes",
    colors: {
      primary: "320 100% 60%",
      secondary: "180 100% 50%",
      accent: "60 100% 50%",
      background: "270 50% 5%",
      card: "270 40% 10%",
    },
    soundProfile: "neon",
  },
  {
    id: "arctic",
    name: "Arctic Ice",
    icon: "theme-icon-arctic",
    description: "Frozen wonderland",
    colors: {
      primary: "200 80% 70%",
      secondary: "220 70% 80%",
      accent: "180 60% 55%",
      background: "210 40% 10%",
      card: "210 35% 15%",
    },
    soundProfile: "ice",
  },
  {
    id: "volcano",
    name: "Volcanic",
    icon: "theme-icon-volcano",
    description: "Molten fire",
    colors: {
      primary: "15 100% 55%",
      secondary: "35 100% 50%",
      accent: "0 90% 60%",
      background: "0 50% 6%",
      card: "0 40% 10%",
    },
    soundProfile: "fire",
  },
  {
    id: "candy",
    name: "Candy Land",
    icon: "theme-icon-candy",
    description: "Sweet treats",
    colors: {
      primary: "330 100% 65%",
      secondary: "180 80% 60%",
      accent: "60 100% 60%",
      background: "340 30% 12%",
      card: "340 25% 16%",
    },
    soundProfile: "sweet",
  },
  {
    id: "aurora",
    name: "Aurora Borealis",
    icon: "theme-icon-aurora",
    description: "Northern lights",
    colors: {
      primary: "160 100% 50%",
      secondary: "280 80% 60%",
      accent: "200 100% 55%",
      background: "220 50% 8%",
      card: "220 45% 12%",
    },
    soundProfile: "ethereal",
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
