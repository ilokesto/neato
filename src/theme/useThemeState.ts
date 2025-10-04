import { create } from "@ilokesto/caro-kann";
import { persist } from "@ilokesto/caro-kann/middleware";
import { SetStateAction, useRef } from "react";
import { Theme } from "../types";
import { TRANSITION_CLASS } from "./constants";

const useTheme = create(persist(
  "system" as Theme, // default value
  {
    local: "theme",
  }
))

export function useThemeState() {
  const [theme, setThemeState] = useTheme();
  const transitionTimeoutRef = useRef<number | null>(null);

  const setTheme = (newTheme: SetStateAction<Theme>) => {
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
