import { useEffect } from "react";
import { Theme } from "../types";

export function useThemeHydration(
  setTheme: (theme: Theme) => void,
  setEffectiveTheme: (theme: "light" | "dark") => void,
  setIsHydrated: (isHydrated: boolean) => void
) {
  useEffect(() => {
    // localStorage에서 테마 값 읽기
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark" || saved === "system") {
      setTheme(saved as Theme);
    }

    // 현재 DOM 상태를 기준으로 초기 effectiveTheme 설정
    const currentlyDark = document.documentElement.classList.contains("dark");
    setEffectiveTheme(currentlyDark ? "dark" : "light");

    // 모든 초기값을 설정한 뒤에 hydration 플래그를 true로 설정합니다.
    // 이 순서를 지키면 다른 effect들이 아직 오래된 theme 값으로 실행되는 것을 막을 수 있습니다.
    setIsHydrated(true);
  }, []);
}
