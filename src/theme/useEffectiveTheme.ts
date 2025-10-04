import { useEffect } from "react";
import { Theme } from "../types";
import { useEffectiveThemeState } from "./useEffectiveThemeState";

/**
 * 실제 적용될 테마 계산 훅
 * - theme이 "system"인 경우 시스템 테마를 감지
 * - theme이 "light" 또는 "dark"인 경우 해당 값 사용
 * - 시스템 테마 변경을 실시간으로 감지하여 effectiveTheme 업데이트
 */
export function useEffectiveTheme(theme: Theme) {
  const [state, setState] = useEffectiveThemeState();

  useEffect(() => {
    if (!state.isHydrated) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateEffectiveTheme = () => {
      const newEffectiveTheme = theme === "system" 
        ? (mediaQuery.matches ? "dark" : "light")
        : theme;

      setState((prev) => ({
        ...prev,
        effectiveTheme: newEffectiveTheme,
      }));
    };

    // 초기 설정
    updateEffectiveTheme();

    // 시스템 테마 변경 감지
    const handler = () => {
      if (theme === "system") {
        updateEffectiveTheme();
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme, state.isHydrated, setState]);
}