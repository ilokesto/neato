import { useEffect } from "react";
import { useEffectiveThemeState } from "./useEffectiveThemeState";

/**
 * 테마 하이드레이션 훅
 * - 클라이언트 사이드에서 초기 테마 상태를 설정
 * - useInternalTheme의 persist 미들웨어가 자동으로 로컬스토리지에서 로드
 * - DOM의 현재 상태를 읽어 effectiveTheme 초기화
 */
export function useThemeHydration() {
  const [, setState] = useEffectiveThemeState();

  useEffect(() => {
    // persist 미들웨어가 이미 로컬스토리지에서 theme을 로드했으므로
    // 현재 DOM 상태를 기준으로 초기 effectiveTheme만 설정
    const currentlyDark = document.documentElement.classList.contains("dark");
    
    setState({
      effectiveTheme: currentlyDark ? "dark" : "light",
      isHydrated: true,
    });
  }, [setState]);
}