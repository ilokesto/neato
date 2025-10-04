import React, { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Theme } from "../types";
import { useEffectiveTheme } from "./useEffectiveTheme";
import { useEffectiveThemeState } from "./useEffectiveThemeState";
import { useThemeDOMEffect } from "./useThemeDOMEffect";
import { useThemeHydration } from "./useThemeHydration";
import { useThemeState } from "./useThemeState";
import { useThemeTransitionStyle } from "./useThemeTransitionStyle";

interface ThemeContextType {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  effectiveTheme: "light" | "dark";
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 테마 프로바이더
 * - useInternalTheme을 통해 자동으로 로컬스토리지에서 테마를 읽고 씁니다
 * - persist 미들웨어가 모든 로컬스토리지 동기화를 처리합니다
 * - 시스템 테마 감지 및 부드러운 전환 효과를 제공합니다
 * - 전역 상태로 effectiveTheme과 isHydrated를 관리하여 초기 렌더링 깜빡임 방지
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeState();
  const [{ effectiveTheme, isHydrated }] = useEffectiveThemeState();

  useThemeHydration();
  useThemeTransitionStyle();
  useEffectiveTheme(theme);
  useThemeDOMEffect();

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

// Re-export utilities
export { preventThemeFlash, withViewTransition } from "./preventFlash";
export { createThemeScript } from "./theme-script";
