import { useEffect } from "react";
import { Theme } from "../types";

export function useEffectiveTheme(
  theme: Theme,
  isHydrated: boolean,
  setEffectiveTheme: (theme: "light" | "dark") => void
) {
  useEffect(() => {
    if (!isHydrated) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateEffectiveTheme = () => {
      if (theme === "system") {
        setEffectiveTheme(mediaQuery.matches ? "dark" : "light");
      } else {
        setEffectiveTheme(theme);
      }
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
  }, [theme, isHydrated]);
}
