import { useEffect, useLayoutEffect } from "react";
import { useEffectiveThemeState } from "./useEffectiveThemeState";

// useLayoutEffect는 SSR에서 경고를 발생시키므로 조건부로 사용
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 테마 하이드레이션 훅
 * - 클라이언트 사이드에서 초기 테마 상태를 설정
 * - useInternalTheme의 persist 미들웨어가 자동으로 로컬스토리지에서 로드
 * - DOM의 현재 상태를 읽어 effectiveTheme 초기화
 * - useLayoutEffect를 사용하여 페인트 전에 동기적으로 상태 업데이트
 */
export function useThemeHydration() {
  const [, setState] = useEffectiveThemeState();

  // useLayoutEffect를 사용하여 브라우저가 페인트하기 전에 실행
  // 이렇게 하면 깜빡임이 완전히 제거됩니다
  useIsomorphicLayoutEffect(() => {
    // persist 미들웨어가 이미 로컬스토리지에서 theme을 로드했으므로
    // 현재 DOM 상태를 기준으로 초기 effectiveTheme만 설정
    const currentlyDark = document.documentElement.classList.contains("dark");
    
    setState({
      effectiveTheme: currentlyDark ? "dark" : "light",
      isHydrated: true,
    });
  }, [setState]);
}