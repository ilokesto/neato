import React, { createContext, useContext, useState } from "react";
import { Theme } from "../types";
import { useEffectiveTheme } from "./useEffectiveTheme";
import { useThemeDOMEffect } from "./useThemeDOMEffect";
import { useThemeHydration } from "./useThemeHydration";
import { useThemeState } from "./useThemeState";
import { useThemeTransitionStyle } from "./useThemeTransitionStyle";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "light" | "dark";
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, setThemeState } = useThemeState();
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    "light"
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useThemeHydration(setThemeState, setEffectiveTheme, setIsHydrated);
  useThemeTransitionStyle();
  useEffectiveTheme(theme, isHydrated, setEffectiveTheme);
  useThemeDOMEffect(theme, effectiveTheme, isHydrated);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, effectiveTheme, isHydrated }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}