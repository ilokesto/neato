import { useEffect } from "react";
import { Theme } from "../types";

export function useThemeHydration(
  setTheme: (theme: Theme) => void,
  setEffectiveTheme: (theme: "light" | "dark") => void,
  setIsHydrated: (isHydrated: boolean) => void
) {
  useEffect(() => {
    setIsHydrated(true);

    // localStorage에서 테마 값 읽기
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark" || saved === "system") {
      setTheme(saved as Theme);
    }

    // 현재 DOM 상태를 기준으로 초기 effectiveTheme 설정
    const currentlyDark = document.documentElement.classList.contains("dark");
    setEffectiveTheme(currentlyDark ? "dark" : "light");
  }, []);
}
