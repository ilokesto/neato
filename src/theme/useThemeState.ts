import { SetStateAction, useRef } from "react";
import { Theme } from "../types";
import { TRANSITION_CLASS } from "./constants";
import { useInternalTheme } from "./useInternalTheme";

/**
 * 테마 상태 관리 훅
 * - useInternalTheme을 사용하여 자동으로 로컬스토리지와 동기화
 * - 테마 변경 시 부드러운 전환 효과 제공
 */
export function useThemeState() {
  const [theme, setInternalTheme] = useInternalTheme();
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

      // 200ms 이후에 transition 클래스 제거 (150ms transition + 50ms 여유)
      transitionTimeoutRef.current = window.setTimeout(() => {
        html.classList.remove(TRANSITION_CLASS);
        transitionTimeoutRef.current = null;
      }, 200);
    } catch (e) {
      // DOM 접근 실패 시 그냥 계속
    }

    // persist 미들웨어가 자동으로 로컬스토리지에 저장
    setInternalTheme(newTheme);
  };

  return { theme, setTheme };
}