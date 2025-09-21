import { useEffect } from "react";
import { Theme } from "../types";

export function useThemeDOMEffect(
  theme: Theme,
  effectiveTheme: "light" | "dark",
  isHydrated: boolean
) {
  useEffect(() => {
    if (!isHydrated) return;

    // 현재 DOM 상태 확인
    const htmlElement = document.documentElement;
    const currentlyDark = htmlElement.classList.contains("dark");
    const shouldBeDark = effectiveTheme === "dark";

    // 상태가 다를 때만 변경
    if (shouldBeDark && !currentlyDark) {
      htmlElement.classList.add("dark");
    } else if (!shouldBeDark && currentlyDark) {
      htmlElement.classList.remove("dark");
    }

    // localStorage에 저장
    if (theme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", theme);
    }
  }, [theme, effectiveTheme, isHydrated]);
}
