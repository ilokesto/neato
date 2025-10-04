import { useEffect, useLayoutEffect } from "react";
import { useEffectiveThemeState } from "./useEffectiveThemeState";

// useLayoutEffect는 SSR에서 경고를 발생시키므로 조건부로 사용
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 테마 DOM 효과 훅
 * - effectiveTheme에 따라 DOM의 'dark' 클래스를 토글
 * - useInternalTheme이 자동으로 로컬스토리지를 처리하므로 별도의 저장 로직 불필요
 * - useLayoutEffect를 사용하여 페인트 전에 동기적으로 DOM 업데이트
 */
export function useThemeDOMEffect() {
  const [{ effectiveTheme, isHydrated }] = useEffectiveThemeState();

  useIsomorphicLayoutEffect(() => {
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
  }, [effectiveTheme, isHydrated]);
}