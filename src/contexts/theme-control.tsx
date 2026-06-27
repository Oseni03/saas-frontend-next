"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  resetPrimaryColor: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 1. Light/Dark theme mode state
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("index-theme-mode") as ThemeMode;
      if (saved === "light" || saved === "dark") {
        return saved;
      }
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      return systemPrefersDark ? "dark" : "light";
    }
    return "light";
  });

  // 2. Primary brand color state
  const [primaryColor, setPrimaryColorState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const savedColor = localStorage.getItem("index-primary-color");
      // If they had the original black or empty, override with Indigo
      if (savedColor === "#000000" || !savedColor) {
        return "#4f46e5";
      }
      if (savedColor && savedColor.startsWith("#")) {
        return savedColor;
      }
    }
    return "#4f46e5";
  });

  // 3. Helper to apply CSS variables to document root
  const applyVariables = useCallback((mode: ThemeMode, primary: string) => {
    const root = document.documentElement;

    // Apply primary
    root.style.setProperty("--primary", primary);

    // Apply basic background, foreground, border
    if (mode === "dark") {
      root.style.setProperty("--background", "#0a0a0a");
      root.style.setProperty("--foreground", "#f5f5f5");
      root.style.setProperty("--border", "#262626");

      // In dark mode, if primary color is very dark (like black #000000), we should fall back
      // or ensure primary-foreground has contrast. For true monochrome noir on dark background:
      // if primary is black (#000000 or near dark), we want primary-foreground to be #ffffff and background to be #ffffff!
      // But let's keep it clean: --primary-foreground can be opposite, or simply white.
      // Usually, if --primary is black, we render custom contrast. Let's make it look pristine.
      if (primary === "#000000" || primary === "#0a0a0a") {
        root.style.setProperty("--primary", "#ffffff"); // invert black to white primary button in dark mode
        root.style.setProperty("--primary-foreground", "#000000");
      } else {
        root.style.setProperty("--primary-foreground", "#ffffff");
      }
      root.classList.add("dark");
    } else {
      root.style.setProperty("--background", "#ffffff");
      root.style.setProperty("--foreground", "#0a0a0a");
      root.style.setProperty("--border", "#e5e5e5");
      root.style.setProperty("--primary-foreground", "#ffffff");
      root.classList.remove("dark");
    }
  }, []);

  // Sync variables on change
  useEffect(() => {
    applyVariables(themeMode, primaryColor);
    localStorage.setItem("index-theme-mode", themeMode);
    localStorage.setItem("index-primary-color", primaryColor);
  }, [themeMode, primaryColor, applyVariables]);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setPrimaryColor = useCallback((color: string) => {
    setPrimaryColorState(color);
  }, []);

  const resetPrimaryColor = useCallback(() => {
    setPrimaryColorState("#4f46e5");
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        toggleTheme,
        primaryColor,
        setPrimaryColor,
        resetPrimaryColor,
        isDark: themeMode === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook matching user guidelines for "using use-theme" or useTheme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
