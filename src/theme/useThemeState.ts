import { useState, useRef } from "react";
import { Theme } from "../types";
import { TRANSITION_CLASS } from "./constants";

export function useThemeState() {
  const [theme, setThemeState] = useState<Theme>("system");
  const transitionTimeoutRef = useRef<number | null>(null);

  const setTheme = (newTheme: Theme) => {
    try {
      const html = document.documentElement;

      // transition 클래스 추가
      html.classList.add(TRANSITION_CLASS);

      // 이전 타이머가 있으면 제거
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      // 250ms 이후에 transition 클래스 제거
      transitionTimeoutRef.current = window.setTimeout(() => {
        html.classList.remove(TRANSITION_CLASS);
        transitionTimeoutRef.current = null;
      }, 250);
    } catch (e) {
      // DOM 접근 실패 시 그냥 계속
    }

    setThemeState(newTheme);
  };

  return { theme, setTheme, setThemeState };
}
